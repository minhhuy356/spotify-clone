import { router_artist, router_track } from "@/api/router";
import { backendUrl, disk_tracks, frontendUrl } from "@/api/url";
import ButtonSubscribeCircle from "@/components/button/button.subscribe.circle";
import ButtonDotTrack from "@/components/button/dot/button.dot.track";
import IconFavorite from "@/components/icon/icon.favorite";
import TracksCard from "@/components/main/left/content/card/left.track.card";
import { useNotification } from "@/components/notification/notification-context";
import ArtistSorter from "@/helper/artist/artist";
import { formatCountPlay, formatDuration } from "@/helper/format/formatUtils";
import { useResponsiveBreakpoint } from "@/hooks/useResponsiveBreakpoint";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import {
  selectTemporaryTrack,
  setNotification,
} from "@/lib/features/local/local.slice";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { lyrics_service } from "@/service/lyrics.serice";
import { track_artist_service } from "@/service/track-artist.service";
import { user_activity_service } from "@/service/user-activity.service";
import { ILyrics, ITrack } from "@/types/data";
import Link from "next/link";
import { HtmlHTMLAttributes, useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

type IType = "normal" | "index";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  track: ITrack;
  index: number;
  type?: IType;
}

const PageTrackCard = ({ track, index, type = "normal" }: IProps) => {
  const { ref: wrapperRef, breakpoint } = useResponsiveBreakpoint();
  const dispatch = useAppDispatch();
  const session = useAppSelector(selectSession);
  const { setNotification } = useNotification();
  const [duration, setDuration] = useState<number | null>(null);
  const playingSource = useAppSelector(selectPlayingSource);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const isPlay = useAppSelector(selectIsPlay);

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

  // Gọi phương thức sortAndGroupArtists để lấy danh sách nghệ sĩ đã sắp xếp và nhóm
  const filteredArtists = track.artists?.length
    ? ArtistSorter.sortAndGroupArtists(track.artists, track.releasedBy._id)
    : [];

  const handleSubscribeTrack = async (isSubscribe: boolean) => {
    if (!session) return;

    if (isSubscribe) {
      const res = await user_activity_service.subscribeTrack(session, {
        trackId: track._id,
        quantity: 1,
      });
      if (res) {
        dispatch(setSessionActivity({ tracks: [...session.user.tracks, res] }));
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
        const newTrack = session.user.tracks.filter(
          (item) => item._id !== track._id
        );
        dispatch(setSessionActivity({ tracks: newTrack }));
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

  const playTrack = async () => {
    let newTrackWithArtist: ITrack | null = null;

    // Nếu thiếu artist thì fetch lại
    if (!track.artists) {
      newTrackWithArtist = await track_artist_service.fetchTrackById(track._id);
    }

    const playingTrack = newTrackWithArtist || track; // Ưu tiên dùng track mới có artist

    if (currentTrack) {
      if (!isPlay || currentTrack._id !== playingTrack._id) {
        dispatch(pause());
        dispatch(
          play({
            waitTrackList: [],
            currentTrack: playingTrack,
            playingSource: {
              _id: playingTrack._id,
              in: "track",
              title: playingTrack.title,
              before: "track",
            },
          })
        );
      } else if (isPlay && currentTrack._id === playingTrack._id) {
        dispatch(pause());
      }
    } else {
      dispatch(
        play({
          waitTrackList: [],
          currentTrack: playingTrack,
          playingSource: {
            _id: playingTrack._id,
            in: "track",
            title: playingTrack.title,
            before: "track",
          },
        })
      );
    }
  };

  const isSubscribedTrack =
    session?.user.tracks.some((item: ITrack) => item._id === track._id) ||
    false;

  const temporaryTrack = useAppSelector(selectTemporaryTrack);

  return (
    <div
      ref={wrapperRef}
      className={`flex gap-4 ${
        type === "normal" ? "pl-2 pr-4" : "px-6"
      } py-2 items-center  group   rounded ${
        temporaryTrack?._id === track._id ? "bg-90" : "hover:bg-40"
      }`}
    >
      {type === "index" && (
        <>
          {" "}
          <div className=" w-[16px] flex " onClick={playTrack}>
            <p className="block group-hover:hidden text-white-06">
              {index + 1}
            </p>
            {playingSource.in === "track" &&
            currentTrack &&
            currentTrack._id === track._id &&
            isPlay ? (
              <FaPause size={15} className=" hidden group-hover:block" />
            ) : (
              <FaPlay size={15} className=" hidden group-hover:block" />
            )}
          </div>
        </>
      )}
      <div className="flex gap-4 flex-3">
        {" "}
        <div className="size-10 relative" onClick={playTrack}>
          <img
            className="size-10 rounded overflow-hidden "
            src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
            alt=""
          />{" "}
          {type === "normal" &&
            (playingSource.in === "track" &&
            currentTrack &&
            currentTrack._id === track._id &&
            isPlay ? (
              <FaPause
                size={15}
                className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 hidden group-hover:block"
              />
            ) : (
              <FaPlay
                size={15}
                className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 hidden group-hover:block"
              />
            ))}
        </div>{" "}
        <div className="flex flex-col  ">
          <Link
            href={`${frontendUrl}${router_track}${track._id}`}
            className="hover:underline h-full flex items-center"
          >
            {track.title}
          </Link>
          {type === "normal" && (
            <div className="flex">
              {" "}
              {filteredArtists.map((item, index) => {
                if (item.useStageName)
                  return (
                    <div className="hover:underline hover:text-white text-white-06">
                      <Link
                        href={`${frontendUrl}${router_artist}${item.artist._id}`}
                      >
                        {item.artist.stageName}
                      </Link>

                      {index + 1 === filteredArtists.length ? "" : ","}
                    </div>
                  );
              })}
            </div>
          )}
        </div>{" "}
      </div>
      <div
        className={` items-center flex-1 ${
          breakpoint.below600 ? "hidden" : "flex"
        }`}
      >
        <div className={`text-white-06 group-hover:text-white cursor-pointer `}>
          {formatCountPlay(track.countPlay * 1000)}
        </div>
      </div>{" "}
      <div className="flex flex-1 gap-2 justify-end">
        {" "}
        {/* Nút subscribe */}
        <div className="invisible group-hover:visible justify-self-end pr-4 ">
          <ButtonSubscribeCircle
            isSubscribed={isSubscribedTrack}
            onSubscribe={handleSubscribeTrack}
            onUnsubscribe={handleSubscribeTrack}
          />
        </div>
        {/* Thời lượng */}
        <div className="w-12 flex justify-center text-white-06">
          {formatDuration((duration && duration) || 0)}
        </div>
        {/* Menu 3 chấm */}
        <div className="invisible group-hover:visible justify-self-end ">
          <ButtonDotTrack track={track} space={28} />
        </div>
      </div>
    </div>
  );
};
export default PageTrackCard;
