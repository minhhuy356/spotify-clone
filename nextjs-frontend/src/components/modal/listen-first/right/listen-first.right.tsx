import {
  selectIsPlay,
  selectListenFirst,
  selectPlayingSource,
  selectWaitTrackList,
  setListenFirst,
  setListenFirstTrackIndex,
  setWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { HTMLAttributes, useEffect, useState } from "react";
import "./style.css";
import { backendUrl, disk_artists, frontendUrl } from "@/api/url";
import ButtonSubscribe from "@/components/button/button.subscribe.artist";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import ButtonSubscribeArtist from "@/components/button/button.subscribe.artist";
import { IArtist } from "@/types/data";
import { artist_service } from "@/service/artist.service";
import { useMediaQuery } from "@mui/material";
import { TiVolumeDown, TiVolumeMute } from "react-icons/ti";
import EqualizerIcon from "@/components/icon/equalizer/icon.equalizer";
import { IoArrowDownOutline, IoCloseOutline } from "react-icons/io5";
import ButtonDotAlbum from "@/components/button/dot/button.dot.album";
import ButtonDotTrack from "@/components/button/dot/button.dot.track";
import { IoIosArrowDown, IoIosArrowUp, IoMdLink } from "react-icons/io";
import Tooltip from "@/components/tooltip/tooltip";
import CopyLink from "@/components/copylink/copylink";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { useNotification } from "@/components/notification/notification-context";
import { cssNotifycationListenFirst } from "@/contants/css.notifycation.listenfirst";
import ButtonSubscribeCircle from "@/components/button/button.subscribe.circle";
import { user_activity_service } from "@/service/user-activity.service";
import IconFavorite from "@/components/icon/icon.favorite";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
  volume: number;
  setVolume: (value: number) => void;
}

