"use client";
import { useEffect, useState, useRef, RefObject } from "react";
import { Vibrant } from "node-vibrant/browser";
import Color from "color"; // Import thư viện màu sắc
import { IArtist, IMonthlyListener, ITrack } from "@/types/data";
import {
  backendUrl,
  disk_artists,
  image_favorite,
  url_disk_users,
} from "@/api/url";
import { TiTick } from "react-icons/ti";
import { useAppSelector } from "@/lib/hook";
import { selectSession } from "@/lib/features/auth/auth.slice";

interface IProps {}

const CollectionCover = ({}: IProps) => {
  const session = useAppSelector(selectSession);

  return (
    <div className="w-full ">
      {/* Ảnh Cover */}
      <div className="relative flex [height:clamp(186px,18vw,336px)]">
        <div
          className="w-full shadow"
          style={{
            background: `rgb(80, 56, 160)`,
          }}
        />{" "}
        <div
          className="absolute top-0 bottom-0 left-0 right-0 "
          style={{
            background: `linear-gradient(to top, rgb(0 0 0 / 40%) 0%, transparent 100%)`,
          }}
        ></div>
        <div className=" flex gap-4 2xl:gap-6 flex-1 absolute right-0 left-0 bottom-4 clamp-px max-w-[1955px] mx-auto">
          <div className=" [height:clamp(128px,12vw,232px)] [width:clamp(128px,12vw,232px)] ">
            <img
              crossOrigin="anonymous"
              src={image_favorite}
              // alt={artist._id}
              className="rounded object-cover object-top image-avatar-artist aspect-square"
            />
          </div>

          <div className="flex flex-col justify-end ">
            <div className="flex flex-col relative">
              {/* Wrapper chứa SVG và Tick */}
              <div className="flex items-center ">
                <span className={`text-xs lg:text-[1rem] flex-1`}>
                  Playlist
                </span>
              </div>
              <span className=" text-[28px] xl:text-5xl 2xl:text-7xl font-extrabold">
                Bài hát đã thích
              </span>
              <div className="mt-2 lg:text-xl flex gap-2 items-center text-xs">
                <img
                  src={`${backendUrl}${url_disk_users}${session?.user.imgUrl}`}
                  alt=""
                  className="rounded-full size-6"
                />
                <p> {session?.user.name}</p>
                <p className="text-white-08">
                  • {session?.user.tracks.length} bài hát
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCover;
