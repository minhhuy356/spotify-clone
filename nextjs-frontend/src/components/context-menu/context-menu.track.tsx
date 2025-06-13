import React, { useEffect, useRef, useState } from "react";
import { ITrack } from "@/types/data";
import {
  findIndexById,
  insertAt,
} from "@/helper/context-menu/context-menu.track";

import {
  selectInLibrary,
  selectIsOpenContextMenuTrack,
  selectPosition,
  selectTemporaryTrack,
  setOpenContextMenuTrack,
  setPosition,
} from "@/lib/features/local/local.slice";
import {
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectWaitTrackList,
  setWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { TbPlaylistAdd } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { IoAddOutline, IoShareOutline } from "react-icons/io5";
import { IoIosAddCircleOutline, IoIosRadio } from "react-icons/io";
import { GoPeople } from "react-icons/go";
import { LuListMusic } from "react-icons/lu";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { TiPinOutline, TiTick } from "react-icons/ti";
import { user_activity_service } from "@/service/user-activity.service";

interface IHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpenModalDeleteTrack: (value: boolean) => void;
}

const ContextMenuTrack = ({ setIsOpenModalDeleteTrack }: IHTMLProps) => {
  const session = useAppSelector(selectSession);
  const isPlay = useAppSelector(selectIsPlay);
  const isOpenContextMenuTrack = useAppSelector(selectIsOpenContextMenuTrack);
  const temporaryTrack = useAppSelector(selectTemporaryTrack);
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const inLibrary = useAppSelector(selectInLibrary);

  const position = useAppSelector(selectPosition);
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    dispatch(
      setOpenContextMenuTrack({
        isOpenContextMenuTrack: false,
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

  const handleAddWaitTrackList = () => {
    if (temporaryTrack) {
      // Kiểm tra nếu track đã tồn tại trong danh sách
      const isTrackInList = waitTrackList.some(
        (t) => t._id === temporaryTrack._id
      );
      if (isTrackInList) {
        handleCloseTab();
        return;
      }
      // Nếu track chưa tồn tại, thêm vào danh sách
      const newWaitTrackList = [...waitTrackList, temporaryTrack];
      dispatch(setWaitTrackList(newWaitTrackList));
      handleCloseTab();
    }
  };

  const handleAddTrackNext = () => {
    if (temporaryTrack) {
      const isTrackInList = waitTrackList.some(
        (t: ITrack) =>
          t._id ===
          waitTrackList.find(
            (t: ITrack) => t._id === temporaryTrack._id || temporaryTrack._id
          )?._id
      );

      //Xóa bài đang có để thêm vào
      var clone = [...waitTrackList];
      if (isTrackInList) {
        clone = clone.filter((item) => item._id !== temporaryTrack._id);
      }

      if (!isPlay && currentTrack) {
        const indexCurrentTrack = findIndexById(clone, currentTrack);
        const updatedList = insertAt(
          clone,
          temporaryTrack,
          indexCurrentTrack + 1
        );

        dispatch(
          play({
            waitTrackList: updatedList,
            currentTrack: temporaryTrack,

            playingSource: {
              in: "track",
              before: "track",
            },
          })
        );
        handleCloseTab();
      }

      const indexCurrentTrack = findIndexById(clone, temporaryTrack);
      const updatedList = insertAt(
        clone,
        temporaryTrack,
        indexCurrentTrack + 1
      );
      dispatch(setWaitTrackList(updatedList));
      handleCloseTab();
    }
  };

  const handleDeleteTrack = () => {
    if (temporaryTrack) {
      const isTrackInList = waitTrackList.some(
        (t: ITrack) =>
          t._id ===
          waitTrackList.find(
            (t: ITrack) => t._id === temporaryTrack._id || temporaryTrack._id
          )?._id
      );

      //Xóa bài đang có để thêm vào
      var clone = [...waitTrackList];
      if (isTrackInList) {
        clone = clone.filter((item) => item._id !== temporaryTrack._id);
      }
      dispatch(setWaitTrackList(clone));
      handleCloseTab();
    }
  };

  useEffect(() => {
    if (isOpenContextMenuTrack) {
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
  }, [isOpenContextMenuTrack]);

  const isLikeTrack = session?.user.tracks.some(
    (item) => item._id === temporaryTrack?._id
  );

  const handleSubscribeTrack = async () => {
    handleCloseTab();
    if (!isLikeTrack) {
      callApiSubscribeTrack();
    } else {
      if (inLibrary) {
        handleConfirmDeleteTrack();
      } else {
        callApiSubscribeTrack();
      }
    }
  };

  const handleConfirmDeleteTrack = () => {
    setIsOpenModalDeleteTrack(true);
    handleCloseTab();
  };

  const callApiSubscribeTrack = async () => {
    if (session && temporaryTrack) {
      const res = await user_activity_service.subscribeTrack(session, {
        trackId: temporaryTrack?._id,
        quantity: 1,
      });
      if (res) {
        const newTracks = isLikeTrack
          ? session.user.tracks.filter(
              (item) => item._id !== temporaryTrack._id
            )
          : [...session.user.tracks, temporaryTrack];

        dispatch(setSessionActivity({ tracks: newTracks }));
      }
    }
  };

  if (!isOpenContextMenuTrack) return null; // Ẩn menu nếu không mở

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position?.y || 0,
        left: position?.x || 0,
      }}
      className="bg-40 text-white shadow-lg rounded overflow-hidden z-[10000] min-w-[300px] p-1"
    >
      <div className="flex flex-col bg-40 text-white">
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer  py-3 px-3">
          <div className="flex items-center text-white-08">
            <IoAddOutline size={20} />
          </div>
          <div>Thêm vào danh sách phát</div>
        </div>
        <div onClick={handleSubscribeTrack}>
          {isLikeTrack ? (
            <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer  py-3 px-3 items-center">
              <div className="flex items-center bg-green-base size-[20px] rounded-full relative">
                <TiTick
                  size={15}
                  className="text-40 absolute top-[52%] left-1/2 -translate-1/2"
                />
              </div>
              <div className="">Xóa khỏi bài hát đã thích của bạn</div>
            </div>
          ) : (
            <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer  py-3 px-3">
              <div className="flex items-center text-white-08 ">
                <IoIosAddCircleOutline size={20} />
              </div>
              <div>Lưu vào Bài hát đã thích của bạn</div>
            </div>
          )}
        </div>
        <div
          className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer  py-3 px-3 "
          onClick={() => handleAddWaitTrackList()}
        >
          <div className="flex items-center text-white-08">
            <TbPlaylistAdd size={20} />
          </div>
          <div>Thêm vào danh sách chờ</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer  py-3 px-3 border-t-[1px] border-70 border-solid">
          <div className="flex items-center text-white-08">
            <IoIosRadio size={20} />
          </div>
          <div>Chuyển đến radio theo bài hát</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer  py-3 px-3 ">
          <div className="flex items-center text-white-08">
            <GoPeople size={20} />
          </div>
          <div>Chuyển tới nghệ sĩ</div>
        </div>{" "}
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer  py-3 px-3 ">
          <div className="flex items-center text-white-08">
            <LuListMusic size={20} />
          </div>
          <div>Xem thông tin ghi công</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer  py-3 px-3 border-t-[1px] border-70 border-solid ">
          <div className="flex items-center text-white-08">
            <IoShareOutline size={20} />
          </div>
          <div>Chia sẽ</div>
        </div>
        <div
          className="flex gap-3 opacity-90 hover:opacity-100 hover:bg-hover  cursor-pointer  py-3 px-3 border-t-[1px] border-70 border-solid"
          onClick={handleDeleteTrack}
        >
          <div className="flex items-center text-white-08">
            <MdDeleteOutline />
          </div>
          <div>Xóa</div>
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default ContextMenuTrack;
