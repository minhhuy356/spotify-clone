"use client";
import { router_album, router_artist } from "@/api/router";
import { backendUrl, disk_albums, frontendUrl } from "@/api/url";
import ButtonPlay from "@/components/button/button.play";
import ButtonSubscribeCircle from "@/components/button/button.subscribe.circle";
import ButtonDotAlbum from "@/components/button/dot/button.dot.album";
import ButtonDotTrack from "@/components/button/dot/button.dot.track";
import Tooltip from "@/components/tooltip/tooltip";
import { convertTypeAlbum } from "@/helper/albums/album";
import { track_artist_service } from "@/service/track-artist.service";
import { IAlbum, IArtist, ITrack } from "@/types/data";

import { useEffect, useRef, useState } from "react";
import { HiOutlineArrowDownCircle } from "react-icons/hi2";
import AllDiscographyTrack from "./classify.discography.track";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectScrollCenter,
  setColorAndName,
  setDiscography,
  setDiscographyAlbumCurrent,
  setDiscographyType,
  TTypeAlbum,
} from "@/lib/features/scroll-center/scroll-center.slice";
import { selectSession } from "@/lib/features/auth/auth.slice";
import {
  pause,
  play,
  selectIsPlay,
  selectPlayingSource,
  setPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import ButtonPause from "@/components/button/button.pause";
import { notFound, usePathname } from "next/navigation";
import { extractAlbumTypeFromPath } from "@/helper/path-name";
import { hideTooltip, showTooltip } from "@/lib/features/tooltip/tooltip.slice";
import { album_service } from "@/service/album.service";
import Link from "next/link";
import { validTypes } from "./classify.discography.main";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  album: IAlbum;
  artist: IArtist;
  albumRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  index: number;
}

const ClassifyDiscographyAlbumList = ({
  album,
  artist,
  albumRefs,
  index,
}: IProps) => {
  const dispatch = useAppDispatch();
  const handlePlayPauseAlbum = async (isPlay: boolean) => {
    const trackByAlbum = await track_artist_service.fetchTrackForAlbum(
      album._id
    );

    if (isPlay && trackByAlbum) {
      dispatch(
        play({
          currentTrack: trackByAlbum[0],
          waitTrackList: trackByAlbum,
          inWaitList: false,
          playingSource: {
            _id: artist._id,
            before: "artist",
            in: "artist",
            title: "",
          },
        })
      );
    } else {
      dispatch(pause());
    }
  };
  return (
    <div
      className="px-4 py-8 flex flex-col gap-8"
      ref={(el) => {
        albumRefs.current[index] = el;
      }}
    >
      <div className="flex gap-6">
        <div>
          <img
            src={`${backendUrl}${disk_albums.images}${album.imgUrl}`}
            alt=""
            className="size-[136px] rounded"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <Link
              href={`${frontendUrl}${router_album}${album._id}`}
              className={`  cursor-pointer hover:underline text-2xl  font-bold`}
            >
              {album.name}
            </Link>
            <div className="text-white-06 ">
              {convertTypeAlbum(album.type)} •{" "}
              {new Date(album.createdAt).getFullYear()} • {album.totalTracks}{" "}
              bài hát
            </div>
          </div>
          <div className="flex gap-4 ">
            <ButtonPlay
              size={0.85}
              bgColor="#ffffff"
              className="cursor-pointer hover:scale-105"
              hoverColor="#ffffff"
              onClick={() => handlePlayPauseAlbum(true)}
            />
            <div className="flex items-center cursor-pointer text-white-06 hover:text-white -translate-y-0.5 -translate-x-0.5">
              <ButtonSubscribeCircle
                size={28}
                colorAdd="white"
                className="text-white"
                isSubscribed={false}
                // onSubscribe={handleSubscribeTrack}
                // onUnsubscribe={handleSubscribeTrack}
              />
            </div>
            <div className="flex items-center cursor-pointer text-white-06 hover:text-white translate-y-[]">
              <HiOutlineArrowDownCircle className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <div
              className="flex items-center cursor-pointer text-white-06 hover:text-white translate-y-[]"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();

                dispatch(
                  showTooltip({
                    content: `Các tùy chọn khác cho ${album.name}`,
                    position: "top",
                    anchorRect: rect,
                  })
                );
              }}
              onMouseLeave={() => dispatch(hideTooltip())}
            >
              <ButtonDotAlbum album={album} className="" />
            </div>{" "}
          </div>
        </div>
      </div>
      <div>
        <AllDiscographyTrack artist={artist} album={album} />
      </div>
    </div>
  );
};
export default ClassifyDiscographyAlbumList;
