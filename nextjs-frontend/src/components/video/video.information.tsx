import { backendUrl, disk_tracks } from "@/api/url";
import {
  selectCurrentTrack,
  selectIsPlay,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { useAppSelector } from "@/lib/hook";
import { ITrack } from "@/types/data";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";

interface IProps {
  fatherRef?: React.RefObject<HTMLDivElement | null>;
  headerRef?: React.RefObject<HTMLDivElement | null>;
}

const VideoInformation = (props: IProps) => {
  const { fatherRef, headerRef } = props;

  const currentTrack = useAppSelector(selectCurrentTrack);
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const isPlay = useAppSelector(selectIsPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    if (videoRef.current) {
      if (isPlay) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    } else {
    }
  }, [isPlay, currentTrack]);

  if (!currentTrack) return;

  return (
    <div className="relative">
      <div
        className={`absolute top-0 z-0 w-full rounded-lg overflow-hidden h-full bg-base/40  transition-all duration-500 group-hover:bg-base/5`}
        style={{
          height: ` 746px`,
        }}
      >
        {/* Video Background */}
        {currentTrack?.videoUrl && (
          <video
            ref={videoRef}
            key={currentTrack._id}
            loop
            muted
            playsInline
            className="rounded-lg  w-full h-full object-cover transition-all duration-500 group-hover:brightness-100 group-hover:blur-0 object-center"
            style={{
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
            }}
          >
            <source
              src={`${backendUrl}${disk_tracks.videos}${currentTrack?.videoUrl}`}
              type="video/mp4"
            />
          </video>
        )}

        {/* Overlay Tối & Mờ */}
        <div className="rounded-lg overflow-hidden absolute top-0 left-0 w-full h-full bg-base/40  transition-all duration-500 group-hover:bg-base/5 "></div>
      </div>
    </div>
  );
};
export default VideoInformation;
