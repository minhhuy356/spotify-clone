import { backendUrl, disk_tracks, frontendUrl } from "@/api/url";
import { IAlbum, ITrack } from "@/types/data";
import { Fragment, HtmlHTMLAttributes, useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt
import relativeTime from "dayjs/plugin/relativeTime";
import { formatDuration } from "@/helper/format/formatUtils";
import { order } from "@/contants/artist.type";
import { GroupedArtist } from "@/components/main/right/main.right";
import Link from "next/link";
import { TypeForm } from "@/components/dialog/dialog.collection.form-track";
import ArtistSorter from "@/helper/artist/artist";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";

import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import ButtonDotTrack from "@/components/button/dot/button.dot.track";
import ButtonSubscribeCard from "@/components/button/button.subscribe.circle";
import { user_activity_service } from "@/service/user-activity.service";
import IconFavorite from "@/components/icon/icon.favorite";
import { useNotification } from "@/components/notification/notification-context";
import { FaPause, FaPlay } from "react-icons/fa";
dayjs.extend(relativeTime);
dayjs.locale("vi");

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  track: ITrack;
  index: number;
  typeForm: TypeForm;
  trackByAlbum: ITrack[];
  album: IAlbum;
}

const AlbumCardTrack = ({
  track,
  index,
  typeForm,
  trackByAlbum,
  album,
}: IProps) => {
  const dispatch = useAppDispatch();
  const isPlay = useAppSelector(selectIsPlay);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const session = useAppSelector(selectSession);

  const { setNotification } = useNotification();

  const [duration, setDuration] = useState<number | null>(null);

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

  const playTrack = () => {
    if (currentTrack) {
      if (trackByAlbum) {
        if (!isPlay || currentTrack !== track) {
          console.log(trackByAlbum);
          dispatch(pause());
          dispatch(
            play({
              waitTrackList: trackByAlbum,
              currentTrack: track,

              playingSource: {
                in: "album",
                title: "bài hát đã thích",
                before: "album",
              },
            })
          );
        }
        if (isPlay && currentTrack === track) {
          dispatch(pause());
        }
      }
    } else {
      if (trackByAlbum) {
        dispatch(
          play({
            waitTrackList: trackByAlbum,
            currentTrack: track,
            playingSource: {
              in: "album",
              title: album.name,
              before: "album",
            },
          })
        );
      }
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

  if (duration === null || !track) return <></>;

  // Gọi phương thức sortAndGroupArtists để lấy danh sách nghệ sĩ đã sắp xếp và nhóm
  const filteredArtists = ArtistSorter.sortAndGroupArtists(
    track.artists,
    track.releasedBy._id
  );

  return (
    <div
      className="grid grid-cols-[16px_1fr_auto_auto_auto] items-center w-full h-[56px] px-4 group hover:bg-50 rounded gap-4"
      onContextMenu={handleOpenContextMenuTrack}
    >
      {/* Số thứ tự + Play button */}
      <div
        className="relative text-white cursor-pointer flex items-center justify-center"
        onClick={playTrack}
      >
        <span
          className={`font-semibold ${
            currentTrack && currentTrack._id === track._id
              ? "text-green-500"
              : "text-white-06"
          }   group-hover:hidden `}
        >
          {index + 1}
        </span>
        {currentTrack && currentTrack._id === track._id && isPlay ? (
          <FaPause
            size={15}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block"
          />
        ) : (
          <FaPlay
            size={15}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block"
          />
        )}
      </div>

      {/* Thông tin tiêu đề + nghệ sĩ */}
      <div className="flex flex-col overflow-hidden">
        <Link
          href={`${frontendUrl}/track/${track._id}`}
          className="text-white truncate hover:text-white hover:underline"
        >
          {track.title}
        </Link>
        <div className="flex min-w-0">
          <div className="text-white-06 line-clamp-1 break-words">
            {filteredArtists.map((item, index) => (
              <Fragment key={item.artist._id}>
                <Link
                  href={`${frontendUrl}/artist/${item.artist._id}`}
                  className="hover:underline hover:text-white whitespace-nowrap"
                >
                  {item.artist.stageName}
                </Link>
                {index < filteredArtists.length - 1 && ", "}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Nút subscribe */}
      <div className="invisible group-hover:visible justify-self-end pr-4">
        <ButtonSubscribeCard
          isSubscribed={true}
          onSubscribe={handleSubscribeTrack}
          onUnsubscribe={handleSubscribeTrack}
        />
      </div>

      {/* Thời lượng */}
      <div className="w-12 flex justify-center">{formatDuration(duration)}</div>

      {/* Menu 3 chấm */}
      <div className="invisible group-hover:visible justify-self-end">
        <ButtonDotTrack track={track} />
      </div>
    </div>
  );
};

export default AlbumCardTrack;
