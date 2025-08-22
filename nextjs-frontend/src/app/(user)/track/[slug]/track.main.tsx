"use client";

import { useParams } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import { track_artist_service } from "@/service/track-artist.service";
import { IAlbum, ITrack } from "@/types/data";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { Vibrant } from "node-vibrant/browser";
import { backendUrl, disk_tracks } from "@/api/url";
import {
  selectScrollCenter,
  setColorAndName,
  setCoverHeight,
} from "@/lib/features/scroll-center/scroll-center.slice";
import Color from "color";

import { TypeForm } from "@/components/dialog/dialog.collection.form-track";
import WebsiteInformation from "@/components/footer/website-information";

import PageTrackLyricsArtist from "./track.lyrics-artist";
import PageTrackOpenratingArea from "./track.openrating-area";
import PageTrackCover from "./track.cover";
import PageTrackCard from "./track.card";
import ShowMoreButton from "@/components/button/button.showmore";
import ListData from "@/components/list/list.data";
import { track_service } from "@/service/track.service";
import { album_service } from "@/service/album.service";
import TrackListAlbum from "./track.list.album";
interface IProps {
  track: ITrack;
}
const TrackMain = ({ track }: IProps) => {
  const dispatch = useAppDispatch();

  const [trackRecommentdations, setTrackRecommentdations] =
    useState<ITrack[]>();

  const [isOpenDialogTypeForm, setIsOpenDialogTypeForm] =
    useState<boolean>(false);
  const [typeForm, setTypeForm] = useState<TypeForm>("normal");

  const coverRef = useRef<HTMLImageElement>(null);

  const [trackTrending, setTrackTrending] = useState<ITrack[]>();
  const [expandedTrackTrending, setExpandedTrackTrending] = useState(false);
  const maxTracktrending = 10;
  const minTracktrending = 5;

  useEffect(() => {
    const handleSetCoverHeight = () => {
      const coverCurrent = coverRef.current;

      if (coverCurrent) {
        const coverHeight = coverCurrent.scrollHeight;

        dispatch(setCoverHeight({ coverHeight: coverHeight - 20 }));
      }
    };

    if (track) {
      handleSetCoverHeight(); // Chỉ chạy sau khi có dữ liệu
      window.addEventListener("resize", handleSetCoverHeight);
      return () => window.removeEventListener("resize", handleSetCoverHeight);
    }
  }, [track]);

  useEffect(() => {
    if (!track) return;

    Vibrant.from(`${backendUrl}${disk_tracks.images}${track.imgUrl}`)
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
          const lighterColor = Color(dominantSwatch.hex).lighten(0.3).hex();

          dispatch(
            setColorAndName({
              color: lighterColor,
              name: track?.title,
            })
          );
        } else {
        }
      })
      .catch((error) => console.error("Error extracting color:", error));
  }, [track]);

  const fetchTrackRecommentdations = async () => {
    if (track) {
      const genres = track?.genres.map((item) => item.name);

      if (!genres) return;

      const res = await track_artist_service.fetchTrackByGenre(genres, "every");

      if (res) {
        setTrackRecommentdations(res);
      }
    }
  };

  const fetchTrackyReleasedBy = async () => {
    if (track) {
      const res = await track_service.fetchTrackyReleasedBy(
        track.releasedBy._id,
        { limit: 10 }
      );

      if (res) {
        setTrackTrending(res);
      }
    }
  };

  useEffect(() => {
    fetchTrackRecommentdations();
    fetchTrackyReleasedBy();
  }, [track]);
  const scrollCenter = useAppSelector(selectScrollCenter);

  if (!track || !scrollCenter.color) return <></>;

  return (
    <div>
      <div>
        <PageTrackCover track={track} imgRef={coverRef} />
      </div>
      {/* Gradient động dựa trên màu ảnh */}
      <div className="relative flex flex-col">
        <div
          className="w-full [height:clamp(179px,12vw,232px)]"
          style={{
            background: `linear-gradient(to bottom, ${Color(
              scrollCenter.color
            ).hex()} 0%, transparent 100%)`,
            opacity: 0.2,
          }}
        ></div>
        <div className="absolute top-0 z-20 max-w-[1955px] mx-auto w-full px-1 right-0 left-0 flex flex-col gap-8 bg-inherit">
          {" "}
          <div className="px-5 pt-6">
            <PageTrackOpenratingArea
              isOpenDialogTypeForm={isOpenDialogTypeForm}
              setIsOpenDialogTypeForm={setIsOpenDialogTypeForm}
              setTypeForm={setTypeForm}
              typeForm={typeForm}
              track={track}
            />
          </div>{" "}
          <div className="px-5 ">
            <PageTrackLyricsArtist track={track} />
          </div>{" "}
          <div className="px-5 mt-4 flex flex-col gap-3">
            <div className="flex flex-col font-bold">
              <div className="text-2xl font-bold">Đề xuất</div>
              <div className="text-white-06 text-sm">Dựa trên bài hát này</div>
            </div>
            <div className="flex flex-col">
              {trackRecommentdations?.map((item, index) => {
                return (
                  <PageTrackCard track={item} index={index} type="normal" />
                );
              })}
            </div>
          </div>
          <div className="px-5 mt-2 flex flex-col gap-3">
            <div className="flex flex-col font-bold">
              <div className="text-white-06 text-sm">
                Các bản nhạc thịnh hành của
              </div>
              <div className="text-2xl font-bold">
                {track.releasedBy.stageName}
              </div>
            </div>
            <div className="flex flex-col">
              {trackTrending
                ?.map((item, index) => (
                  <PageTrackCard track={item} index={index} type="index" />
                ))
                .slice(
                  0,
                  expandedTrackTrending ? maxTracktrending : minTracktrending
                )}

              <ShowMoreButton
                isExpanded={expandedTrackTrending}
                onToggle={() => {
                  console.log(expandedTrackTrending);
                  setExpandedTrackTrending((prev) => !prev);
                }}
                totalCount={trackTrending?.length || 0}
                minCount={minTracktrending}
                maxCount={maxTracktrending}
                showCountLabel={true}
                className="flex w-fit px-4 py-2"
              />
            </div>
          </div>{" "}
          <TrackListAlbum track={track} />
          <WebsiteInformation />
        </div>
      </div>
    </div>
  );
};
export default TrackMain;
