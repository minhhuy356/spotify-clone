import React, { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectIsOpenContextMenuFolder,
  selectPosition,
  selectTemporaryFolder,
  setOpenContextMenuFolder,
  setPosition,
} from "@/lib/features/local/local.slice";

import { IoPencilSharp } from "react-icons/io5";
import { selectSession, setPinedAt } from "@/lib/features/auth/auth.slice";

import { FaCaretRight } from "react-icons/fa";
import { BiBlock } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";
import { RiMusicAiLine, RiPushpinLine, RiUnpinLine } from "react-icons/ri";
import { FiFolder } from "react-icons/fi";
import { IFolder } from "@/types/data";
import { user_activity_service } from "@/service/user-activity.service";

interface IHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpenModalDeleteFolder: (value: boolean) => void;
}

const ContextMenuFolder = ({ setIsOpenModalDeleteFolder }: IHTMLProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const position = useAppSelector(selectPosition);
  const temporaryFolder = useAppSelector(selectTemporaryFolder);
  const isOpenContextMenuFolder = useAppSelector(selectIsOpenContextMenuFolder);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    dispatch(setOpenContextMenuFolder({ isOpenContextMenuFolder: false }));
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
    if (isOpenContextMenuFolder) {
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
  }, [isOpenContextMenuFolder]);

  const handleConfirmDeleteFolder = () => {
    setIsOpenModalDeleteFolder(true);
    handleCloseTab();
  };

  if (!isOpenContextMenuFolder || !temporaryFolder || !session) return null; // Ẩn menu nếu không mở

  const handlePin = async (pinned: boolean) => {
    handleCloseTab();
    const res = await user_activity_service.pin<IFolder>(
      temporaryFolder?._id,
      session?.access_token,
      "folder",
      pinned
    );
    if (res) {
      dispatch(setPinedAt({ folder: res }));
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
      className=" bg-40 text-white shadow-lg rounded overflow-hidden z-[10000] min-w-[280px] p-1"
    >
      <div className="flex flex-col bg-40 text-white">
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <IoPencilSharp size={20} />
          </div>
          <div>Đổi tên</div>
        </div>
        <div
          className="flex gap-3 opacity-90 hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3 "
          onClick={() => handleConfirmDeleteFolder()}
        >
          <div className="flex items-center text-white-08">
            <BiBlock size={20} />
          </div>
          <div>Xóa</div>
        </div>
        {!temporaryFolder.pinnedAt ? (
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

        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <RiMusicAiLine size={20} />
          </div>
          <div>Tạo danh sách phát</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-3">
          <div className="flex items-center text-white-08">
            <PiPlus size={20} />
          </div>
          <div>Tạo thư mục</div>
        </div>
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
      </div>
    </div>
  );
};

export default ContextMenuFolder;
