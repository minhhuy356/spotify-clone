"use client";
import { router_artist } from "@/api/router";
import { backendUrl } from "@/api/url";
import ButtonPause from "@/components/button/button.pause";
import ButtonPlay from "@/components/button/button.play";
import {
  selectDiscography,
  selectScrollCenter,
} from "@/lib/features/scroll-center/scroll-center.slice";
import {
  pause,
  play,
  selectIsPlay,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { track_artist_service } from "@/service/track-artist.service";
import { IAlbum, IArtist } from "@/types/data";
import { useEffect, useState } from "react";
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  artist: IArtist;
}

const ClassifyDiscographyHeaderPlay = ({ artist }: IProps) => {
  const playingSource = useAppSelector(selectPlayingSource);
  const isPlay = useAppSelector(selectIsPlay);
  const scrollCenter = useAppSelector(selectScrollCenter);
  const discography = useAppSelector(selectDiscography);
  const dispatch = useAppDispatch();

  const handlePlayPauseAlbum = async (isPlayIn: boolean) => {
    if (!discography.albumCurrent?._id) return;
    const trackByAlbum = await track_artist_service.fetchTrackForAlbum(
      discography.albumCurrent?._id
    );
    if (trackByAlbum) {
      if (isPlayIn) {
        dispatch(
          play({
            currentTrack: trackByAlbum[0],
            waitTrackList: trackByAlbum,
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

  if (!discography.albums) return;

  const isPlayAlbum =
    isPlay &&
    discography.albumCurrent &&
    discography.albumCurrent._id === playingSource._id &&
    playingSource.in === "artist";

  return (
    <div className="px-4 h-[64px] flex max-w-[1955px] w-full mx-auto">
      {discography.albumCurrent &&
        discography.albumCurrent.name &&
        discography.displayAlbum.viewas === "list" && (
          <div className="flex gap-4 items-center py-2">
            {" "}
            <div className="">
              <div
                className={`  transition-all duration-100 hover:scale-105 group-hover:bottom-2 z-20 cursor-pointer  group`}
                onClick={() => handlePlayPauseAlbum(true)}
              >
                <ButtonPlay size={1} />
              </div>
            </div>
            <p className="text-xl font-bold">{discography.albumCurrent.name}</p>
          </div>
        )}
    </div>
  );
};
export default ClassifyDiscographyHeaderPlay;
