"use client";
import { formatDuration } from "@/helper/format/formatUtils";

import { IArtist, ITrack } from "@/types/data";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import ContextMenuTrack from "@/components/context-menu/context-menu.track";
import { GiMusicalScore } from "react-icons/gi";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectIsOpenContextMenuTrack,
  setOpenContextMenuTrack,
  setType,
} from "@/lib/features/local/local.slice";
import {
  pause,
  play,
  selectAllTrack,
  selectCurrentTrack,
  selectIsPlay,
  selectWaitTrackList,
  setInWhere,
} from "@/lib/features/tracks/tracks.slice";
import { backendUrl, disk_tracks, url_api_tracks } from "@/api/url";

interface IProps {
  artist: IArtist;
  track: ITrack;
  index: number;
  trackForArtist: ITrack[];
}

const SongCardArtist = (props: IProps) => {
  const { track, index, trackForArtist, artist } = props;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentTrack = useAppSelector(selectCurrentTrack);
  const isPlay = useAppSelector(selectIsPlay);

  const playTrack = () => {
    if (currentTrack) {
      if (!isPlay || currentTrack !== track) {
        dispatch(pause());
        dispatch(
          play({ waitTrackList: [...trackForArtist], currentTrack: track })
        );
      }
      if (isPlay && currentTrack === track) {
        dispatch(pause());
      }
    } else {
      dispatch(
        play({ waitTrackList: [...trackForArtist], currentTrack: track })
      );
    }
  };

  const handleOpenContextMenuTrack = (event: React.MouseEvent) => {
    if (!track) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuTrack({
        isOpenContextMenuTrack: true,
        temporaryTrack: track,
        position,
      })
    );
    dispatch(setType("drawer"));
  };
  console.log(currentTrack);
  if (!track) return <></>;
  return (
    <div
      key={track._id}
      className={`flex p-2 px-8 gap-6 rounded group hover:bg-hover`}
      onContextMenu={(e) => handleOpenContextMenuTrack(e)}
    >
      <div className="flex items-center relative  justify-center w-[16px] ">
        <div
          onClick={playTrack}
          className="cursor-pointer  group-hover:block  hidden"
        >
          {currentTrack && currentTrack._id === track._id && isPlay ? (
            <FaPause
              size={15}
              className="absolute top-1/2  left-1/2 -translate-1.5 hidden group-hover:block"
            />
          ) : (
            <FaPlay
              size={15}
              className="absolute top-1/2 left-1/2 -translate-1.5 hidden group-hover:block"
            />
          )}
        </div>

        <span
          className={`font-semibold ${
            currentTrack && currentTrack._id === track._id
              ? "text-green-500"
              : "text-white-06"
          }   group-hover:hidden `}
        >
          {index + 1}
        </span>
      </div>{" "}
      <div className="flex items-center gap-4">
        <img
          src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
          alt=""
          className="size-12 rounded"
        />
        <span
          className={`${
            currentTrack && currentTrack._id === track._id
              ? "!text-green-500"
              : ""
          } hover:underline cursor-pointer `}
        >
          {track.title}
        </span>
      </div>
    </div>
  );
};

export default SongCardArtist;
