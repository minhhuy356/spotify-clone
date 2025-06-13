"use client";

import { ITrack } from "@/types/data";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import ScrollBar from "../../scroll/scroll";
import { forwardRef, useRef, useState } from "react";
import { FaPause } from "react-icons/fa6";
import Link from "next/link";
import { artist_type_group } from "@/contants/artist.type";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectCurrentTrack,
  selectIsPlay,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import LeftHeader from "./header/left.header";
import ListLibrary from "./content/left.list";
import ContextMenuTrack from "@/components/context-menu/context-menu.track";
import ContextMenuArtist from "@/components/context-menu/context-menu.artist";
import ContextMenuAlbum from "@/components/context-menu/context-menu.album";
import ContextMenuFolder from "@/components/context-menu/context-menu.folder";
import ContextMenuPlaylist from "@/components/context-menu/context-menu.playlist";
interface IProps {
  leftWidth: number;
  fatherRef?: React.RefObject<HTMLDivElement | null>;
}

export type ChooseLibraryBy = "album" | "all" | "artist";

const Left = ({ leftWidth }: IProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [chooseLibraryBy, setChooseLibraryBy] =
    useState<ChooseLibraryBy>("all");
  return (
    <div className="px-1 flex flex-col ">
      {/* Thư viện luôn ở trên */}
      <LeftHeader
        headerRef={headerRef}
        leftWidth={leftWidth}
        chooseLibraryBy={chooseLibraryBy}
        setChooseLibraryBy={setChooseLibraryBy}
      />

      {/* Danh sách bài hát */}
      <ListLibrary
        chooseLibraryBy={chooseLibraryBy}
        setChooseLibraryBy={setChooseLibraryBy}
      />
    </div>
  );
};

export default Left;
