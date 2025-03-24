"use client";

import { ITrack } from "@/types/data";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import ScrollBar from "../scroll/scroll";
import { forwardRef, useRef } from "react";
import { FaPause } from "react-icons/fa6";
import Link from "next/link";
import { artist_type_group } from "@/contants/artist.type";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectAllTrack,
  selectCurrentTrack,
  selectIsPlay,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
interface IProps {
  indexNow?: number | null;
  setIndexNow?: (indexNow: number | null) => void;
  leftWidth: number;
  fatherRef?: React.RefObject<HTMLDivElement | null>;
  hardLeftWidth: number;
}

const Left = forwardRef(({ leftWidth, hardLeftWidth }: IProps, ref) => {
  const headerRef = useRef<HTMLDivElement>(null);
  return (
    <div className=" flex flex-col gap-2">
      {/* Thư viện luôn ở trên */}
      <div
        className="header p-4 flex tracks-center  top-0 z-10 bg-base overflow-hidden "
        ref={headerRef}
      >
        <div
          className={`w-fit rounded-full text-black border-solid border-black cursor-pointer flex ${
            leftWidth < hardLeftWidth ? "flex-1 justify-center" : "me-3"
          } `}
        >
          <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            className="fill-[rgb(179,179,179,1)] w-6 h-6"
            viewBox="0 0 24 24"
          >
            <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"></path>
          </svg>
        </div>
        <div className={`${leftWidth < hardLeftWidth ? "hidden" : "flex"}`}>
          <span>Thư viện</span>
        </div>
      </div>

      {/* Danh sách bài hát */}
    </div>
  );
});

export default Left;
