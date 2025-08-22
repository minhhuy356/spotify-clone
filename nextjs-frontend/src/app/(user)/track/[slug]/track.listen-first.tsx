import VideoThumbnail from "@/components/video/video.thumnail";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { ITrack } from "@/types/data";
import { HTMLAttributes, useState } from "react";
import {
  selectPlayingSource,
  setListenFirst,
} from "@/lib/features/tracks/tracks.slice";
import { selectScrollCenter } from "@/lib/features/scroll-center/scroll-center.slice";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  track: ITrack;
}

const PageTrackListenFirst = ({ track }: IProps) => {
  const dispatch = useAppDispatch();

  const playingSource = useAppSelector(selectPlayingSource);

  const scrollCenter = useAppSelector(selectScrollCenter);
  return (
    <div className="bg-inherit ">
      <div
        onClick={() => {
          dispatch(
            setListenFirst({
              modalListenFirst: {
                isOpen: true,
                color: scrollCenter.color,
              },
              playingSource: {
                _id: track._id,
                in: "track",
                title: "",
                before: playingSource.before,
              },
              playingAudioListenFirst: {
                title: track.title,
                isPlayListenFirst: true,
                allTrack: [track],
                trackIndex: 0,
              },
            })
          );
        }}
      >
        <VideoThumbnail track={track} coverColor={scrollCenter.color} />
      </div>
    </div>
  );
};
export default PageTrackListenFirst;
