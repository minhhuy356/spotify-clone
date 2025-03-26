"use client";

import { ITrack } from "@/types/data";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import ScrollBar from "../../scroll/scroll";
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
import LeftHeader from "./header/left.header";
import ListLibrary from "./content/list.left";
interface IProps {
  leftWidth: number;
  fatherRef?: React.RefObject<HTMLDivElement | null>;
  hardLeftWidth: number;
}

const Left = ({ leftWidth, hardLeftWidth }: IProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="px-1 flex flex-col ">
      {/* Thư viện luôn ở trên */}
      <LeftHeader headerRef={headerRef} leftWidth={leftWidth} />
      {/* Danh sách bài hát */}
      <ListLibrary />
    </div>
  );
};

export default Left;
