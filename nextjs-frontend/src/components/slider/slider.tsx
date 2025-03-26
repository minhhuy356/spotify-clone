"use client";

import { Box, Button, Divider } from "@mui/material";

import { ITrack } from "@/types/data";
import { useRef, useState, useEffect } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import ButtonPlay from "../button/button.play";

import ButtonPause from "../button/button.pause";
import Link from "next/link";
import { artist_type_group } from "@/contants/artist.type";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectWaitTrackList,
  setCurrentTrack,
  setInWhere,
  setIsInWaitlist,
  setWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import {
  setOpenContextMenuTrack,
  setType,
} from "@/lib/features/local/local.slice";
import { backendUrl, disk_tracks } from "@/api/url";
import Image from "next/image";

interface IProps {
  title: string;
  data: ITrack[];
}

const Slider = (props: IProps) => {
  const { data, title } = props;
  const sliderRef = useRef<HTMLDivElement>(null);
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const isPlay = useAppSelector(selectIsPlay);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const trackWidth = 192; // 48 * 4 (padding + margin) = 208px

  const [atStart, setAtStart] = useState(true); // Check if at the start of the slider
  const [atEnd, setAtEnd] = useState(false); // Check if at the end of the slider
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    e.preventDefault(); // Ngăn sự kiện mặc định để có thể kéo
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setStartScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;

    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Tăng tốc độ cuộn
    sliderRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Hàm cuộn trái
  const scrollLeft = () => {
    if (!sliderRef.current) return;

    const currentScroll = sliderRef.current.scrollLeft;
    const newScroll = Math.max(currentScroll - 4 * trackWidth, 0);

    if (newScroll !== currentScroll) {
      sliderRef.current.scrollLeft = newScroll;
    }
  };

  // Hàm cuộn phải
  const scrollRight = () => {
    if (!sliderRef.current) return;

    const currentScroll = sliderRef.current.scrollLeft;
    const maxScroll =
      sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
    const newScroll = Math.min(currentScroll + 4 * trackWidth, maxScroll);

    if (newScroll !== currentScroll) {
      sliderRef.current.scrollLeft = newScroll;
    }
  };

  // Dùng useEffect để lắng nghe khi cuộn slider thay đổi
  // useEffect(() => {
  //   updateArrowVisibility();
  //   if (sliderRef.current) {
  //     sliderRef.current.addEventListener("scroll", updateArrowVisibility);

  //     return () => {
  //       if (sliderRef.current) {
  //         sliderRef.current.removeEventListener(
  //           "scroll",
  //           updateArrowVisibility
  //         );
  //       }
  //     };
  //   }
  // }, []);

  useEffect(() => {
    const updateArrowVisibility = () => {
      if (sliderRef.current) {
        const scrollLeft = sliderRef.current.scrollLeft;
        const maxScroll =
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

        setAtStart(scrollLeft <= 0);
        setAtEnd(scrollLeft >= maxScroll - 1); // Tránh sai số khi cuộn gần max
      }
    };

    // Cập nhật ngay khi render
    updateArrowVisibility();

    // Lắng nghe sự kiện scroll
    sliderRef.current?.addEventListener("scroll", updateArrowVisibility);

    // Lắng nghe sự kiện resize và delay để giá trị cập nhật kịp
    const handleResize = () => {
      setTimeout(updateArrowVisibility, 100); // Đợi một chút để DOM cập nhật
    };

    window.addEventListener("resize", handleResize);

    return () => {
      sliderRef.current?.removeEventListener("scroll", updateArrowVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, [data]); // Thêm `data` vào dependencies để cập nhật khi có dữ liệu mới

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
      })
    );
    dispatch(setType("local"));

  };

  const playTrack = (track: ITrack) => {
    if (!isPlay || currentTrack?._id !== track._id) {
      dispatch(pause());
      dispatch(play({ waitTrackList: [], currentTrack: track }));
      dispatch(setInWhere({ where: "track", data: track }));
    }
    if (isPlay && currentTrack?._id === track._id) {
      dispatch(pause());
    }
  };

  const handlePlayTrack = (data: ITrack) => {
    playTrack(data);
    dispatch(setIsInWaitlist(false));
  };

  if (data.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-1 m-6">
      <div>
        <span className="text-2xl font-bold">{title}</span>
      </div>

      {/* Thêm group vào div cha */}
      <div className="relative w-full group">
        {/* Nút Trái */}
        <button
          onClick={scrollLeft}
          disabled={atStart}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full z-10 shadow-md 
        transition-opacity duration-300 ${
          atStart ? "hidden" : "opacity-0"
        } group-hover:opacity-100`}
        >
          {/* <ChevronLeftIcon /> */}
        </button>

        {/* Slider */}
        <div className="">
          <div
            ref={sliderRef}
            className="flex overflow-x-hidden scroll-smooth scrollbar-hide w-full"
            style={{
              scrollSnapType: "x mandatory",
              cursor: isDragging ? "grab" : "pointer",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseUp={handleMouseUpOrLeave}
          >
            {data.map((track, index) => (
              <div
                key={track._id}
                className="flex-none p-3 hover:bg-hover rounded-md w-48"
                style={{
                  scrollSnapAlign: "start",
                  cursor: isDragging ? "grab" : "pointer",
                }}
                onMouseDown={handleMouseDown}
                onContextMenu={(event) => {
                  handleOpenContextMenuTrack(track, event);
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className={`relative track`}>
                    <img
                      src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
                      alt={`Image of ${track.title}`}
                      className="size-44 object-cover rounded-md"
                    />

                    <div
                      className={`${
                        track._id === currentTrack?._id && isPlay
                          ? "hidden"
                          : "block"
                      } play absolute bottom-0 right-[8px] opacity-0  transition-all duration-300 hover:scale-110`}
                      onClick={() => handlePlayTrack(track)}
                    >
                      <ButtonPlay size={1} />
                    </div>
                    <div
                      className={`${
                        track._id === currentTrack?._id && isPlay
                          ? "opacity-100"
                          : "opacity-0"
                      }  absolute bottom-[8px] right-[8px] transition-all duration-300 hover:scale-110`}
                      onClick={() => handlePlayTrack(track)}
                    >
                      <ButtonPause />
                    </div>
                  </div>

                  <span className="text-xl line-clamp-2 font-bold hover:underline">
                    {track.title}
                  </span>
                  <div className="line-clamp-1 hover:text-white text-white-06">
                    <>
                      <Link
                        href={`artist/${track.releasedBy._id}`}
                        className="hover:underline hover:text-white"
                      >
                        {track.releasedBy.stageName}
                      </Link>
                      {track.artists
                        .filter(
                          (item) =>
                            item.artistTypeDetail?.artistTypeGroup.name.toUpperCase() ===
                              artist_type_group.performing &&
                            item.artist.stageName !== track.releasedBy.stageName // Loại bỏ trùng với releasedBy
                        )
                        .map((item, index, self) => {
                          const isDuplicate =
                            self.findIndex(
                              (a) => a.artist._id === item.artist._id
                            ) !== index;

                          return !isDuplicate ? (
                            <span key={item.artist._id}>
                              ,{" "}
                              <Link
                                href={`artist/${item.artist._id}`}
                                className="hover:underline hover:text-white"
                              >
                                {item.artist.stageName}
                              </Link>
                            </span>
                          ) : null;
                        })}
                    </>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nút Phải */}
        <button
          onClick={scrollRight}
          disabled={atEnd}
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full z-10 shadow-md 
        transition-opacity duration-300 ${
          atEnd ? "hidden" : "opacity-0"
        } group-hover:opacity-100`}
        >
          {/* <ChevronRightIcon /> */}
        </button>
      </div>
    </div>
  );
};

export default Slider;