const RightListenFirst = ({ index, volume, setVolume }: IProps) => {
  const { setNotification } = useNotification();

  const listenFirst = useAppSelector(selectListenFirst);
  const [prevIndex, setPrevIndex] = useState(index);
  const [isInitial, setIsInitial] = useState(true);
  const [animating, setAnimating] = useState(false);
  const session = useAppSelector(selectSession);
  const [artist, setArtist] = useState<IArtist>();
  const xl = useMediaQuery("(min-width: 1200px)");
  const lg = useMediaQuery("(min-width:992px)");
  const direction = index > prevIndex ? "up" : "down";
  const dispatch = useAppDispatch();
  const playingSource = useAppSelector(selectPlayingSource);
  const isPlay = useAppSelector(selectIsPlay);

  const waitTrackList = useAppSelector(selectWaitTrackList);
  const [isPressedUp, setIsPressedUp] = useState(false);
  const [isPressedDown, setIsPressedDown] = useState(false);

  useEffect(() => {
    const volume = parseFloat(localStorage.getItem("volume")?.toString() || "");
    if (volume !== 0) {
      setVolume(volume);
    } else {
      setVolume(0);
    }
  }, []);

  useEffect(() => {
    if (index !== prevIndex) {
      setIsInitial(false);
      setAnimating(true);
      const timeout = setTimeout(() => {
        setPrevIndex(index);
        setAnimating(false);
      }, 300); // khớp thời gian animation
      return () => clearTimeout(timeout);
    }
  }, [index]);

  const handleMuteVolume = () => {
    setVolume(0);
  };

  const handleUnMuteVolume = () => {
    const volume = parseFloat(
      localStorage.getItem("volumeBefore")?.toString() || ""
    );

    if (volume) {
      setVolume(volume);
    } else {
      setVolume(1);
    }
  };

  const handleAddWaitTrackList = () => {
    const track =
      listenFirst.playingAudioListenFirst.allTrack[
        listenFirst.playingAudioListenFirst.trackIndex
      ];
    if (track) {
      // Kiểm tra nếu track đã tồn tại trong danh sách
      const isTrackInList = waitTrackList.some((t) => t._id === track._id);
      if (isTrackInList) {
        return;
      }
      // Nếu track chưa tồn tại, thêm vào danh sách
      const newWaitTrackList = [...waitTrackList, track];
      dispatch(setWaitTrackList(newWaitTrackList));
      setNotification({
        content: "Đã thêm vào danh sách chờ",
        isOpen: true,
        customStyle: cssNotifycationListenFirst,
      });
    }
  };

  const handleSubscribeTrack = async (isSubscribe: boolean) => {
    if (!session) return;
    const track =
      listenFirst.playingAudioListenFirst.allTrack[
        listenFirst.playingAudioListenFirst.trackIndex
      ];
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

  const isLastTrack =
    listenFirst.playingAudioListenFirst.trackIndex + 1 ===
    listenFirst.playingAudioListenFirst.allTrack.length;

  if (!session) return <></>;

  return (
    <>
      <div className=" cursor-pointer flex gap-2 items-center justify-end">
        <div className=" gap-2 text-white-06 hover:text-white hidden md:flex">
          {volume === 0 || volume === undefined ? (
            <Tooltip content="Bật tiếng" placement="left">
              <div
                className="flex hover:scale-110 items-center justify-center"
                onClick={() => {
                  handleUnMuteVolume();
                }}
              >
                <TiVolumeMute size={32} />
              </div>
            </Tooltip>
          ) : (
            <Tooltip content="Tắt tiếng" placement="left">
              <div
                className="flex gap-2 items-center justify-center group"
                onClick={handleMuteVolume}
              >
                <TiVolumeDown size={28} className="group-hover:scale-110" />
                <div className="translate-y-[0px]">
                  <EqualizerIcon width={16} height={16} />
                </div>
              </div>
            </Tooltip>
          )}
        </div>{" "}
        <Tooltip content="Đóng" placement="bottom">
          <div className="size-4 md:size-8">
            <IoCloseOutline
              className="w-full h-full"
              onClick={() => {
                dispatch(
                  setListenFirst({
                    modalListenFirst: {
                      isOpen: false,
                    },
                    playingSource: {
                      in: playingSource.before,
                      before: playingSource.in,
                    },
                    playingAudioListenFirst: {
                      title: "",
                      isPlayListenFirst: false,
                      allTrack: [],
                      trackIndex: 0,
                    },
                  })
                );
              }}
            />
          </div>
        </Tooltip>
      </div>
      <div className=" cursor-pointer flex flex-col gap-1 xl:gap-4 items-center justify-center pr-8 xl:pr-16 ">
        <div className="text-white-06 hover:text-white">
          <Tooltip
            placement="left"
            content={`Các tùy chọn cho ca khúc ${
              listenFirst.playingAudioListenFirst.allTrack[
                listenFirst.playingAudioListenFirst.trackIndex
              ].title
            }`}
          >
            <ButtonDotTrack
              track={
                listenFirst.playingAudioListenFirst.allTrack[
                  listenFirst.playingAudioListenFirst.trackIndex
                ]
              }
              size={xl ? 28 : 20}
            />
          </Tooltip>
        </div>
        <div className="text-white-06 hover:text-white">
          <Tooltip
            placement="left"
            content={`Liên kết đã được sao chép vào clipboard`}
          >
            <CopyLink
              url={`${frontendUrl}/track/${
                listenFirst.playingAudioListenFirst.allTrack[
                  listenFirst.playingAudioListenFirst.trackIndex
                ]._id
              }`}
              customStyleForNotifyCation={cssNotifycationListenFirst}
            >
              <IoMdLink size={xl ? 28 : 20} />
            </CopyLink>
          </Tooltip>
        </div>
        <div
          className="text-white-06 hover:text-white"
          onClick={handleAddWaitTrackList}
        >
          <Tooltip placement="left" content={`Thêm vào danh sách chờ`}>
            <MdOutlinePlaylistAdd size={xl ? 28 : 20} />
          </Tooltip>
        </div>
        <div
          className="text-white hover:scale-110 -translate-x-0.5 transition-all duration-300"
          onClick={handleAddWaitTrackList}
        >
          <Tooltip placement="left" content={`Thêm vào bài hát đã thích`}>
            <ButtonSubscribeCircle
              colorAdd="white"
              className="text-white"
              size={xl ? 28 : 20}
              isSubscribed={session?.user.tracks.some(
                (t) =>
                  t._id ===
                  listenFirst.playingAudioListenFirst.allTrack[
                    listenFirst.playingAudioListenFirst.trackIndex
                  ]._id
              )}
              onSubscribe={handleSubscribeTrack}
              onUnsubscribe={handleSubscribeTrack}
            />
          </Tooltip>
        </div>{" "}
      </div>{" "}
      <div className="relative h-20 2xl:h-30">
        {index === 0 ? (
          <div
            className="absolute bottom-1 2xl:bottom-2 right-0 cursor-pointer flex gap-2 items-center justify-end "
            onClick={() => {
              dispatch(setListenFirstTrackIndex(index + 1));
            }}
          >
            <div
              className={`${
                !isLastTrack
                  ? "bg-white cursor-pointer"
                  : "bg-white-04 cursor-not-allowed"
              } text-[1.125rem] p-2 xl:px-8 xl:py-4 text-black font-bold text rounded-full text-nowrap flex justify-center items-center gap-2 next `}
            >
              <button
                className={`${
                  !isLastTrack ? " cursor-pointer" : " cursor-not-allowed"
                } hidden xl:inline-block`}
              >
                Tiếp
              </button>{" "}
              <IoArrowDownOutline size={xl ? 28 : 20} />
            </div>
          </div>
        ) : (
          <div className="absolute -top-3 2xl:top-0 right-0 cursor-pointer flex flex-col gap-3 2xl:gap-5 items-end justify-end text-white-06 pr-2">
            <div
              className={`  ${
                isPressedUp ? "opacity-50 scale-95" : " scale-100"
              } hover:text-white hover:bg-110 bg-transparent p-2 rounded-full   ${
                index !== 0 ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                if (index !== 0) {
                  dispatch(setListenFirstTrackIndex(index - 1));
                }
              }}
              onMouseDown={() => {
                if (index !== 0) setIsPressedUp(true);
              }}
              onMouseUp={() => setIsPressedUp(false)}
              onMouseLeave={() => setIsPressedUp(false)} // tránh bị kẹt khi rê chuột ra ngoài
            >
              <IoIosArrowUp
                size={30}
                className="hover:scale-105 transition-all duration-100"
              />
            </div>
            <div
              className={`  ${
                isPressedDown ? "opacity-50 scale-95" : " scale-100"
              } hover:text-white hover:bg-110 bg-transparent p-2 rounded-full   ${
                index + 1 !==
                listenFirst.playingAudioListenFirst.allTrack.length
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                if (
                  index + 1 !==
                  listenFirst.playingAudioListenFirst.allTrack.length
                ) {
                  dispatch(setListenFirstTrackIndex(index + 1));
                }
              }}
              onMouseDown={() => {
                if (
                  index + 1 !==
                  listenFirst.playingAudioListenFirst.allTrack.length
                )
                  setIsPressedDown(true);
              }}
              onMouseUp={() => setIsPressedDown(false)}
              onMouseLeave={() => setIsPressedDown(false)}
            >
              <IoIosArrowDown
                size={30}
                className="hover:scale-105 transition-all duration-100"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RightListenFirst;
