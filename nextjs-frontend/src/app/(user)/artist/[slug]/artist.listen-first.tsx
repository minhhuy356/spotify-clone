import VideoThumbnail from "@/components/video/video.thumnail";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { IAlbum, IArtist, ITrack } from "@/types/data";
import { HTMLAttributes, useState } from "react";
import {
  selectPlayingSource,
  setListenFirst,
} from "@/lib/features/tracks/tracks.slice";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  artist: IArtist;
  allTrack: ITrack[];
  coverColor: string;
}

const ArtistListenFirst = ({ coverColor, allTrack, artist }: IProps) => {
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
                _id: artist._id,
                in: "artist",
                title: "",
                before: playingSource.before,
              },
              playingAudioListenFirst: {
                title: artist.stageName,
                isPlayListenFirst: true,
                allTrack: allTrack,
                trackIndex: 0,
              },
            })
          );
        }}
      >
        <VideoThumbnail track={allTrack[0]} coverColor={coverColor} />
      </div>
    </div>
  );
};
export default ArtistListenFirst;
