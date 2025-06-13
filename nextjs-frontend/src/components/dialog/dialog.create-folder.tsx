import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  selectIsOpenDialogCreateFolder,
  selectPosition,
  setOpenDialogCreateFolder,
  setPosition,
} from "@/lib/features/local/local.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { IoAddOutline, IoShareOutline } from "react-icons/io5";
import { FiFolder } from "react-icons/fi";
import { RiMusicAiLine } from "react-icons/ri";
import { Position } from "../context-menu/context-menu.account";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import store from "@/lib/store";
import { user_activity_service } from "@/service/user-activity.service";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>; // Avatar ref
}

const DialogCreateFolder = ({ isOpen, setIsOpen, anchorRef }: IProps) => {
  const dispatch = useAppDispatch();
  const session = useAppSelector(selectSession);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [top, setTop] = useState<number>(0);
  const [right, setRight] = useState<number>(0);
  const [position, setPosition] = useState<Position>("fixed");

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
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

  // Tính toán vị trí context menu
  useEffect(() => {
    if (anchorRef.current && menuRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let calculatedTop = anchorRect.bottom + 12;
      let calculatedRight = anchorRect.x;
      let positionType = position;

      const isOverflowingBottom = menuRect.bottom > viewportHeight;
      const isOverflowingRight = menuRect.right > viewportWidth;
      const isOverflowingTop = menuRect.top < 0;
      const isOverflowingLeft = menuRect.left < 0;

      if (
        isOverflowingBottom ||
        isOverflowingRight ||
        isOverflowingTop ||
        isOverflowingLeft
      ) {
        // Chuyển sang vị trí cố định trên màn hình
        calculatedTop = 12; // Gắn sát top màn hình
        calculatedRight = 12; // Gắn sát right màn hình
        positionType = "fixed"; // Chuyển sang fixed để thoát khỏi div cha
      }
      setTop(calculatedTop);
      setRight(calculatedRight);
      setPosition(positionType);
    }
  }, [isOpen]);

  const handleCreateNewPlaylist = async () => {
    if (session?.access_token) {
      const res = await user_activity_service.createNewPlaylist(
        session?.user.playlists ? session.user.playlists.length + 1 : 1,
        session?.access_token
      );
      if (res) {
        dispatch(
          setSessionActivity({ playlists: [res, ...session.user.playlists] })
        );
        handleCloseTab();
      }
    }
  };

  const handleCreateNewFolder = async () => {
    if (session?.access_token) {
      const res = await user_activity_service.createNewFolder(
        session.user.folders ? session.user.folders.length + 1 : 1,
        session?.access_token
      );
      if (res) {
        dispatch(
          setSessionActivity({ folders: [res, ...session.user.folders] })
        );
        handleCloseTab();
      }
    }
  };

  if (!isOpen) return <></>; // Ẩn menu nếu không mở

  return (
    <div
      ref={menuRef}
      style={{
        position: position, // Sử dụng `fixed` nếu bị tràn
        left: `${right}px`,
        top: `${top}px`,
      }}
      className="bg-40 text-white shadow-lg rounded-md z-[10000] min-w-[300px] overflow-hidden p-1"
    >
      <div className="flex flex-col bg-40 text-white">
        <div
          className="flex items-center gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-2 rounded-md group"
          onClick={() => handleCreateNewPlaylist()}
        >
          <div className="flex items-center text-white-08 p-3 rounded-full bg-90">
            <RiMusicAiLine
              size={27}
              className="group-hover:rotate-[9deg] group-hover:text-green-500 transition-all duration-500"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">Playlist</span>
            <span className="text-[0.85rem] text-white-08">
              Tạo danh sách phát gồm bài hát hoặc tập
            </span>
          </div>
        </div>
        <div className="flex justify-center w-full h-[1px] my-1">
          <div className="bg-70 w-[90%]"></div>
        </div>
        <div className="flex items-center gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-2 rounded-md group">
          <div className="flex items-center text-white-08 p-3 rounded-full bg-90">
            <div className="group-hover:rotate-[6deg]  transition-all duration-500">
              {" "}
              <svg
                width="27"
                height="24"
                viewBox="0 0 27 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="14"
                  r="8"
                  fill="#fff6"
                  opacity="0.8"
                  transform="rotate(-15, 10, 12)"
                  className="group-hover:!fill-green-400"
                />

                <circle
                  cx="18"
                  cy="8"
                  r="8"
                  fill="#fff6"
                  opacity="0.8"
                  transform="rotate(-15, 18, 10)"
                  className="group-hover:!fill-green-400"
                />

                <g transform="rotate(80, 13, 11.5)">
                  <path
                    d="M8 14 A8 8 0 0 1 18 8 A8 8 0 0 1 8 14 Z"
                    fill="white"
                    opacity="1"
                    className="group-hover:!fill-green-300"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Giai điệu chung</span>
            <span className="text-[0.85rem] text-white-08">
              Pha trộn gu nhạc của bạn với bạn bè
            </span>
          </div>
        </div>

        <div
          className="flex items-center gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-2 rounded-md group"
          onClick={() => handleCreateNewFolder()}
        >
          <div className="flex items-center text-white-08 p-3 rounded-full bg-90">
            <FiFolder
              size={25}
              className="group-hover:rotate-[9deg] group-hover:text-green-500 transition-all duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Thư mục</span>
            <span className="text-[0.85rem] text-white-08">
              Sắp xếp danh sách phát của bạn
            </span>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default DialogCreateFolder;
