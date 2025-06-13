import { backendUrl, disk_tracks } from "@/api/url";
import ScrollBar from "@/components/scroll/scroll";
import { artist_type_group } from "@/contants/artist.type";
import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { useAppSelector } from "@/lib/hook";

import { ITrack } from "@/types/data";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";

interface IProps {
  setShowWaitlist: (value: boolean) => void;
}

const Waitlist = (props: IProps) => {
  const { setShowWaitlist } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  const waitTrackList = useAppSelector(selectWaitTrackList);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const isPlay = useAppSelector(selectIsPlay);

  const playTrack = (track: ITrack) => {
    if (!isPlay || currentTrack !== track) {
      const clone = [...waitTrackList];
      if (!clone.find((track) => track._id === track._id)) {
        clone.push(track);
      }
      dispatch(pause());
      dispatch(
        play({
          waitTrackList: clone,
          currentTrack: track,
          inWaitList: true,
          playingSource: {
            in: "track",
            title: "",
            before: "track",
          },
        })
      );
    }
    if (isPlay && currentTrack === track) {
      dispatch(pause());
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
        inLibrary: true,
      })
    );
  };

  const track = currentTrack;

  if (!track) return <></>;
  const trackNext =
    waitTrackList[
      waitTrackList.findIndex((item) => item._id === track?._id) + 1
    ];
  return (
    <>
      <div className="w-full h-auto rounded-md overflow-hidden bg-30 ">
        <div className=" flex flex-col gap-4 p-4">
          <div className="flex justify-between gap-2">
            <div className="font-semibold flex-1  line-clamp-1 ">
              <span className="">Tiếp theo trong danh sách chờ</span>
            </div>
            <div
              className="text-white-06 whitespace-nowrap hover:text-white hover:scale-105 hover:underline cursor-pointer"
              onClick={() => setShowWaitlist(true)}
            >
              <span>Mở danh sách chờ</span>
            </div>
          </div>
          {/* Track next */}
          {trackNext && (
            <div
              key={trackNext._id}
              className={` group flex px-2 justify-between  py-2 rounded-md transition hover:bg-hover`}
              onContextMenu={(event) => {
                handleOpenContextMenuTrack(trackNext, event);
              }}
            >
              <div className={`flex gap-3 flex-1 `}>
                <div className="relative">
                  <div
                    className={`${
                      trackNext._id === currentTrack?._id && isPlay
                        ? "!block"
                        : "hidden"
                    } cursor-pointer absolute top-1/2 left-1/2 text-white transform -translate-x-1/2 -translate-y-1/2 group-hover:flex  transition`}
                    onClick={(event) => {
                      event.stopPropagation();
                      handlePlayTrack(trackNext);
                    }}
                  >
                    <FaPause
                      size={15}
                      className={`size-4 ${
                        trackNext._id === currentTrack?._id && isPlay
                          ? "block"
                          : "hidden"
                      }`}
                    />
                    <FaPlay
                      className={`${
                        trackNext._id === currentTrack?._id && isPlay
                          ? "hidden"
                          : "block"
                      }`}
                      size={15}
                    />
                  </div>
                  <img
                    className="w-[48px] h-[48px] rounded-md cursor-pointer"
                    src={`${backendUrl}${disk_tracks.images}${trackNext.imgUrl}`}
                  />
                </div>
                <div className={`flex-col cursor-pointer flex-1  `}>
                  <div
                    className={`text-md line-clamp-1 ${
                      trackNext._id === currentTrack?._id
                        ? "text-green-500 "
                        : ""
                    }`}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (trackNext) {
                        await handlePlayTrack(trackNext);
                        router.push(
                          `/track/${trackNext._id}?audio=${trackNext.audioUrl}`
                        );
                      }
                    }}
                  >
                    <span>{trackNext.title}</span>
                  </div>
                  <div className="text-sm opacity-60  decoration-1 cursor-pointer line-clamp-1">
                    <Link
                      href={`artist/${trackNext.releasedBy._id}`}
                      className="hover:underline hover:text-white"
                    >
                      {trackNext.releasedBy.stageName}
                    </Link>
                    {trackNext.artists
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
                            (a) => a.artist._id === artists.artist._id
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
          )}
        </div>
      </div>
    </>
  );
};

export default Waitlist;
