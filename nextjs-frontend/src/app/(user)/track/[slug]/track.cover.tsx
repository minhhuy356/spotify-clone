"use client";
import { useEffect, useState, useRef, RefObject } from "react";
import { Vibrant } from "node-vibrant/browser";
import Color from "color"; // Import thư viện màu sắc
import { ITrack, IArtist, IMonthlyListener } from "@/types/data";
import {
  backendUrl,
  disk_artists,
  disk_tracks,
  image_favorite,
  url_disk_users,
} from "@/api/url";
import { TiTick } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { selectSession } from "@/lib/features/auth/auth.slice";
import {
  selectScrollCenter,
  setCoverHeight,
} from "@/lib/features/scroll-center/scroll-center.slice";

interface IProps {
  imgRef: RefObject<HTMLImageElement | null>;
  track: ITrack;
}

const PageTrackCover = ({ imgRef, track }: IProps) => {
  const session = useAppSelector(selectSession);

  const scrollCenter = useAppSelector(selectScrollCenter);

  if (!scrollCenter.color) return <></>;

  return (
    <div className="w-full ">
      {/* Ảnh Cover */}
      <div className="relative flex [height:clamp(186px,18vw,336px)]">
        <div
          className="w-full shadow"
          style={{
            background: `${Color(scrollCenter.color).hex()}`,
          }}
        />{" "}
        <div
          className="absolute top-0 bottom-0 left-0 right-0 "
          style={{
            background: `linear-gradient(to top, rgb(0 0 0 / 50%) 0%, transparent 100%)`,
          }}
        ></div>
        <div className=" flex gap-4 2xl:gap-6 flex-1 absolute right-0 left-0 bottom-4 clamp-px max-w-[1955px] mx-auto ">
          <div className=" [height:clamp(128px,15vw,232px)] [width:clamp(128px,15vw,232px)] flex flex-col justify-end ">
            <img
              crossOrigin="anonymous"
              ref={imgRef}
              src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
              // alt={artist._id}
              className="rounded object-cover object-top image-avatar-artist aspect-square"
            />
          </div>

          <div className="flex flex-col justify-end ">
            <div className="flex flex-col relative">
              {/* Wrapper chứa SVG và Tick */}
              <div className="flex items-center ">
                <span className={`text-xs lg:text-[1rem] flex-1`}>Track</span>
              </div>
              <span className=" [font-size:clamp(28px,4vw,72px)]  font-extrabold">
                {track.title}
              </span>
              <div className="mt-2 lg:text-xl flex gap-2 items-center text-xs flex-wrap [font-size:clamp(6px,2vw,24px)]">
                <img
                  src={`${backendUrl}${disk_artists.avatar}${track.releasedBy.avatarImgUrl}`}
                  alt=""
                  className="rounded-full size-6"
                />
                <p> {track.releasedBy.stageName}</p>
                <p className="text-white-08 text-nowrap">
                  • {new Date(track.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTrackCover;
