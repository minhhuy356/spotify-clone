import VideoThumbnail from "@/components/video/video.thumnail";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { IAlbum, ITrack } from "@/types/data";
import { HTMLAttributes, useState } from "react";
import {
  selectPlayingSource,
  setListenFirst,
} from "@/lib/features/tracks/tracks.slice";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  album: IAlbum;
  trackByAlbum: ITrack[];
  coverColor: string;
}

const AlbumListenFirst = ({ coverColor, trackByAlbum, album }: IProps) => {
  const dispatch = useAppDispatch();

  const playingSource = useAppSelector(selectPlayingSource);
  return (
    <div className="bg-inherit ">
      <div
        onClick={() => {
          dispatch(
            setListenFirst({
              modalListenFirst: {
                isOpen: true,
                color: coverColor,
              },
              playingSource: {
                in: "album",
                title: "",
                before: playingSource.before,
              },
              playingAudioListenFirst: {
                title: album.name,
                isPlayListenFirst: true,
                allTrack: trackByAlbum,
                trackIndex: 0,
              },
            })
          );
        }}
      >
        <VideoThumbnail track={trackByAlbum[0]} coverColor={coverColor} />
      </div>
    </div>
  );
};
export default AlbumListenFirst;
