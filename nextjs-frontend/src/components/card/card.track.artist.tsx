"use client";
import { IArtist, ITrack } from "@/types/data";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  setOpenContextMenuTrack,
  setType,
} from "@/lib/features/local/local.slice";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
} from "@/lib/features/tracks/tracks.slice";
import { backendUrl, disk_tracks } from "@/api/url";
import { IoIosAddCircleOutline } from "react-icons/io";
import ButtonDotTrack from "../button/button.dot.track";

interface IProps {
  artist: IArtist;
  track: ITrack;
  index: number;
  trackForArtist: ITrack[];
}

const CardTrackArtist = (props: IProps) => {
  const { track, index, trackForArtist, artist } = props;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentTrack = useAppSelector(selectCurrentTrack);
  const isPlay = useAppSelector(selectIsPlay);
  const [duration, setDuration] = useState<number | null>(null);

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

  const audio = new Audio(
    `${backendUrl}${disk_tracks.audios}${track.audioUrl}`
  );

  useEffect(() => {
    const audio = new Audio(
      `${backendUrl}${disk_tracks.audios}${track.audioUrl}`
    );

    const handleMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", handleMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadata);
    };
  }, [track.audioUrl]);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!track || !duration) return <></>;
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
      </div>
      <div className="flex items-center w-full  ">
        <div className="mr-4">
          <img
            src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
            alt=""
            className="size-12 rounded"
          />
        </div>

        <div
          className={`${
            currentTrack && currentTrack._id === track._id
              ? "!text-green-500"
              : ""
          } hover:underline cursor-pointer `}
        >
          {track.title}
        </div>
      </div>{" "}
      <div className="flex items-center w-[20%]">
        <div className={`text-white-06 group-hover:text-white cursor-pointer `}>
          {track.countPlay}
        </div>
      </div>{" "}
      <div className="flex gap-4 items-center w-[10%] justify-end">
        <div
          className={` group-hover:text-white cursor-pointer invisible group-hover:visible`}
        >
          <IoIosAddCircleOutline size={20} />
        </div>
        <div className={`text-white-06 group-hover:text-white cursor-pointer `}>
          {formatDuration(duration)}
        </div>
        <div
          className={`text-white-06 group-hover:text-white cursor-pointer  invisible group-hover:visible`}
        >
          <ButtonDotTrack track={track} />
        </div>
      </div>
    </div>
  );
};

export default CardTrackArtist;
