import React, { useEffect, useRef, useState } from "react";
import { IArtist, IUserActivity } from "@/types/data";

import { TbPlaylistAdd } from "react-icons/tb";
import { SlUserFollow } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectIsOpenContextMenuArtist,
  selectPosition,
  selectTemporaryArtist,
  setOpenContextMenuArtist,
  setPosition,
} from "@/lib/features/local/local.slice";
import { CgPlayList } from "react-icons/cg";
import { MdBlock, MdOutlineReportGmailerrorred } from "react-icons/md";
import { IoIosRadio } from "react-icons/io";
import { IoShareOutline } from "react-icons/io5";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { sendRequest } from "@/api/api";
import { api_user_activity, backendUrl } from "@/api/url";
import store from "@/lib/store";

interface IHTMLProps extends React.HTMLAttributes<HTMLDivElement> {}

const SubscribeArtistQueue: Array<{ artistId: string; quantity: number }> = [];
let isProcessingQueue = false;

const processSubscribeAritstQueue = async (session: any) => {
  if (isProcessingQueue || SubscribeArtistQueue.length === 0) return;
  isProcessingQueue = true;
  while (SubscribeArtistQueue.length > 0) {
    const action = SubscribeArtistQueue.shift();
    if (!action) continue;
    try {
      await sendRequest<IBackendRes<IUserActivity>>({
        url: `${backendUrl}${api_user_activity.artist}`,
        method: "POST",
        body: {
          user: session?.user._id,
          artist: action.artistId,
          quantity: action.quantity,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    } catch (error) {
      console.error(
        `Error processing like for track ${action.artistId}:`,
        error
      );
    }
  }
  isProcessingQueue = false;
};

const ContextMenuArtist = ({}: IHTMLProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const position = useAppSelector(selectPosition);
  const temporaryArtist = useAppSelector(selectTemporaryArtist);
  const isOpenContextMenuArtist = useAppSelector(selectIsOpenContextMenuArtist);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    dispatch(setOpenContextMenuArtist({ isOpenContextMenuArtist: false }));
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
    if (isOpenContextMenuArtist) {
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
  }, [isOpenContextMenuArtist]);

  const handleSubscribeArtist = async () => {
    if (!session || !temporaryArtist) return;

    handleCloseTab();

    const isSubscribed = session.user.artists.some(
      (a) => a._id === temporaryArtist._id
    );
    const newArtists = isSubscribed
      ? session.user.artists.filter((item) => item._id !== temporaryArtist._id)
      : [...session.user.artists, temporaryArtist];

    SubscribeArtistQueue.push({
      artistId: temporaryArtist._id,
      quantity: isSubscribed ? -1 : 1,
    });

    if (!isProcessingQueue) {
      processSubscribeAritstQueue(session);
    }

    dispatch(
      setSessionActivity({ artists: newArtists, tracks: [], albums: [] })
    );

    // **Lấy lại session mới từ Redux rồi lưu vào localStorage**
    setTimeout(() => {
      const newSession = JSON.stringify(store.getState().auth.session); // 🔹 Lấy lại session mới từ Redux
      console.log(newArtists);
      localStorage.setItem("session", newSession);
    }, 100);
  };

  if (!isOpenContextMenuArtist) return null; // Ẩn menu nếu không mở

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position?.y || 0,
        left: position?.x || 0,
      }}
      className=" bg-tab text-white shadow-lg rounded-lg z-[10000]"
    >
      <div className="flex flex-col bg-tab text-white">
        <div
          className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5"
          onClick={handleSubscribeArtist}
        >
          <div className="flex items-center">
            <SlUserFollow />
          </div>
          <div>Theo dõi</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center">
            <MdBlock />
          </div>
          <div>Không phát nghệ sĩ này</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center">
            <IoIosRadio />
          </div>
          <div>Chuyển đến radio theo nghệ sĩ</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center">
            <MdOutlineReportGmailerrorred />
          </div>
          <div>Báo cáo</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center">
            <IoShareOutline />
          </div>
          <div>Chia sẽ</div>
        </div>
      </div>
    </div>
  );
};

export default ContextMenuArtist;
