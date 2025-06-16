"use client";
import { IArtist, ITrack } from "@/types/data";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { backendUrl, disk_tracks } from "@/api/url";
import { IoIosAddCircleOutline } from "react-icons/io";
import ButtonDotTrack from "../../../../../../components/button/dot/button.dot.track";
import { formatDuration } from "@/helper/format/formatUtils";
import ButtonSubscribeCard from "@/components/button/button.subscribe.circle";
import ButtonSubscribeCircle from "@/components/button/button.subscribe.circle";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import IconFavorite from "@/components/icon/icon.favorite";
import { useNotification } from "@/components/notification/notification-context";
import { user_activity_service } from "@/service/user-activity.service";
import { track_artist_service } from "@/service/track-artist.service";

interface IProps {
  artist: IArtist;
  track: ITrack;
  index: number;
  trackForArtist: ITrack[];
}

const CardTrackArtist = (props: IProps) => {
  const { track, index, trackForArtist, artist } = props;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const isPlay = useAppSelector(selectIsPlay);
  const [duration, setDuration] = useState<number | null>(null);
  const playingSource = useAppSelector(selectPlayingSource);
  const waitTrackList = useAppSelector(selectWaitTrackList);

  const { setNotification } = useNotification();

  const playTrack = () => {
    if (currentTrack) {
      if (!isPlay || currentTrack !== track) {
        dispatch(pause());
        dispatch(
          play({
            waitTrackList: [...trackForArtist],
            currentTrack: track,

            playingSource: {
              _id: artist._id,
              in: "artist",
              title: artist.stageName,
              before: "artist",
            },
          })
        );
      }
      if (isPlay && currentTrack === track) {
        dispatch(pause());
      }
    } else {
      dispatch(
        play({
          waitTrackList: [...trackForArtist],
          currentTrack: track,

          playingSource: {
            _id: artist._id,
            in: "artist",
            title: artist.stageName,
            before: "artist",
          },
        })
      );
      fetchWaitlistByArtist();
    }
  };

  const handleOpenContextMenuTrack = (event: React.MouseEvent) => {
    if (!track) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuTrack({
        isOpenContextMenuTrack: true,
        temporaryTrack: track,
        position,
        inLibrary: false,
      })
    );
  };

  useEffect(() => {
    const audio = new Audio(
      `${backendUrl}${disk_tracks.audios}${track.audioUrl}`
    );

    const handleMetadata = () => {
      setDuration(parseInt(audio.duration.toString()));
    };

    audio.addEventListener("loadedmetadata", handleMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadata);
    };
  }, [track.audioUrl]);

  const handleSubscribeTrack = async (isSubscribe: boolean) => {
    if (!session) return;

    if (isSubscribe) {
      const res = await user_activity_service.subscribeTrack(session, {
        trackId: track._id,
        quantity: 1,
      });
      if (res) {
        dispatch(
          setSessionActivity({ tracks: [...session.user.tracks, track] })
        );
        setNotification({
          content: `Đã thêm vào thư viện`,
          isOpen: true,
          icon: (
            <div className="size-10 rounded overflow-hidden">
              <IconFavorite />
            </div>
          ),
        });
      }
    } else {
      const res = await user_activity_service.subscribeTrack(session, {
        trackId: track._id,
        quantity: -1,
      });
      if (res) {
        const newTracks = session.user.tracks.filter(
          (item) => item._id !== track._id
        );
        dispatch(setSessionActivity({ tracks: newTracks }));
        setNotification({
          content: `Đã xóa vào thư viện`,
          isOpen: true,
          icon: (
            <div className="size-10 rounded overflow-hidden">
              <IconFavorite />
            </div>
          ),
        });
      }
    }
  };
  const fetchWaitlistByArtist = async () => {
    if (currentTrack) {
      const artistId = artist._id;
      const res = await track_artist_service.getTrackForArtist(
        artistId,
        "countPlay"
      );

      if (res) {
        const dataFilter = res.filter((item) => item._id !== currentTrack._id);

        dispatch(
          play({
            waitTrackList: [...waitTrackList, ...dataFilter],
            currentTrack: currentTrack,
          })
        );
      }
    }
  };

  if (!track || !duration || !session) return <></>;
  return (
    <div
      key={track._id}
      className={`flex p-2 px-6 gap-6 rounded group hover:bg-hover`}
      onContextMenu={(e) => handleOpenContextMenuTrack(e)}
    >
      <div className="flex items-center relative  justify-center w-[16px] ">
        <div
          onClick={playTrack}
          className="cursor-pointer  group-hover:block hidden "
        >
          {playingSource.in === "artist" &&
          currentTrack &&
          currentTrack._id === track._id &&
          isPlay ? (
            <FaPause
              size={15}
              className="absolute top-1/2  left-1/2 -translate-1.5 hidden group-hover:block"
            />
          ) : (
            <FaPlay
              size={15}
              className="absolute top-1/2 left-1/2 -translate-1.5 hidden group-hover:block"
            />
          )}
        </div>

        <span
          className={`font-semibold ${
            playingSource.in === "artist" &&
            currentTrack &&
            currentTrack._id === track._id
              ? "text-green-500"
              : "text-white-06"
          }   group-hover:hidden `}
        >
          {index + 1}
        </span>
      </div>
      <div className="flex items-center w-full flex-2 ">
        <div className="mr-4">
          <div className="relative size-12">
            <img
              src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
              alt=""
              className="size-12 rounded "
            />{" "}
            <div className="size-12 absolute top-0 bg-transparent group-hover:*:bg-black-05"></div>
          </div>
        </div>

        <div
          className={`${
            playingSource.in === "artist" &&
            currentTrack &&
            currentTrack._id === track._id
              ? "!text-green-500"
              : ""
          } hover:underline cursor-pointer `}
        >
          {track.title}
        </div>
      </div>{" "}
      <div className="hidden xl:flex items-center flex-1 justify-end">
        <div className={`text-white-06 group-hover:text-white cursor-pointer `}>
          {track.countPlay}
        </div>
      </div>{" "}
      <div className="flex gap-4 items-center flex-1 justify-end">
        <div
          className={` group-hover:text-white cursor-pointer invisible group-hover:visible pr-2`}
        >
          <ButtonSubscribeCircle
            isSubscribed={session?.user.tracks.some((t) => t._id === track._id)}
            onSubscribe={handleSubscribeTrack}
            onUnsubscribe={handleSubscribeTrack}
          />
        </div>
        <div className={`text-white-06 group-hover:text-white cursor-pointer `}>
          {formatDuration(duration)}
        </div>
        <div
          className={`text-white-06 group-hover:text-white cursor-pointer  invisible group-hover:visible`}
        >
          <ButtonDotTrack track={track} />
        </div>
      </div>
    </div>
  );
};

export default CardTrackArtist;
