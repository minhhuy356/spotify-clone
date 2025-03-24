"use client";
import { useEffect, useState, useRef, RefObject } from "react";
import { Vibrant } from "node-vibrant/browser";
import Color from "color"; // Import thư viện màu sắc
import { IArtist, IMonthlyListener, ITrack } from "@/types/data";
import { backendUrl, disk_artists } from "@/api/url";
import { TiTick } from "react-icons/ti";

interface IProps {
  mainColor: any;
  artist: IArtist;
  imgRef: RefObject<HTMLImageElement | null>;
  monthlyListener: IMonthlyListener;
}

const CoverArtist = ({
  mainColor,
  artist,
  imgRef,
  monthlyListener,
}: IProps) => {
  return (
    <div className="w-full ">
      {/* Ảnh Cover */}
      <div className="relative flex">
        <img
          ref={imgRef}
          src={`${backendUrl}${disk_artists.cover}${artist.coverImgUrl}`}
          alt={artist._id}
          crossOrigin="anonymous"
          className="w-full h-[40vh] object-cover object-top min-h-[192px]"
        />
        <div
          className="absolute top-0 bottom-0 left-0 right-0 "
          style={{
            background: `linear-gradient(to top, rgb(0 0 0 / 30%) 0%, transparent 100%)`,
          }}
        ></div>
        <div className="absolute bottom-0 left-0 flex flex-col gap-4 flex-1 right-0   ">
          <div className="p-6 max-w-[1800px] mx-auto w-full flex gap-8">
            <div className="flex flex-col justify-center ">
              <div className="flex flex-col relative">
                {/* Wrapper chứa SVG và Tick */}
                <div className="flex items-center gap-2">
                  <div className="relative w-[48px] h-[48px]">
                    {/* Icon ngũ giác bo góc */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 100 100"
                      width="64"
                      height="64"
                      className="absolute z-1 -top-[6px] -left-[10px]"
                    >
                      <path
                        fill="#00BFFF"
                        d="M 215 175 A 15 15 0 0 0 200 190 L 200 255 L 150 300 A 30 30 0 0 0 150 330 L 200 380 L 200 445 A 15 15 0 0 0 215 460 L 280 460 L 310 490 A 30 30 0 0 0 355 490 L 390 460 L 470 460 A 15 15 0 0 0 475 445 L 475 380 L 525 340 A 30 30 0 0 0 525 310 L 475 255 L 475 195 A 15 15 0 0 0 460 175 L 390 175 L 355 145 A 30 30 0 0 0 315 145 L 280 175 Z"
                        transform="scale(0.15)"
                      />
                    </svg>

                    {/* Icon dấu tick */}
                    <TiTick
                      size={30}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white"
                    />
                  </div>

                  <span className={`text-[0.85rem] lg:text-[1rem] `}>
                    Nghệ sĩ được xác minh
                  </span>
                </div>
                <span className=" text-6xl xl:text-7xl 2xl:text-8xl font-extrabold">
                  {artist.stageName}
                </span>
                <div className={`mt-4 text-[0.85rem] lg:text-xl`}>
                  {monthlyListener.count} người nghe hàng tháng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverArtist;
