import { sendRequest } from "@/api/api";
import { api_track_artists, backendUrl, disk_tracks } from "@/api/url";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { ITrack } from "@/types/data";

import { HtmlHTMLAttributes, useEffect, useState } from "react";
import ButtonPlay from "../button/button.play";
import ButtonPause from "../button/button.pause";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  track: ITrack;
}

const SliderTrackCard = ({ track }: IProps) => {
  const dispatch = useAppDispatch();

  const isPlay = useAppSelector(selectIsPlay);
  const currentTrack = useAppSelector(selectCurrentTrack);

  const playTrack = (track: ITrack) => {
    if (!isPlay || currentTrack?._id !== track._id) {
      dispatch(pause());
      dispatch(
        play({
          waitTrackList: [],
          currentTrack: track,

          playingSource: {
            in: "track",
            title: "",
            before: "track",
          },
        })
      );
    } else if (isPlay && currentTrack?._id === track._id) {
      dispatch(pause());
    }
  };

  return (
    <div
      key={track._id}
      className="flex-none p-3 hover:bg-hover rounded-md w-48 group"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="flex flex-col gap-2">
        <div className="relative">
          <img
            src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
            alt={track.title}
            className="size-44 object-cover rounded-md"
          />

          <div
            className={`${
              track._id === currentTrack?._id && isPlay ? "hidden " : "block"
            } play absolute bottom-0 right-2 opacity-0  transition-all duration-300 group-hover:opacity-100 group-hover:bottom-2`}
            onClick={() => playTrack(track)}
          >
            <ButtonPlay size={1} />
          </div>
          <div
            className={`${
              track._id === currentTrack?._id && isPlay
                ? "opacity-100"
                : "opacity-0"
            } absolute bottom-[8px] right-[8px] transition-all duration-300 hover:scale-110`}
            onClick={() => playTrack(track)}
          >
            <ButtonPause />
          </div>
        </div>

        <span className="text-xl line-clamp-2 font-bold hover:underline">
          {track.title}
        </span>
        <div className="text-white-06 text-sm line-clamp-1">
          <Link
            href={`artist/${track.releasedBy._id}`}
            className="hover:underline hover:text-white"
          >
            {track.releasedBy.stageName}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SliderTrackCard;
