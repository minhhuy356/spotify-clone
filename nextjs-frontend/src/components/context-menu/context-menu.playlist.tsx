import React, { useEffect, useRef, useState } from "react";
import { IArtist, IPlaylist, IUserActivity } from "@/types/data";

import { TbPlaylistAdd } from "react-icons/tb";
import { SlUserFollow } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectIsOpenContextMenuPlaylist,
  selectPosition,
  selectTemporaryArtist,
  selectTemporaryPlaylist,
  setOpenContextMenuPlaylist,
  setPosition,
} from "@/lib/features/local/local.slice";
import { CgPlayList } from "react-icons/cg";
import {
  MdBlock,
  MdComputer,
  MdDeleteOutline,
  MdOutlineReportGmailerrorred,
} from "react-icons/md";
import {
  IoIosClose,
  IoIosCloseCircleOutline,
  IoIosRadio,
} from "react-icons/io";
import { IoPencilSharp, IoShareOutline } from "react-icons/io5";
import {
  selectSession,
  setPinedAt,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { sendRequest } from "@/api/api";
import { api_user_activity, backendUrl } from "@/api/url";

import { FiFolder } from "react-icons/fi";
import { FaCaretRight, FaRegUserCircle } from "react-icons/fa";
import { RiMusicAiLine, RiPushpinLine, RiUnpinLine } from "react-icons/ri";
import { BiBlock } from "react-icons/bi";
import { user_activity_service } from "@/service/user-activity.service";

interface IHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpenModalDeletePlaylist: (value: boolean) => void;
  setIsOpenModalUpdatePlaylist: (value: boolean) => void;
}

const ContextMenuPlaylist = ({
  setIsOpenModalDeletePlaylist,
  setIsOpenModalUpdatePlaylist,
}: IHTMLProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const position = useAppSelector(selectPosition);
  const temporaryPlaylist = useAppSelector(selectTemporaryPlaylist);
  const isOpenContextMenuPlaylist = useAppSelector(
    selectIsOpenContextMenuPlaylist
  );

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    dispatch(
      setOpenContextMenuPlaylist({
        isOpenContextMenuPlaylist: false,
        inLibrary: true,
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
    if (isOpenContextMenuPlaylist) {
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

      dispatch(setPosition({ x: newX, y: newY - 30 }));
    }
  }, [isOpenContextMenuPlaylist]);

  const handleConfirmDeletePlaylist = () => {
    setIsOpenModalDeletePlaylist(true);
    handleCloseTab();
  };

  if (!isOpenContextMenuPlaylist || !temporaryPlaylist || !session) return null; // Ẩn menu nếu không mở

  const handlePin = async (pinned: boolean) => {
    handleCloseTab();
    const res = await user_activity_service.pin<IPlaylist>(
      temporaryPlaylist?._id,
      session?.access_token,
      "playlist",
      pinned
    );
    if (res) {
      dispatch(setPinedAt({ playlist: res }));
    }
  };

  const handleOpenModalUpdatePlaylist = () => {
    setIsOpenModalUpdatePlaylist(true);
    handleCloseTab();
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position?.y || 0,
        left: position?.x || 0,
      }}
      className=" bg-40 text-white shadow-lg rounded overflow-hidden z-[10000] p-1"
    >
      <div className="flex flex-col bg-40 text-white">
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer pt-2 pb-3 px-3">
          <div className="flex items-center text-white-08">
            <TbPlaylistAdd size={20} />
          </div>
          <div>Thêm vào danh sách chờ</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <FaRegUserCircle size={20} />
          </div>
          <div>Xóa khỏi hơ sở</div>
        </div>
        <div
          className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 border-t-[1px] border-70 border-solid"
          onClick={handleOpenModalUpdatePlaylist}
        >
          <div className="flex items-center text-white-08">
            <IoPencilSharp size={20} />
          </div>
          <div>Sưa thông tin chi tiết</div>
        </div>
        <div
          className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3"
          onClick={handleConfirmDeletePlaylist}
        >
          <div className="flex items-center text-white-08">
            <BiBlock size={20} />
          </div>
          <div>Xóa</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 border-t-[1px] border-70 border-solid">
          <div className="flex items-center text-white-08">
            <RiMusicAiLine size={20} />
          </div>
          <div>Tạo danh sách phát</div>
        </div>{" "}
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <IoShareOutline size={20} />
          </div>
          <div>Tạo thư mục</div>
        </div>{" "}
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <IoIosCloseCircleOutline size={20} />
          </div>
          <div>Loại bỏ khỏi hồ sơ thích của bạn</div>
        </div>{" "}
        <div className="flex justify-between opacity-90 hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex gap-3">
            <div className="flex items-center text-white-08">
              <FiFolder size={20} />
            </div>
            <div>Di chuyển thư mục</div>
          </div>
          <div className="flex items-center text-white-08">
            <FaCaretRight size={20} />
          </div>
        </div>
        {!temporaryPlaylist.pinnedAt ? (
          <div
            className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 border-t-[1px] border-70 border-solid"
            onClick={() => handlePin(true)}
          >
            <div className="flex items-center text-white-08">
              <RiPushpinLine size={20} />
            </div>
            <div>Ghim thư mục</div>
          </div>
        ) : (
          <div
            className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 border-t-[1px] border-70 border-solid"
            onClick={() => handlePin(false)}
          >
            <div className="flex items-center text-green-500">
              <RiPushpinLine size={20} />
            </div>
            <div>Bỏ ghim thư mục</div>
          </div>
        )}
        <div className="flex justify-between opacity-90 hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex gap-3">
            <div className="flex items-center text-white-08">
              <IoShareOutline size={20} />
            </div>
            <div>Chia sẽ</div>
          </div>
          <div className="flex items-center text-white-08">
            <FaCaretRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextMenuPlaylist;
