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
import CardImageAlbum from "@/components/card/card.image.album";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  album: IAlbum;
  artist: IArtist;
  albumRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  index: number;
}

const ClassifyDiscographyAlbumGrid = ({
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
      ref={(el) => {
        albumRefs.current[index] = el;
      }}
    >
      <CardImageAlbum album={album} index={index} />
    </div>
  );
};
export default ClassifyDiscographyAlbumGrid;
