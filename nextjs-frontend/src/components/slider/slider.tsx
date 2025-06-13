"use client";
import { IAlbum, ITrack } from "@/types/data";
import { useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  play,
  pause,
  selectCurrentTrack,
  selectIsPlay,
} from "@/lib/features/tracks/tracks.slice";
import { api_track_artists, backendUrl, disk_tracks } from "@/api/url";
import { artist_type_group } from "@/contants/artist.type";
import ButtonPlay from "../button/button.play";
import ButtonPause from "../button/button.pause";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/api/api";
import SliderAlbumCard from "./slider.album.card";
import SliderTrackCard from "./slider.track.card";

type TypeData = "playlist" | "track" | "album";

interface IProps {
  title: string;
  data: (ITrack | IAlbum)[];
  typeData: TypeData; // <== THÊM VÔ
}

const Slider = (props: IProps) => {
  const { data, title, typeData } = props; // nhận thêm `isAlbum`
  const sliderRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setStartScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  if (data.length === 0) return <></>;

  return (
    <div className="flex flex-col gap-1 m-6">
      <div>
        <span className="text-2xl font-bold">{title}</span>
      </div>

      <div className="relative w-full">
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
            {data.map((item) => {
              // Kiểm tra là Track hay Album
              if (typeData === "album") {
                const album = item as IAlbum;
                return <SliderAlbumCard album={album} key={`${album._id}`} />;
              } else if (typeData === "track") {
                const track = item as ITrack;
                return <SliderTrackCard track={track} key={`${track._id}`} />;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
