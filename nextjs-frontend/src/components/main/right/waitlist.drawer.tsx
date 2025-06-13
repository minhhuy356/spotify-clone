import { backendUrl, disk_tracks } from "@/api/url";
import ScrollBar from "@/components/scroll/scroll";
import { artist_type_group } from "@/contants/artist.type";
import { findIndexById } from "@/helper/context-menu/context-menu.track";
import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
  selectWaitTrackList,
  setInWaitList,
} from "@/lib/features/tracks/tracks.slice";
import { useAppSelector } from "@/lib/hook";

import { IArtist, ITrack } from "@/types/data";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";

interface IProps {
  showWaitlist: boolean;
  scrollWaitlist: number;
  fatherRef: React.RefObject<HTMLDivElement | null>;
  headeWaitlistRef: React.RefObject<HTMLDivElement | null>;
  setShowWaitlist: (value: boolean) => void;
  setScrollWaitlist: (value: number) => void;
}

const WaitlistDrawer = (props: IProps) => {
  const {
    showWaitlist,
    scrollWaitlist,
    fatherRef,
    setShowWaitlist,
    setScrollWaitlist,
    headeWaitlistRef,
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const isPlay = useAppSelector(selectIsPlay);
  const playingSource = useAppSelector(selectPlayingSource);
  const [visibleCount, setVisibleCount] = useState(20); // bắt đầu hiển thị 4 bài
  const playTrack = (track: ITrack) => {
    if (currentTrack) {
      if (!isPlay || currentTrack !== track) {
        dispatch(pause());

        dispatch(
          play({
            waitTrackList: [...waitTrackList],
            currentTrack: track,
            playingSource: {
              in: playingSource.in,
              title: playingSource.title,
              before: playingSource.before,
            },
            inWaitList: true,
          })
        );
      }
      if (isPlay && currentTrack === track) {
        dispatch(pause());
      }
    }
  };

  const handlePlayTrack = (data: ITrack) => {
    playTrack(data);
  };

  const handleOpenContextMenuTrack = (
    track: ITrack,
    event: React.MouseEvent
  ) => {
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
    if (!currentTrack || waitTrackList.length === 0) return;

    const currentIndex = waitTrackList.findIndex(
      (track) => track._id === currentTrack._id
    );

    // Nếu currentTrack nằm cuối phần đang hiển thị, thì load thêm
    if (
      currentIndex === visibleCount - 1 &&
      visibleCount < waitTrackList.length
    ) {
      setVisibleCount((prev) => Math.min(prev + 2, waitTrackList.length));
    }
  }, [currentTrack, waitTrackList, visibleCount]);
  if (!waitTrackList) return <></>;

  return (
    <>
      {/* Danh sách chờ */}
      <div
        className={`absolute bottom-0 right-0 left-0 bg-base z-100  overflow-hidden transition-all duration-[600ms] h-full ${
          showWaitlist
            ? "translate-y-0 opacity-100 "
            : "translate-y-full opacity-0"
        }`}
      >
        {/* Header */}
        <div
          className={`${
            scrollWaitlist !== 0 && "shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
          }  bg-base w-full px-4 py-2 transition-all duration-300`}
          ref={headeWaitlistRef}
        >
          <div className="flex justify-between items-center min-h-[48px] ">
            <div className="text-lg font-semibold">
              <span>Danh sách chờ</span>
            </div>
            <div className="flex  items-center size-8 justify-center">
              <div
                className="text-white-05 hover:text-white cursor-pointer"
                onClick={() => setShowWaitlist(false)}
              >
                <IoClose size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full">
          {/* {visibleCount < waitTrackList.length && (
            <div className="text-center py-4">
              <button
                className="text-green-500 hover:underline"
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + 2, waitTrackList.length)
                  )
                }
              >
                Hiện thêm bài hát
              </button>
            </div>
          )} */}
          <ScrollBar setScroll={setScrollWaitlist} fatherRef={fatherRef}>
            <div className={`px-2`}>
              {currentTrack &&
                waitTrackList.length > 0 &&
                waitTrackList.slice(0, visibleCount).map((track, index) => {
                  const indexcurrentTrack = findIndexById(
                    waitTrackList,
                    currentTrack
                  );

                  const isPreviousTrack = index < indexcurrentTrack;

                  return (
                    <>
                      {" "}
                      <div
                        className="flex flex-col"
                        key={`${track._id}-waitlist`}
                      >
                        {track === currentTrack && (
                          <div className="mb-1 px-2 font-semibold ">
                            Đang phát
                          </div>
                        )}
                        <div
                          key={track._id}
                          className={`${track === currentTrack ? "mb-6" : ""} ${
                            isPreviousTrack ? "opacity-50" : "opacity-100"
                          } group flex px-2 justify-between  py-2 rounded-md transition hover:bg-hover hover:opacity-100`}
                          onContextMenu={(event) => {
                            handleOpenContextMenuTrack(track, event);
                          }}
                        >
                          <div className={`flex gap-3 flex-1 `}>
                            <div className="relative">
                              <div
                                className={`${
                                  track === currentTrack && isPlay
                                    ? "!block"
                                    : "hidden"
                                } cursor-pointer absolute top-1/2 left-1/2 text-white transform -translate-x-1/2 -translate-y-1/2 group-hover:flex  transition`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handlePlayTrack(track);
                                }}
                              >
                                <FaPause
                                  size={15}
                                  className={`size-4 ${
                                    track === currentTrack && isPlay
                                      ? "block"
                                      : "hidden"
                                  }`}
                                />
                                <FaPlay
                                  className={`${
                                    track === currentTrack && isPlay
                                      ? "hidden"
                                      : "block"
                                  }`}
                                  size={15}
                                />
                              </div>
                              <img
                                className="w-[48px] h-[48px] rounded-md cursor-pointer"
                                src={`${
                                  playingSource.in === "album"
                                    ? `${backendUrl}${disk_tracks.images}${track.album.imgUrl}`
                                    : `${backendUrl}${disk_tracks.images}${track.imgUrl}`
                                }`}
                              />
                            </div>
                            <div className={`flex-col cursor-pointer flex-1  `}>
                              <div
                                className={`text-md line-clamp-1 ${
                                  track === currentTrack
                                    ? "text-green-500 "
                                    : ""
                                }`}
                                onClick={async (e) => {
                                  e.preventDefault();
                                  if (track) {
                                    await handlePlayTrack(track);
                                    router.push(
                                      `/track/${track}?audio=${track.audioUrl}`
                                    );
                                  }
                                }}
                              >
                                <span>{track.title}</span>
                              </div>
                              <div className="text-sm opacity-60  decoration-1 cursor-pointer line-clamp-1">
                                <Link
                                  href={`artist/${track.releasedBy._id}`}
                                  className="hover:underline hover:text-white"
                                >
                                  {track.releasedBy.stageName}
                                </Link>
                                {track.artists
                                  .filter(
                                    (artists) =>
                                      artists.artistTypeDetail?.artistTypeGroup.name.toUpperCase() ===
                                        artist_type_group.performing &&
                                      artists.artist.stageName !==
                                        track.releasedBy.stageName // Loại bỏ trùng với releasedBy
                                  )
                                  .map((artists, index, self) => {
                                    const isDuplicate =
                                      self.findIndex(
                                        (a) =>
                                          a.artist._id === artists.artist._id
                                      ) !== index;

                                    return !isDuplicate ? (
                                      <span key={artists.artist._id}>
                                        ,{" "}
                                        <Link
                                          href={`artist/${artists.artist._id}`}
                                          className="hover:underline hover:text-white"
                                        >
                                          {artists.artist.stageName}
                                        </Link>
                                      </span>
                                    ) : null;
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                        {track === currentTrack &&
                          waitTrackList.findIndex(
                            (item) => item._id === currentTrack._id
                          ) <
                            waitTrackList.length - 1 && (
                            <div className="mb-1 px-2 font-semibold ">
                              Nội dung tiếp theo
                              {playingSource.in === "artist" &&
                                ` từ ${playingSource.title}`}{" "}
                              {playingSource.in === "album" &&
                                ` từ ${playingSource.title}`}
                            </div>
                          )}
                      </div>
                    </>
                  );
                })}
            </div>
          </ScrollBar>
        </div>
      </div>
    </>
  );
};

export default WaitlistDrawer;
