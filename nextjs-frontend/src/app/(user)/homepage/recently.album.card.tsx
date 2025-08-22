"use client";

import { backendUrl, disk_albums } from "@/api/url";
import ButtonPause from "@/components/button/button.pause";
import ButtonPlay from "@/components/button/button.play";
import EqualizerIcon from "@/components/icon/equalizer/icon.equalizer";
import { Breakpoint } from "@/hooks/useResponsiveBreakpoint";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectListenFirst,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { IAuth } from "@/types/data";
import { track_artist_service } from "@/service/track-artist.service";
import { useMediaQuery } from "@mui/material";
import { HtmlHTMLAttributes } from "react";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  album: any; // Album model
  session: IAuth;
  breakpoint: Breakpoint;
}

const RecentlyAlbumCard = ({ album, session, breakpoint }: IProps) => {
  const dispatch = useAppDispatch();
  const isPlay = useAppSelector(selectIsPlay);
  const playingSource = useAppSelector(selectPlayingSource);
  const listenFirst = useAppSelector(selectListenFirst);
  const isDesktop = useMediaQuery("(min-width: 992px)");

  const isPlayingAlbum =
    isPlay && playingSource._id === album._id && playingSource.in === "album";

  const handlePlayPauseAlbum = async (playIn: boolean) => {
    if (!playIn) {
      dispatch(pause());
      return;
    }

    const trackList = await track_artist_service.fetchTrackForAlbum(album._id);
    if (trackList?.length) {
      dispatch(
        play({
          currentTrack: trackList[0],
          waitTrackList: trackList,
          inWaitList: false,
          playingSource: {
            _id: album._id,
            before: "album",
            in: "album",
            title: album.name,
          },
        })
      );
    }
  };

  return (
    <div className="rounded overflow-hidden flex justify-between cursor-pointer group max-w-full">
      <div className="flex relative w-full max-w-full z-10">
        {/* Cover Image */}
        <div
          className="aspect-square "
          style={{
            width: breakpoint.below1100
              ? "48px"
              : breakpoint.below1200
              ? "64px"
              : "80px",
            height: breakpoint.below1100
              ? "48px"
              : breakpoint.below1200
              ? "64px"
              : "80px",
          }}
        >
          <img
            className="w-full h-full object-cover object-center"
            src={`${backendUrl}${disk_albums.images}${album.imgUrl}`}
            alt={album.name}
          />
        </div>

        {/* Info + Play Button */}
        <div className="bg-white-007 hover:bg-white-01 transition-all duration-300 w-full flex items-center justify-between overflow-hidden  relative">
          <div
            className="text-white font-bold text-sm line-clamp-2 mx-2"
            style={{
              fontSize: breakpoint.below900
                ? "0.725rem"
                : breakpoint.below1200
                ? "0.875rem"
                : "1rem",
            }}
          >
            {album.name}
          </div>

          <div
            className={`absolute ${
              breakpoint.below900
                ? "right-1"
                : breakpoint.below1200
                ? "right-2"
                : "right-3"
            } group-hover:block hidden`}
          >
            {isPlayingAlbum && !listenFirst.modalListenFirst.isOpen ? (
              <div onClick={() => handlePlayPauseAlbum(false)}>
                <ButtonPause
                  size={
                    breakpoint.below900 ? 0.8 : breakpoint.below1200 ? 0.9 : 1
                  }
                />
              </div>
            ) : (
              <div onClick={() => handlePlayPauseAlbum(true)}>
                <ButtonPlay
                  size={
                    breakpoint.below900 ? 0.8 : breakpoint.below1200 ? 0.9 : 1
                  }
                />
              </div>
            )}
          </div>

          {isPlayingAlbum && !listenFirst.modalListenFirst.isOpen && (
            <div
              className={`${
                breakpoint.below900
                  ? "basis-[48px]"
                  : breakpoint.below1200
                  ? "basis-[64px]"
                  : "basis-[80px]"
              } shrink-0 flex px-2 justify-center `}
            >
              <EqualizerIcon
                bars={4}
                color="#1ed760"
                rounded={false}
                height={
                  breakpoint.below900 ? 14 : breakpoint.below1200 ? 18 : 22
                }
                width={
                  breakpoint.below900 ? 14 : breakpoint.below1200 ? 18 : 22
                }
                speed={1.5}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentlyAlbumCard;
