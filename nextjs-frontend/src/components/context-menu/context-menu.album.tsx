import React, { useEffect, useRef, useState } from "react";
import { IAlbum, IUserActivity } from "@/types/data";

import { TbPlaylistAdd } from "react-icons/tb";
import { SlUserFollow } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectInLibrary,
  selectIsOpenContextMenuAlbum,
  selectPosition,
  selectTemporaryAlbum,
  setOpenContextMenuAlbum,
  setPosition,
} from "@/lib/features/local/local.slice";
import { CgPlayList } from "react-icons/cg";
import {
  MdBlock,
  MdComputer,
  MdDeleteOutline,
  MdOutlineReportGmailerrorred,
} from "react-icons/md";
import { IoIosAdd, IoIosClose, IoIosRadio } from "react-icons/io";
import { IoShareOutline } from "react-icons/io5";
import {
  selectSession,
  setPinedAt,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { sendRequest } from "@/api/api";
import { api_user_activity, backendUrl } from "@/api/url";
import store from "@/lib/store";
import { TiPinOutline, TiTick } from "react-icons/ti";
import {
  selectWaitTrackList,
  setWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { user_activity_service } from "@/service/user-activity.service";
import { RiPushpinLine } from "react-icons/ri";

interface IHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpenModalDeleteAlbum: (value: boolean) => void;
}

const ContextMenuAlbum = ({ setIsOpenModalDeleteAlbum }: IHTMLProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const position = useAppSelector(selectPosition);
  const temporaryAlbum = useAppSelector(selectTemporaryAlbum);
  const isOpenContextMenuAlbum = useAppSelector(selectIsOpenContextMenuAlbum);
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const inLibrary = useAppSelector(selectInLibrary);
  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    dispatch(
      setOpenContextMenuAlbum({
        isOpenContextMenuAlbum: false,
        inLibrary: false,
      })
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseTab();
      }
    };

    window.addEventListener("resize", handleCloseTab);
    window.addEventListener("wheel", handleCloseTab);
    document.addEventListener("mousedown", handleClickOutside); // Lắng nghe sự kiện click

    return () => {
      window.removeEventListener("resize", handleCloseTab);
      window.removeEventListener("wheel", handleCloseTab);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpenContextMenuAlbum) {
      if (!menuRef.current) return;

      const menuElement = menuRef.current;
      const menuRect = menuElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let newX = position?.x ?? 0;
      let newY = position?.y ?? 0;

      const isOverflowingBottom = menuRect.bottom > viewportHeight;
      const isOverflowingTop = menuRect.top < 0;
      const spaceAbove = position?.y!; // Khoảng trống phía trên chuột
      const spaceBelow = viewportHeight - position?.y!; // Khoảng trống phía dưới chuột
      if (isOverflowingBottom) {
        if (spaceAbove >= menuRect.height) {
          // Nếu phía trên đủ chỗ, đặt menu lên trên chuột
          newY = position?.y! - menuRect.height;
        } else {
          // Nếu không đủ, căn chỉnh để menu nằm trong viewport
          newY = Math.max(0, viewportHeight - menuRect.height);
        }
      }

      if (isOverflowingTop) {
        if (spaceBelow >= menuRect.height) {
          // Nếu phía dưới đủ chỗ, đặt menu dưới chuột
          newY = position?.y!;
        } else {
          // Nếu không đủ, căn chỉnh để menu nằm trong viewport
          newY = Math.min(viewportHeight - menuRect.height, position?.y!);
        }
      }

      dispatch(setPosition({ x: newX, y: newY }));
    }
  }, [isOpenContextMenuAlbum]);

  const isLikeAlbum = session?.user.albums.some(
    (item) => item._id === temporaryAlbum?._id
  );

  const handleSubscribeAlbum = async () => {
    handleCloseTab();
    if (!isLikeAlbum) {
      callApiSubscribeAlbum;
    } else {
      if (inLibrary) {
        handleConfirmDeleteAlbum;
      } else {
        callApiSubscribeAlbum;
      }
    }
  };

  const handleConfirmDeleteAlbum = () => {
    setIsOpenModalDeleteAlbum(true);
    handleCloseTab();
  };

  const callApiSubscribeAlbum = async () => {
    if (session && temporaryAlbum) {
      const res = await user_activity_service.subscribeAlbum(session, {
        albumId: temporaryAlbum?._id,
        quantity: isLikeAlbum ? -1 : 1,
      });
      if (res) {
        const newAlbums = isLikeAlbum
          ? session.user.albums.filter(
              (item) => item._id !== temporaryAlbum._id
            )
          : [...session.user.albums, temporaryAlbum];

        dispatch(setSessionActivity({ albums: newAlbums }));
      }
    }
  };

  // const handleAddWaitTrackList = () => {
  //   // if (temporaryAlbum) {
  //   //   // Kiểm tra nếu track đã tồn tại trong danh sách
  //   //   const isTrackInList = waitTrackList.some(
  //   //     (t) => t._id === temporaryAlbum._id
  //   //   );
  //   //   if (isTrackInList) {
  //   //     handleCloseTab();
  //   //     return;
  //   //   }
  //   //   // Nếu track chưa tồn tại, thêm vào danh sách
  //   //   const newWaitTrackList = [...waitTrackList, temporaryAlbum];
  //   //   dispatch(setWaitTrackList(newWaitTrackList));
  //   //   handleCloseTab();
  //   // }
  // };

  if (!isOpenContextMenuAlbum || !temporaryAlbum || !session) return null; // Ẩn menu nếu không mở

  const handlePin = async (pinned: boolean) => {
    handleCloseTab();
    const res = await user_activity_service.pin<IAlbum>(
      temporaryAlbum?._id,
      session?.access_token,
      "album",
      pinned
    );
    if (res) {
      dispatch(setPinedAt({ album: res }));
    }
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position?.y || 0,
        left: position?.x || 0,
      }}
      className=" bg-40 text-white shadow-lg rounded-lg z-[10000]"
    >
      <div
        className="flex flex-col bg-40 text-white p-1"
        onClick={handleSubscribeAlbum}
      >
        {isLikeAlbum ? (
          <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-4 items-center">
            <div className="flex items-center bg-green-base size-[20px] rounded-full relative">
              <TiTick
                size={15}
                className="text-40 absolute top-[52%] left-1/2 -translate-1/2"
              />
            </div>
            <div className="">Xóa khỏi thư viện</div>
          </div>
        ) : (
          <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
            <div className="flex items-center">
              <SlUserFollow size={20} />
            </div>
            <div>Thêm vào thư viện</div>
          </div>
        )}
        <div
          className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5 "
          // onClick={() => handleAddWaitTrackList()}
        >
          <div className="flex items-center text-white-08">
            <TbPlaylistAdd size={20} />
          </div>
          <div>Thêm vào danh sách chờ</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center text-white-08">
            <IoIosRadio size={20} />
          </div>
          <div>Chuyển đến radio theo nghệ sĩ</div>
        </div>
        {inLibrary && (
          <>
            {!temporaryAlbum.pinnedAt ? (
              <div
                className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 border-t-[1px] border-70 border-solid"
                onClick={() => handlePin(true)}
              >
                <div className="flex items-center text-white-08">
                  <RiPushpinLine size={20} />
                </div>
                <div>Ghim album</div>
              </div>
            ) : (
              <div
                className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 border-t-[1px] border-70 border-solid"
                onClick={() => handlePin(false)}
              >
                <div className="flex items-center text-green-500">
                  <RiPushpinLine size={20} />
                </div>
                <div>Bỏ ghim album</div>
              </div>
            )}
          </>
        )}

        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center text-white-08">
            <IoIosAdd size={20} />
          </div>
          <div>Thêm vào danh sách phát</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5 border-t-[1px] border-70 border-solid">
          <div className="flex items-center text-white-08">
            <IoShareOutline size={20} />
          </div>
          <div>Chia sẽ</div>
        </div>
        <div className="flex gap-3 opacity-90 hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5 border-t-[1px] border-70 border-solid">
          <div className="flex items-center text-white-08">
            <MdComputer size={20} />
          </div>
          <div>Mở trong ứng dụng máy tính</div>
        </div>
      </div>
    </div>
  );
};

export default ContextMenuAlbum;
