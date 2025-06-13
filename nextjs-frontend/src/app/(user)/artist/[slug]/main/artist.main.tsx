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

import ButtonPlay from "@/components/button/button.play";
import ButtonSubscribe from "@/components/button/button.subscribe.artist";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { selectSession } from "@/lib/features/auth/auth.slice";

import ButtonDotArtist from "@/components/button/dot/button.dot.artist";
import ArtistTableTrack from "./artist.table.tracks";
import ChooseByArtist from "./artist.choose-by-artist";
import AvatarArtist from "./back-ground.tsx/artist.avatar";
import CoverArtist from "./back-ground.tsx/artist.cover";
import { useMediaQuery } from "@mui/material";
import {
  selectCurrentTrack,
  selectIsPlay,
  selectModalListenFirst,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import ButtonPause from "@/components/button/button.pause";
import ButtonSubscribeArtist from "@/components/button/button.subscribe.artist";

interface IProps {
  artist: IArtist;
  trackForArtist: ITrack[];
  monthlyListener: IMonthlyListener;
  chooseByArtist?: IChooseByArtist;
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
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const isPlay = useAppSelector(selectIsPlay);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const playingSource = useAppSelector(selectPlayingSource);
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

  const isPlayInArtist =
    isPlay &&
    session?.user.artists.some((item) => item._id === currentTrack?._id) &&
    playingSource.in === "artist";

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
          className="w-full [height:clamp(179px,12vw,232px)]"
          style={{
            background: `linear-gradient(to bottom, ${Color(
              artist.coverImgUrl ? coverColor : avatarColor
            ).hex()} 0%, transparent 100%)`,
            opacity: artist.coverImgUrl ? 0.7 : 0.2,
          }}
        ></div>
        <div className="absolute top-0 z-20 w-full ">
          <div className="max-w-[1955px] mx-auto w-full">
            <div className="px-8 py-8">
              <div className="flex items-center ">
                <div className="mr-12 cursor-pointer">
                  {isPlayInArtist ? (
                    <ButtonPause size={isDesktop ? 1.3 : 1.1} />
                  ) : (
                    <ButtonPlay size={isDesktop ? 1.3 : 1.1} />
                  )}
                </div>
                <div className="mr-10 cursor-pointer">
                  <ButtonSubscribeArtist
                    icon={true}
                    isSubscribe={isSubscribe}
                    size={isDesktop ? 1.3 : 1.1}
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
                <ArtistTableTrack
                  artist={artist}
                  trackForArtist={trackForArtist}
                />
              </div>
              {chooseByArtist &&
                chooseByArtist.chooseImgUrl &&
                chooseByArtist.chooseTrack && (
                  <ChooseByArtist chooseByArtist={chooseByArtist} />
                )}

              {/*Lựa chọn của nghệ sĩ*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainArtist;
