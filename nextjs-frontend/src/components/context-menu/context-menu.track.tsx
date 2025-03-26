import React, { useEffect, useRef, useState } from "react";
import { ITrack } from "@/types/data";
import {
  findIndexById,
  insertAt,
} from "@/helper/context-menu/context-menu.track";

import {
  selectIsOpenContextMenuTrack,
  selectPosition,
  selectTemporaryTrack,
  selectType,
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
import { CgPlayTrackNextO } from "react-icons/cg";

import { MdDeleteOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/lib/hook";

const ContextMenuTrack = () => {
  const isPlay = useAppSelector(selectIsPlay);
  const isOpenContextMenuTrack = useAppSelector(selectIsOpenContextMenuTrack);
  const temporaryTrack = useAppSelector(selectTemporaryTrack);
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const type = useAppSelector(selectType);
  const position = useAppSelector(selectPosition);
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    dispatch(setOpenContextMenuTrack({ isOpenContextMenuTrack: false }));
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
          play({ waitTrackList: updatedList, currentTrack: temporaryTrack })
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

  if (!isOpenContextMenuTrack) return null; // Ẩn menu nếu không mở

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
        {/* <div className="flex gap-3 pt-3 px-4">
          <div className="size-10 ">
            {track && (
              <img
                className="rounded-md "
                src={`${backendUrl}${disk_tracks.images}${track?.imgUrl}`}
                alt=""
              />
            )}
          </div>

          <div className="flex flex-col ">
            <div className="  max-w-[180px] overflow-hidden text-nowrap text-ellipsis">
              <span className="w-full cursor-pointer">{track?.title}</span>
            </div>
            <div className="opacity-60 flex gap-2">
              <div className="flex gap-1">
                <div className="flex items-center">
                  <CiHeart />
                </div>
                <div>100k</div>
              </div>
              <div className="flex gap-1">
                <div className="flex items-center">
                  <GiHeadphones />
                </div>
                <div>10M</div>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div>
            <CiHeart />
          </div>
          <div>Thêm vào thư viện</div>
        </div> */}
        <div
          className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5"
          onClick={() => handleAddWaitTrackList()}
        >
          <div className="flex items-center">
            <TbPlaylistAdd />
          </div>
          <div>Thêm vào danh sách phát</div>
        </div>
        <div
          className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5"
          onClick={() => handleAddTrackNext()}
        >
          <div className="flex items-center">
            <CgPlayTrackNextO />
          </div>
          <div>Phát tiếp theo</div>
        </div>
        {/* <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center">
            <IoIosRadio />
          </div>
          <div>Phát nội dung tương tự</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center">
            <IoIosAddCircleOutline />
          </div>
          <div>Thêm vào playlist</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center">
            <IoIosLink />
          </div>
          <div>Sao chép link</div>
        </div>
        <div className="flex gap-3 opacity-90   hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5">
          <div className="flex items-center">
            <RiShareForwardLine />
          </div>
          <div>Chia sẽ</div>
        </div> */}
        {type === "drawer" && (
          <div
            className="flex gap-3 opacity-90 hover:opacity-100 hover:bg-hover  cursor-pointer py-3 px-5 border-t-[1px] border-tab border-solid"
            onClick={handleDeleteTrack}
          >
            <div className="flex items-center">
              <MdDeleteOutline />
            </div>
            <div>Xóa</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextMenuTrack;
