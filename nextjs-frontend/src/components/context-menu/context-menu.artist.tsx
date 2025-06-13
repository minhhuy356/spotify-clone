import React, { useEffect, useRef, useState } from "react";
import { IArtist, IUserActivity } from "@/types/data";

import { TbPlaylistAdd } from "react-icons/tb";
import { SlUserFollow } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectInLibrary,
  selectIsOpenContextMenuArtist,
  selectPosition,
  selectTemporaryArtist,
  setOpenContextMenuArtist,
  setPosition,
} from "@/lib/features/local/local.slice";
import { CgPlayList } from "react-icons/cg";
import {
  MdBlock,
  MdComputer,
  MdDeleteOutline,
  MdOutlineReportGmailerrorred,
} from "react-icons/md";
import { IoIosClose, IoIosRadio } from "react-icons/io";
import { IoShareOutline } from "react-icons/io5";
import {
  selectSession,
  setPinedAt,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { sendRequest } from "@/api/api";
import { api_user_activity, backendUrl } from "@/api/url";
import store from "@/lib/store";
import { user_activity_service } from "@/service/user-activity.service";
import { RiPushpinLine } from "react-icons/ri";

interface IHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpenModalDeleteArtist: (value: boolean) => void;
}

const SubscribeArtistQueue: Array<{
  artistId: string;
  quantity: number;
}> = [];
let isProcessingQueue = false;

const processSubscribeAritstQueue = async (session: any) => {
  if (isProcessingQueue || SubscribeArtistQueue.length === 0) return;
  isProcessingQueue = true;
  while (SubscribeArtistQueue.length > 0) {
    const action = SubscribeArtistQueue.shift();
    if (!action) continue;
    try {
      await user_activity_service.subscribeArtist(session, action);
    } catch (error) {
      console.error(
        `Error processing like for track ${action.artistId}:`,
        error
      );
    }
  }
  isProcessingQueue = false;
};

const ContextMenuArtist = ({ setIsOpenModalDeleteArtist }: IHTMLProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const position = useAppSelector(selectPosition);
  const temporaryArtist = useAppSelector(selectTemporaryArtist);
  const isOpenContextMenuArtist = useAppSelector(selectIsOpenContextMenuArtist);
  const inLibrary = useAppSelector(selectInLibrary);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    dispatch(
      setOpenContextMenuArtist({
        isOpenContextMenuArtist: false,
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

  const isLikeArtist = session?.user.artists.some(
    (item) => item._id === temporaryArtist?._id
  );
  const handleSubscribeArtist = async () => {
    handleCloseTab();

    if (!isLikeArtist) {
      callApiSubscribeArtist();
    } else {
      if (inLibrary) {
        handleConfirmDeleteArtist();
      } else {
        callApiSubscribeArtist();
      }
    }
  };

  const handleConfirmDeleteArtist = () => {
    setIsOpenModalDeleteArtist(true);
    handleCloseTab();
  };

  const callApiSubscribeArtist = async () => {
    if (!session || !temporaryArtist) return;
    const newArtists = isLikeArtist
      ? session.user.artists.filter((item) => item._id !== temporaryArtist._id)
      : [...session.user.artists, temporaryArtist];

    SubscribeArtistQueue.push({
      artistId: temporaryArtist._id,
      quantity: isLikeArtist ? -1 : 1,
    });

    if (!isProcessingQueue) {
      processSubscribeAritstQueue(session);
    }

    dispatch(
      setSessionActivity({ artists: newArtists, tracks: [], albums: [] })
    );
  };

  if (!isOpenContextMenuArtist || !temporaryArtist || !session) return null; // Ẩn menu nếu không mở

  const handlePin = async (pinned: boolean) => {
    handleCloseTab();
    const res = await user_activity_service.pin<IArtist>(
      temporaryArtist?._id,
      session?.access_token,
      "artist",
      pinned
    );
    if (res) {
      dispatch(setPinedAt({ artist: res }));
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
      className=" bg-40 text-white shadow-lg rounded overflow-hidden z-[10000]"
    >
      <div className="flex flex-col bg-40 text-white p-1">
        {isLikeArtist ? (
          <div
            className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3"
            onClick={handleSubscribeArtist}
          >
            <div className="flex items-center scale-[1.7]">
              <IoIosClose className="text-green-500" size={20} />
            </div>
            <div>Hủy theo dõi</div>
          </div>
        ) : (
          <div
            className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3"
            onClick={handleSubscribeArtist}
          >
            <div className="flex items-center text-white-08">
              <SlUserFollow size={20} />
            </div>
            <div>Theo dõi</div>
          </div>
        )}
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <MdBlock size={20} />
          </div>
          <div>Không phát nghệ sĩ này</div>
        </div>{" "}
        {inLibrary && (
          <>
            {!temporaryArtist.pinnedAt ? (
              <div
                className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 border-t-[1px] border-70 border-solid"
                onClick={() => handlePin(true)}
              >
                <div className="flex items-center text-white-08">
                  <RiPushpinLine size={20} />
                </div>
                <div>Ghim nghệ sĩ</div>
              </div>
            ) : (
              <div
                className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 border-t-[1px] border-70 border-solid"
                onClick={() => handlePin(false)}
              >
                <div className="flex items-center text-green-500">
                  <RiPushpinLine size={20} />
                </div>
                <div>Bỏ ghim nghệ sĩ</div>
              </div>
            )}
          </>
        )}
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <IoIosRadio size={20} />
          </div>
          <div>Chuyển đến radio theo nghệ sĩ</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <MdOutlineReportGmailerrorred size={20} />
          </div>
          <div>Báo cáo</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <IoShareOutline size={20} />
          </div>
          <div>Chia sẽ</div>
        </div>
        <div className="flex gap-3 opacity-90 hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 border-t-[1px] border-70 border-solid">
          <div className="flex items-center text-white-08">
            <MdComputer size={20} />
          </div>
          <div>Mở trong ứng dụng máy tính</div>
        </div>
      </div>
    </div>
  );
};

export default ContextMenuArtist;
