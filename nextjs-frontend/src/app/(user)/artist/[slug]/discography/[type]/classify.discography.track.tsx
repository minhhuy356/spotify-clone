import { router_artist, router_track } from "@/api/router";
import { frontendUrl } from "@/api/url";
import TrackListAlbum from "@/app/(user)/track/[slug]/track.list.album";
import ButtonSubscribeCircle from "@/components/button/button.subscribe.circle";
import ButtonDotTrack from "@/components/button/dot/button.dot.track";
import EqualizerIcon from "@/components/icon/equalizer/icon.equalizer";
import IconFavorite from "@/components/icon/icon.favorite";
import { useNotification } from "@/components/notification/notification-context";
import Tooltip from "@/components/tooltip/tooltip";
import ArtistSorter from "@/helper/artist/artist";
import { formatDuration } from "@/helper/format/formatUtils";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { setNotification } from "@/lib/features/local/local.slice";
import { hideTooltip, showTooltip } from "@/lib/features/tooltip/tooltip.slice";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { track_artist_service } from "@/service/track-artist.service";
import { user_activity_service } from "@/service/user-activity.service";
import { IAlbum, IArtist, ITrack } from "@/types/data";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { IoPause } from "react-icons/io5";
import { WiTime3 } from "react-icons/wi";
interface IProps {
  album: IAlbum;
  artist: IArtist;
}

const ClassifyDiscographyTrack = ({ album, artist }: IProps) => {
  const dispatch = useAppDispatch();
  const [trackByAlbum, setTrackByAlbum] = useState<ITrack[] | null>(null);
  const playingSource = useAppSelector(selectPlayingSource);
  const isPlay = useAppSelector(selectIsPlay);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const { setNotification } = useNotification();

  const fetchTrackByAlbum = async () => {
    const res = await track_artist_service.fetchTrackForAlbum(album._id);
    if (res) {
      setTrackByAlbum(res);
    }
  };

  useEffect(() => {
    fetchTrackByAlbum();
  }, [album]);

  const session = useAppSelector(selectSession);

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[60px_minmax(900px,1fr)_150px] text-xl  text-white-06 border-b-[1px] border-border py-3 mb-4 px-2">
        <div className="flex justify-center font-bold">#</div>
        <div>Tiêu đề</div>
        <div
          className="flex justify-center items-center"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();

            dispatch(
              showTooltip({
                content: `Thời lượng`,
                position: "top",
                anchorRect: rect,
              })
            );
          }}
          onMouseLeave={() => dispatch(hideTooltip())}
        >
          <WiTime3 size={24} />
        </div>
      </div>
      {trackByAlbum?.map((track, index) => {
        const handleSubscribeTrack = async (isSubscribe: boolean) => {
          if (!session) return;

          if (isSubscribe) {
            const res = await user_activity_service.subscribeTrack(session, {
              trackId: track._id,
              quantity: 1,
            });
            if (res) {
              dispatch(
                setSessionActivity({ tracks: [...session.user.tracks, res] })
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
                (item: ITrack) => item._id !== track._id
              );
              dispatch(setSessionActivity({ tracks: newTracks }));
              setNotification({
                content: `Đã xóa khỏi thư viện`,
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
        const playTrack = (isPlayin: boolean) => {
          console.log(isPlayin);
          if (currentTrack) {
            if (isPlayin || currentTrack !== track) {
              dispatch(pause());
              dispatch(
                play({
                  waitTrackList: [...trackByAlbum],
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
            if (!isPlayin && currentTrack === track) {
              dispatch(pause());
            }
          } else {
            dispatch(
              play({
                waitTrackList: [...trackByAlbum],
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
        };
        const isPlayTrackInArtist =
          playingSource.in === "artist" &&
          currentTrack?._id === track._id &&
          isPlay;
        const filteredArtists = track.artists?.length
          ? ArtistSorter.sortAndGroupArtists(
              track.artists,
              track.releasedBy._id
            )
          : [];
        const isSubscribedTrack =
          session?.user.tracks.some((item: ITrack) => item._id === track._id) ||
          false;

        return (
          <div className="grid grid-cols-[60px_minmax(320px,1fr)_150px] text-xl font-bold text-white-06 group hover:bg-card-image py-3 px-2 rounded">
            <div className="flex justify-center h-14 items-center">
              {!isPlayTrackInArtist ? (
                <div
                  className={`group-hover:hidden ${
                    currentTrack?._id === track._id
                      ? "text-green-500"
                      : "text-white"
                  }`}
                >
                  {index + 1}
                </div>
              ) : (
                <EqualizerIcon
                  className="group-hover:hidden"
                  color="oklch(.723 .219 149.579)"
                  bars={4}
                  rounded={false}
                  speed={2}
                />
              )}

              <div
                className={`group-hover:block hidden translate-y-0.5 translate-x-0.5 text-white`}
              >
                {isPlayTrackInArtist ? (
                  <IoPause
                    size={20}
                    onClick={() => playTrack(false)}
                    className="-translate-x-0.5 h-12"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();

                      dispatch(
                        showTooltip({
                          content: `Tạm dừng`,
                          position: "top",
                          anchorRect: rect,
                        })
                      );
                    }}
                    onMouseLeave={() => dispatch(hideTooltip())}
                  />
                ) : (
                  <FaPlay
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();

                      dispatch(
                        showTooltip({
                          content: `Phát ${track.title} của ${filteredArtists
                            .map((item) => item.artist.stageName)
                            .join(`, `)}`,
                          position: "top",
                          anchorRect: rect,
                        })
                      );
                    }}
                    onMouseLeave={() => dispatch(hideTooltip())}
                    size={16}
                    onClick={() => playTrack(true)}
                    className="h-12"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col ">
              <Link
                href={`${frontendUrl}${router_track}${track._id}`}
                className={` ${
                  currentTrack?._id === track._id
                    ? "text-green-500"
                    : "text-white"
                } cursor-pointer hover:underline`}
              >
                {track.title}
              </Link>
              <span className="flex font-medium">
                {" "}
                {filteredArtists
                  .filter((item) => item.useStageName)
                  .map((item, index, array) => (
                    <Fragment key={item.artist._id}>
                      <Link
                        href={`${frontendUrl}${router_artist}${item.artist._id}`}
                        className="hover:underline hover:text-white"
                      >
                        {item.artist.stageName}
                      </Link>
                      {index < array.length - 1 && <span>,&nbsp;</span>}
                    </Fragment>
                  ))}
              </span>
            </div>
            <div className="flex gap-4 items-center flex-1 justify-end pr-4">
              <div
                className={` group-hover:text-white cursor-pointer invisible group-hover:visible pr-2 -translate-y-0.5`}
              >
                <ButtonSubscribeCircle
                  isSubscribed={isSubscribedTrack}
                  onSubscribe={handleSubscribeTrack}
                  onUnsubscribe={handleSubscribeTrack}
                />
              </div>
              <div
                className={`text-white-06 group-hover:text-white cursor-pointer font-normal`}
              >
                {formatDuration(track.duration)}
              </div>
              <div
                className={`text-white-06 group-hover:text-white cursor-pointer  invisible group-hover:visible`}
              >
                <ButtonDotTrack track={track} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClassifyDiscographyTrack;
