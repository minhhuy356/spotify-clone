import { sendRequest } from "@/api/api";
import {
  api_track_artists,
  backendUrl,
  disk_tracks,
  frontendUrl,
} from "@/api/url";
import { IAlbum, ITrack } from "@/types/data";

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
import { router_album } from "@/api/router";
import { track_artist_service } from "@/service/track-artist.service";
import Skeleton from "../skeleton/skeleton";
import { convertTypeAlbum } from "@/helper/albums/album";

// ... các import khác giữ nguyên

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  album: IAlbum | null;
  index: number;
  numberOfDisplayCard?: number;
  size?: number;
}

const CardImageAlbum = forwardRef<HTMLDivElement, IProps>(
  ({ album, index, numberOfDisplayCard = 100, size, ...props }, ref) => {
    const isPlay = useAppSelector(selectIsPlay);
    const currentTrack = useAppSelector(selectCurrentTrack);
    const playingSource = useAppSelector(selectPlayingSource);
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean); // ['track', '680b662e358a4aa9121d8661']
    const firstSegment = segments[0]; // 'track'

    const dispatch = useAppDispatch();

    const handlePlayPauseAlbum = async (isPlayIn: boolean) => {
      if (!album) return;
      const trackByAlbum = await track_artist_service.fetchTrackForAlbum(
        album._id
      );
      if (trackByAlbum) {
        if (isPlayIn) {
          dispatch(
            play({
              currentTrack: trackByAlbum[0],
              waitTrackList: trackByAlbum,
              inWaitList: false,
              playingSource: {
                _id: album._id,
                before: "album",
                in: "album",
                title: album.name,
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
        {!album ? (
          <Skeleton width={"100%"} height={"100%"} />
        ) : (
          <div
            key={album._id}
            className={`${
              index >= numberOfDisplayCard
                ? "opacity-0 pointer-events-none absolute"
                : "opacity-100  transition-opacity duration-300"
            } `}
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
                    src={`${backendUrl}${disk_tracks.images}${album.imgUrl}`}
                    alt={album.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div
                    className={`${
                      album._id === playingSource?._id && isPlay
                        ? "hidden"
                        : "block"
                    } play absolute bottom-0 right-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bottom-2 z-20`}
                    onClick={() => handlePlayPauseAlbum(true)}
                  >
                    <ButtonPlay size={1} />
                  </div>
                  <div
                    className={`${
                      album._id === playingSource?._id && isPlay
                        ? "block"
                        : "hidden"
                    } absolute bottom-[8px] right-[8px] transition-all duration-300 hover:scale-110 z-20`}
                    onClick={() => handlePlayPauseAlbum(false)}
                  >
                    <ButtonPause />
                  </div>
                </div>
                <Link
                  href={`${frontendUrl}${router_album}${album._id}`}
                  className="text-xl line-clamp-2 font-bold hover:underline"
                >
                  {album.name}
                </Link>
                <div className="text-white-06 text-sm font-bold">
                  {new Date(album.createdAt).getFullYear()}{" "}
                  {firstSegment !== "album" &&
                    `• ${convertTypeAlbum(album.type)}`}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

CardImageAlbum.displayName = "CardImageAlbum";

export default CardImageAlbum;
