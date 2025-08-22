import { sendRequest } from "@/api/api";
import {
  api_track_artists,
  backendUrl,
  disk_artists,
  disk_tracks,
  frontendUrl,
} from "@/api/url";
import { IArtist, ITrack } from "@/types/data";

import ButtonPlay from "../button/button.play";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import ButtonPause from "../button/button.pause";
import Link from "next/link";
import "./style.css";
import React, {
  forwardRef,
  HtmlHTMLAttributes,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
import { router_artist } from "@/api/router";
import { track_artist_service } from "@/service/track-artist.service";
import { Skeleton } from "@mui/material";

// ... các import khác giữ nguyên

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  artist: IArtist | null;
  index: number;
  numberOfDisplayCard: number;
}

const CardImageArtist = forwardRef<HTMLDivElement, IProps>(
  ({ artist, index, numberOfDisplayCard, ...props }, ref) => {
    const isPlay = useAppSelector(selectIsPlay);
    const currentTrack = useAppSelector(selectCurrentTrack);
    const playingSource = useAppSelector(selectPlayingSource);
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean); // ['track', '680b662e358a4aa9121d8661']
    const firstSegment = segments[0]; // 'track'

    const dispatch = useAppDispatch();

    const handlePlayPauseArtist = async (isPlay: boolean) => {
      if (!artist) return;
      const trackByArtist = await track_artist_service.getTrackForArtist(
        artist._id,
        "-countPlay"
      );
      if (trackByArtist) {
        if (isPlay) {
          dispatch(
            play({
              currentTrack: trackByArtist[0],
              waitTrackList: trackByArtist,
              inWaitList: false,
              playingSource: {
                _id: artist._id,
                before: "artist",
                in: "artist",
                title: artist.stageName,
              },
            })
          );
        } else {
          dispatch(pause());
        }
      }
    };

    return (
      <>
        {" "}
        {!artist ? (
          <Skeleton
            width={"100%"}
            height={"100%"}
            className="size-20 rounded-full"
          />
        ) : (
          <div
            key={artist._id}
            className={`${
              index >= numberOfDisplayCard
                ? "opacity-0 pointer-events-none absolute"
                : "opacity-100  transition-opacity duration-300"
            }`}
            ref={ref}
          >
            <div
              {...props}
              className={`flex-none p-3 rounded-md group relative hover:bg-card-image ${
                props.className || ""
              }`}
              style={{ scrollSnapAlign: "start", ...props.style }}
            >
              <div className="flex flex-col gap-1 relative z-10">
                <div className="relative">
                  <img
                    src={`${backendUrl}${disk_artists.avatar}${artist.avatarImgUrl}`}
                    alt={artist.stageName}
                    className="w-full h-full object-cover object-center rounded-full aspect-square"
                  />

                  <div
                    className={`${
                      artist._id === playingSource?._id && isPlay
                        ? "hidden"
                        : "block"
                    } play absolute bottom-0 right-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bottom-2 z-20 cursor-pointer`}
                    onClick={() => handlePlayPauseArtist(true)}
                  >
                    <ButtonPlay size={1} />
                  </div>
                  <div
                    className={`${
                      artist._id === playingSource?._id && isPlay
                        ? "block"
                        : "hidden"
                    } absolute bottom-[8px] right-[8px] transition-all duration-300 hover:scale-110 z-20 cursor-pointer`}
                    onClick={() => handlePlayPauseArtist(false)}
                  >
                    <ButtonPause />
                  </div>
                </div>
                <Link
                  href={`${frontendUrl}${router_artist}${artist._id}`}
                  className="text-xl line-clamp-2 font-bold hover:underline"
                >
                  {artist.stageName}
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

CardImageArtist.displayName = "CardImageArtist";

export default CardImageArtist;
