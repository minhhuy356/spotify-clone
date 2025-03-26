"use client";
import { useEffect, useState, useRef } from "react";
import { Vibrant } from "node-vibrant/browser";
import Color from "color"; // Import thư viện màu sắc
import {
  IArtist,
  IChooseByArtist,
  IMonthlyListener,
  ITrack,
} from "@/types/data";
import { backendUrl, disk_artists } from "@/api/url";
import { TiTick } from "react-icons/ti";
import AvatarArtist from "./main/avatar";
import CoverArtist from "./main/cover";
import ButtonPlay from "@/components/button/button.play";
import ButtonSubscribe from "@/components/button/button.subscribe";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { HiDotsHorizontal } from "react-icons/hi";
import ButtonDot from "@/components/button/button.dot.artist";
import { setOpenContextMenuArtist } from "@/lib/features/local/local.slice";
import ButtonDotArtist from "@/components/button/button.dot.artist";
import PopularTrack from "./popular-songs";
import ChooseByArtist from "./choose-by-artist";

interface IProps {
  artist: IArtist;
  trackForArtist: ITrack[];
  monthlyListener: IMonthlyListener;
  chooseByArtist: IChooseByArtist;
}

const MainArtist = ({
  artist,
  trackForArtist,
  monthlyListener,
  chooseByArtist,
}: IProps) => {
  const session = useAppSelector(selectSession);
  const dispatch = useAppDispatch();
  const imgRef = useRef<HTMLImageElement>(null);
  const [coverColor, setCoverColor] = useState("");
  const [avatarColor, setAvatarColor] = useState("");

  useEffect(() => {
    if (!artist) return;

    Vibrant.from(
      `${backendUrl}${
        artist.coverImgUrl ? disk_artists.cover : disk_artists.avatar
      }${artist.coverImgUrl ? artist.coverImgUrl : artist.avatarImgUrl}`
    )
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
          setCoverColor(dominantSwatch.hex);
        } else {
        }

        if (brightestSwatch) {
          setAvatarColor(brightestSwatch.hex);
        }
      })
      .catch((error) => console.error("Error extracting color:", error));
  }, [artist]);

  const isSubscribe =
    session?.user.artists.some((a) => a._id === artist._id) || false;

  if (!coverColor || !avatarColor) return <></>;

  return (
    <div className="w-full h-full">
      {/* Ảnh Cover */}

      {!artist.coverImgUrl ? (
        <>
          <AvatarArtist
            mainColor={avatarColor}
            artist={artist}
            imgRef={imgRef}
            monthlyListener={monthlyListener}
          />
        </>
      ) : (
        <CoverArtist
          mainColor={coverColor}
          artist={artist}
          imgRef={imgRef}
          monthlyListener={monthlyListener}
        />
      )}
      {/* Gradient động dựa trên màu ảnh */}
      <div className="relative ">
        <div
          className="w-full h-[179px]"
          style={{
            background: `linear-gradient(to bottom, ${Color(
              artist.coverImgUrl ? coverColor : avatarColor
            ).hex()} 0%, transparent 100%)`,
            opacity: artist.coverImgUrl ? 0.7 : 0.2,
          }}
        ></div>
        <div className="absolute top-0 z-20 w-full ">
          <div className="max-w-[1800px] mx-auto w-full">
            <div className="px-8 py-8">
              <div className="flex items-center ">
                <div className="mr-12">
                  <ButtonPlay size={1.3} />
                </div>
                <div className="mr-10">
                  <ButtonSubscribe
                    icon={true}
                    isSubscribe={isSubscribe}
                    size={1.3}
                    artist={artist}
                  />
                </div>
                <div className="text-white-06 hover:text-white cursor-pointer">
                  <ButtonDotArtist artist={artist} />
                </div>
              </div>
            </div>
            {/*List nhạc của nghệ sĩ*/}
            <div className="py-3 px-6 flex flex-col 4xl:flex-row gap-6">
              <div className="w-[100%] 4xl:w-[60%]">
                <PopularTrack artist={artist} trackForArtist={trackForArtist} />
              </div>

              <ChooseByArtist chooseByArtist={chooseByArtist} />

              {/*Lựa chọn của nghệ sĩ*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainArtist;
