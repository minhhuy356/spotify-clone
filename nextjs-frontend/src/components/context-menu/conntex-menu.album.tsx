import React, { useEffect, useRef, useState } from "react";
import { IAlbum, IUserActivity } from "@/types/data";

import { TbPlaylistAdd } from "react-icons/tb";
import { SlUserFollow } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
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

interface IHTMLProps extends React.HTMLAttributes<HTMLDivElement> {}

const SubscribeAlbumQueue: Array<{ AlbumId: string; quantity: number }> = [];
let isProcessingQueue = false;

const processSubscribeAritstQueue = async (session: any) => {
  if (isProcessingQueue || SubscribeAlbumQueue.length === 0) return;
  isProcessingQueue = true;
  while (SubscribeAlbumQueue.length > 0) {
    const action = SubscribeAlbumQueue.shift();
    if (!action) continue;
    try {
      await sendRequest<IBackendRes<IUserActivity>>({
        url: `${backendUrl}${api_user_activity.album}`,
        method: "POST",
        body: {
          user: session?.user._id,
          Album: action.AlbumId,
          quantity: action.quantity,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    } catch (error) {
      console.error(
        `Error processing like for track ${action.AlbumId}:`,
        error
      );
    }
  }
  isProcessingQueue = false;
};

const ContextMenuAlbum = ({}: IHTMLProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const position = useAppSelector(selectPosition);
  const temporaryAlbum = useAppSelector(selectTemporaryAlbum);
  const isOpenContextMenuAlbum = useAppSelector(selectIsOpenContextMenuAlbum);
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    dispatch(setOpenContextMenuAlbum({ isOpenContextMenuAlbum: false }));
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

  const handleSubscribeAlbum = async () => {
    if (!session || !temporaryAlbum) return;

    handleCloseTab();

    const isSubscribed = session.user.albums.some(
      (a) => a._id === temporaryAlbum._id
    );
    const newAlbums = isSubscribed
      ? session.user.albums.filter((item) => item._id !== temporaryAlbum._id)
      : [...session.user.albums, temporaryAlbum];

    SubscribeAlbumQueue.push({
      AlbumId: temporaryAlbum._id,
      quantity: isSubscribed ? -1 : 1,
    });

    if (!isProcessingQueue) {
      processSubscribeAritstQueue(session);
    }

    dispatch(
      setSessionActivity({ artists: [], tracks: [], albums: newAlbums })
    );

    // **Lấy lại session mới từ Redux rồi lưu vào localStorage**
    setTimeout(() => {
      const newSession = JSON.stringify(store.getState().auth.session); // 🔹 Lấy lại session mới từ Redux

      localStorage.setItem("session", newSession);
    }, 100);
  };

  const isLikeAlbum = session?.user.albums.some(
    (item) => item._id === temporaryAlbum?._id
  );

  const handleAddWaitTrackList = () => {
    // if (temporaryAlbum) {
    //   // Kiểm tra nếu track đã tồn tại trong danh sách
    //   const isTrackInList = waitTrackList.some(
    //     (t) => t._id === temporaryAlbum._id
    //   );
    //   if (isTrackInList) {
    //     handleCloseTab();
    //     return;
    //   }
    //   // Nếu track chưa tồn tại, thêm vào danh sách
    //   const newWaitTrackList = [...waitTrackList, temporaryAlbum];
    //   dispatch(setWaitTrackList(newWaitTrackList));
    //   handleCloseTab();
    // }
  };

  if (!isOpenContextMenuAlbum) return null; // Ẩn menu nếu không mở

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
      <div className="flex flex-col bg-40 text-white">
        {isLikeAlbum ? (
          <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-4 items-center">
            <div className="flex items-center bg-green-500 size-[20px] rounded-full relative">
              <TiTick
                size={15}
                className="text-40 absolute top-[52%] left-1/2 -translate-1/2"
              />
            </div>
            <div className="">Xóa khỏi thư viện</div>
          </div>
        ) : (
          <div
            className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-4"
            onClick={handleSubscribeAlbum}
          >
            <div className="flex items-center">
              <SlUserFollow size={20} />
            </div>
            <div>Thêm vào thư viện</div>
          </div>
        )}
        <div
          className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-4 "
          onClick={() => handleAddWaitTrackList()}
        >
          <div className="flex items-center text-white-06">
            <TbPlaylistAdd size={20} />
          </div>
          <div>Thêm vào danh sách chờ</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-4">
          <div className="flex items-center text-white-06">
            <IoIosRadio size={20} />
          </div>
          <div>Chuyển đến radio theo nghệ sĩ</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-4 border-t-[1px] border-70 border-solid">
          <div className="flex items-center text-white-06">
            <TiPinOutline size={20} />
          </div>
          <div>Ghim Album</div>
        </div>{" "}
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-4">
          <div className="flex items-center text-white-06">
            <IoIosAdd size={20} />
          </div>
          <div>Thêm vào danh sách phát</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-4 border-t-[1px] border-70 border-solid">
          <div className="flex items-center text-white-06">
            <IoShareOutline size={20} />
          </div>
          <div>Chia sẽ</div>
        </div>
        <div className="flex gap-3 opacity-90 hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-4 border-t-[1px] border-70 border-solid">
          <div className="flex items-center text-white-06">
            <MdComputer size={20} />
          </div>
          <div>Mở trong ứng dụng máy tính</div>
        </div>
      </div>
    </div>
  );
};

export default ContextMenuAlbum;
