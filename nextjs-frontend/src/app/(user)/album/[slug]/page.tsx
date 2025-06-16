"use client";
import { useEffect, useState, useRef, use } from "react";
import { Vibrant } from "node-vibrant/browser";
import Color from "color"; // Import thư viện màu sắc
import {
  IAlbum,
  IArtist,
  IChooseByArtist,
  IMonthlyListener,
  ITrack,
} from "@/types/data";
import {
  backendUrl,
  disk_albums,
  disk_artists,
  image_favorite,
} from "@/api/url";
import { TiTick } from "react-icons/ti";

import ButtonPlay from "@/components/button/button.play";
import ButtonSubscribe from "@/components/button/button.subscribe.artist";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { selectSession } from "@/lib/features/auth/auth.slice";

import { TypeForm } from "@/components/dialog/dialog.collection.form-track";
import AlbumCover from "./album.cover";
import AlbumArtistTableTrack from "./album.table.track";
import { album_service } from "@/service/album.service";
import { useParams } from "next/navigation";
import { track_artist_service } from "@/service/track-artist.service";
import AlbumCopyright from "./album.copyright";
import AlbumOpenratingArea from "./album.operating-area";
import AlbumListAblum from "./album.list-album";
import Divider from "@/components/divider/divider";
import WebsiteInformation from "@/components/footer/website-information";
import {
  setColorAndName,
  setCoverHeight,
  setScrollCenter,
} from "@/lib/features/scroll-center/scroll-center.slice";
import HeaderScroll from "@/components/header/header.scroll";
import {
  selectCurrentTrack,
  selectIsPlay,
  selectListenFirst,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";

interface IProps {}

const AlbumPage = ({}: IProps) => {
  // Ensure params is awaited before destructuring

  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const dispatch = useAppDispatch();
  const imgRef = useRef<HTMLImageElement>(null);

  const [coverColor, setCoverColor] = useState("");
  const [trackByAlbum, setTrackByAlbum] = useState<ITrack[]>();
  const [isOpenDialogTypeForm, setIsOpenDialogTypeForm] =
    useState<boolean>(false);
  const [typeForm, setTypeForm] = useState<TypeForm>("normal");
  const [album, setAlbum] = useState<IAlbum>();

  const coverRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleSetCoverHeight = () => {
      const coverCurrent = coverRef.current;

      if (coverCurrent) {
        const coverHeight = coverCurrent.scrollHeight;

        dispatch(setCoverHeight({ coverHeight: coverHeight - 20 }));
      }
    };

    if (album && coverColor && trackByAlbum) {
      handleSetCoverHeight(); // Chỉ chạy sau khi có dữ liệu
      window.addEventListener("resize", handleSetCoverHeight);
      return () => window.removeEventListener("resize", handleSetCoverHeight);
    }
  }, [album, coverColor, trackByAlbum]);

  const fetchAlbum = async () => {
    if (!slug) return; // tránh lỗi khi chưa có slug
    try {
      const res = await album_service.findById(slug);
      if (res) {
        setAlbum(res);
      }
    } catch (error) {
      console.error("Error fetching album:", error);
    }
  };

  const fetchTrackByAlbum = async () => {
    if (!slug) return; // tránh lỗi khi chưa có slug
    try {
      const res = await track_artist_service.getTrackForAlbum(slug);
      if (res) {
        setTrackByAlbum(res);
      }
    } catch (error) {
      console.error("Error fetching album:", error);
    }
  };

  useEffect(() => {
    fetchAlbum();
    fetchTrackByAlbum();
  }, [slug]);

  useEffect(() => {
    if (!album) return;

    Vibrant.from(`${backendUrl}${disk_albums.images}${album.imgUrl}`)
      .getPalette()
      .then((palette) => {
        if (!palette) return;

        let darkestSwatch = null;
        let minBrightness = 999; // Bắt đầu bằng số lớn

        for (let key in palette) {
          const swatch = palette[key];

          if (swatch) {
            const [r, g, b] = swatch.rgb;
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            if (brightness < minBrightness) {
              darkestSwatch = swatch;
              minBrightness = brightness;
            }
          }
        }

        if (darkestSwatch) {
          // Làm sáng hơn 1 tí
          const lighterColor = Color(darkestSwatch.hex).lighten(0.4).hex();
          setCoverColor(lighterColor);
          dispatch(setColorAndName({ color: lighterColor, name: album.name }));
        }
      })
      .catch((error) => console.error("Error extracting color:", error));
  }, [album]);

  if (!coverColor || !album || !trackByAlbum) return <></>;

  return (
    <div className="w-full h-full relative">
      {" "}
      {/* Ảnh Cover */}
      <div ref={coverRef}>
        <AlbumCover
          imgRef={imgRef}
          album={album}
          mainColor={coverColor}
          trackByAlbum={trackByAlbum}
        />
      </div>
      {/* Gradient động dựa trên màu ảnh */}
      <div className="relative flex flex-col">
        <div
          className="w-full [height:clamp(179px,12vw,232px)]"
          style={{
            background: `linear-gradient(to bottom, ${Color(
              coverColor
            ).hex()} 0%, transparent 100%)`,
            opacity: 0.2,
          }}
        ></div>
        <div className="absolute top-0 z-20 max-w-[1955px] mx-auto w-full px-1 right-0 left-0 flex flex-col gap-10 bg-inherit">
          {" "}
          <div className="px-5 py-6">
            <AlbumOpenratingArea
              coverColor={coverColor}
              isOpenDialogTypeForm={isOpenDialogTypeForm}
              setIsOpenDialogTypeForm={setIsOpenDialogTypeForm}
              setTypeForm={setTypeForm}
              typeForm={typeForm}
              album={album}
              trackByAlbum={trackByAlbum}
            />
          </div>{" "}
          <div className="px-5">
            <AlbumArtistTableTrack
              album={album}
              trackByAlbum={trackByAlbum}
              typeForm={typeForm}
            />
          </div>
          <div className="px-5">
            <AlbumCopyright album={album} />
          </div>
          <div className="my-8">
            <AlbumListAblum album={album} />
          </div>{" "}
          <WebsiteInformation />
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
