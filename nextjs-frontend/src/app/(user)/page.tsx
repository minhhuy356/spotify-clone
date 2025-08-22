"use client";
import AppHeader from "@/components/header/app.header";
import Slider from "@/components/slider/slider";

import { sendRequest } from "@/api/api";
import { ITrack } from "@/types/data";
import { api_track_artists, backendUrl, url_api_albums } from "@/api/url";
import { track_artist_service } from "@/service/track-artist.service";
import {
  IRecentlyItem,
  listening_historys_service,
} from "@/service/listening-historys.service";

import FilterRecentlyAlbum from "./homepage/header/filter.recently.album";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Recently from "./homepage/recently";
import Color from "color";
import { selectScrollCenter } from "@/lib/features/scroll-center/scroll-center.slice";
import { useAppSelector } from "@/lib/hook";
import { safeColor } from "@/helper/color/safe-color";
import { Vibrant } from "node-vibrant/browser";

export type TFilterAlbum = "all" | "postcast" | "music";

export interface IBg {
  color: string;
  disk: string;
  height: number;
}

const HomePage = () => {
  const [typeFilter, setTypeFilter] = useState<TFilterAlbum>("all");
  const [recently, setRecently] = useState<IRecentlyItem[]>([]);
  const [bg, setBg] = useState<IBg>({
    color: "",
    disk: "",
    height: 0,
  });

  const scrollCenter = useAppSelector(selectScrollCenter);

  const bgColor = safeColor(scrollCenter?.color, "transparent");

  useEffect(() => {
    if (!bg.color || !bg.disk) return;

    Vibrant.from(bg.disk)
      .getPalette()
      .then((palette) => {
        if (!palette) return;

        let dominantSwatch = null;
        let brightestSwatch = null;
        let maxPopulation = 0;
        let maxBrightness = 0;

        for (let key in palette) {
          const swatch = palette[key];

          if (swatch) {
            // Tìm màu có population lớn nhất (màu chiếm ưu thế)
            if (swatch.population > maxPopulation) {
              dominantSwatch = swatch;
              maxPopulation = swatch.population;
            }

            // Tìm màu sáng nhất dựa trên độ sáng (brightness)
            const [r, g, b] = swatch.rgb;
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            if (brightness > maxBrightness) {
              brightestSwatch = swatch;
              maxBrightness = brightness;
            }
          }
        }

        if (dominantSwatch) {
          // if (artist.coverImgUrl) {}
          setBg((prev) => ({ ...prev, color: dominantSwatch.hex }));
        } else {
        }

        // if (brightestSwatch) {
        //   if (!artist.coverImgUrl) {
        //     setBg(brightestSwatch.hex);

        //   }
        // }
      })
      .catch((error) => console.error("Error extracting color:", error));
  }, [bg]);

  const recentlyRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (!recentlyRef.current) return;

    const heightRecently = recentlyRef.current.offsetHeight;
    if (heightRecently) {
      setBg((prev) => ({ ...prev, height: heightRecently }));
      console.log(recentlyRef.current);
    }
  }, [recently]);

  return (
    <div className="mx-auto max-w-[1955px] py-4 z-100 relative">
      <div
        className="w-full  absolute top-0 z-0"
        style={{
          background: `linear-gradient(to bottom, ${bgColor} 0%, transparent 100%)`,
          opacity:
            bgColor === "transparent"
              ? 0
              : Color(bgColor).isLight()
              ? 0.2
              : 0.7,
          height: bg.height,
        }}
      ></div>
      <div className=" w-full absolute top-0 z-10 w">
        {" "}
        <div className="flex flex-col " ref={recentlyRef}>
          <FilterRecentlyAlbum
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />
          <Recently recently={recently} setRecently={setRecently} />
        </div>
      </div>

      {/* <Slider
        title={"Rap"}
        header="Dành cho"
        data={rap?.data ?? []}
        typeData="track"
      /> */}
    </div>
  );
};

export default HomePage;
