"use client";
import { router_album, router_artist } from "@/api/router";
import { backendUrl, disk_albums, frontendUrl } from "@/api/url";
import ButtonPlay from "@/components/button/button.play";
import ButtonSubscribeCircle from "@/components/button/button.subscribe.circle";
import ButtonDotAlbum from "@/components/button/dot/button.dot.album";
import ButtonDotTrack from "@/components/button/dot/button.dot.track";
import Tooltip from "@/components/tooltip/tooltip";
import { convertTypeAlbum } from "@/helper/albums/album";
import { track_artist_service } from "@/service/track-artist.service";
import { IAlbum, IArtist, ITrack } from "@/types/data";

import { useEffect, useRef, useState } from "react";
import { HiOutlineArrowDownCircle } from "react-icons/hi2";
import AllDiscographyTrack from "./classify.discography.track";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectDisplayAlbum,
  selectScrollCenter,
  setColorAndName,
  setDiscography,
  setDiscographyAlbumCurrent,
  setDiscographyType,
  TTypeAlbum,
} from "@/lib/features/scroll-center/scroll-center.slice";
import { selectSession } from "@/lib/features/auth/auth.slice";
import {
  pause,
  play,
  selectIsPlay,
  selectPlayingSource,
  setPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import ButtonPause from "@/components/button/button.pause";
import { notFound, usePathname } from "next/navigation";
import { extractAlbumTypeFromPath } from "@/helper/path-name";
import { hideTooltip, showTooltip } from "@/lib/features/tooltip/tooltip.slice";
import { album_service } from "@/service/album.service";
import Link from "next/link";
import ClassifyDiscographyAlbumList from "./classify.discography.album.list";
import ClassifyDiscographyAlbumGrid from "./classify.discography.album.grid";
import WebsiteInformation from "@/components/footer/website-information";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  artist: IArtist;
}
export const validTypes: TTypeAlbum[] = [
  "album",
  "single",
  "all",
  "discography",
];
const ClassifyDiscographyMain = ({ artist }: IProps) => {
  const [albumsByArtist, setAlbumsByArtist] = useState<IAlbum[] | null>(null);
  const dispatch = useAppDispatch();
  const scrollCenter = useAppSelector(selectScrollCenter);
  const displayAlbum = useAppSelector(selectDisplayAlbum);
  const playingSource = useAppSelector(selectPlayingSource);
  const isPlay = useAppSelector(selectIsPlay);

  const pathName = usePathname(); // ex: "/artist/abc/discography/album"

  let typeSegment = extractAlbumTypeFromPath(pathName);
  const isValidType = validTypes.includes(typeSegment as TTypeAlbum);

  const fetchAlbumByArtist = async () => {
    const type = extractAlbumTypeFromPath(pathName);
    if (type) {
      const res = await track_artist_service.fetchAlbumsByArtist(artist._id, {
        type: decodeType(type),
      });
      if (res) {
        setAlbumsByArtist(res.reverse());
      }
    }
  };

  const decodeType = (type: TTypeAlbum): TTypeAlbum[] => {
    if (type === "album") return ["album"];
    if (type === "all") return ["album", "single", "ep"];
    if (type === "single") return ["single", "ep"];
    return []; // fallback: luôn trả về array
  };

  useEffect(() => {
    fetchAlbumByArtist();
  }, [artist]);

  const sortAlbums = (albums: IAlbum[], type?: string): IAlbum[] => {
    if (!albums) return [];

    switch (type) {
      case "day":
        return [...albums].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "name":
        return [...albums].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...albums]; // fallback nếu undefined hoặc khác
    }
  };

  useEffect(() => {
    if (!albumsByArtist) return;

    const sorted = sortAlbums(albumsByArtist, displayAlbum.arange);
    setAlbumsByArtist(sorted);
  }, [displayAlbum.arange]);

  const albumRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!albumsByArtist) return;

    const container = document.querySelector(
      ".container-center"
    ) as HTMLElement;
    if (!container) return;

    const checkVisibleAlbum = () => {
      let matchedAlbumIndex: number | null = null;

      for (let i = 0; i < albumRefs.current.length; i++) {
        const ref = albumRefs.current[i];

        if (!ref) continue;

        const rect = ref.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Tính vị trí tương đối của album so với container
        const relativeTop = rect.top - 12;
        const relativeBottom = rect.bottom + 32;
        // console.log(scrollCenter.scroll);
        // console.log(`albumref ${i}`, relativeTop);
        // console.log(`albumref ${i}`, relativeBottom);
        // Kiểm tra xem album có nằm trong vùng 104px đầu tiên không
        if (
          scrollCenter.scroll >= relativeTop &&
          scrollCenter.scroll <= relativeBottom
        ) {
          matchedAlbumIndex = i;
          break;
        }
      }

      if (matchedAlbumIndex !== null) {
        dispatch(
          setDiscographyAlbumCurrent({
            albumCurrent: albumsByArtist[matchedAlbumIndex],
          })
        );
      } else {
        dispatch(setDiscographyAlbumCurrent({ albumCurrent: null }));
      }
    };

    container.addEventListener("scroll", checkVisibleAlbum);
    window.addEventListener("resize", checkVisibleAlbum); // zoom or resize

    checkVisibleAlbum(); // initial check

    return () => {
      container.removeEventListener("scroll", checkVisibleAlbum);
      window.removeEventListener("resize", checkVisibleAlbum);
    };
  }, [albumsByArtist]);

  if (!isValidType) {
    notFound();
  }
  useEffect(() => {
    dispatch(
      setDiscography({
        artist: artist,
        albums: albumsByArtist,
      })
    );

    if (!playingSource) {
      dispatch(
        setPlayingSource({
          _id: artist._id,
          before: "artist",
          in: "artist",
          title: artist.stageName,
        })
      );
    }

    dispatch(setColorAndName({ color: "", name: "" }));
  }, [albumsByArtist]);

  useEffect(() => {
    if (isValidType) {
      dispatch(setDiscographyType({ type: typeSegment as TTypeAlbum }));
    }
  }, [pathName]);
  let content = null;

  if (displayAlbum.viewas === "list") {
    content = (
      <div className="flex flex-col gap-8">
        {albumsByArtist?.map((album, index) => (
          <ClassifyDiscographyAlbumList
            key={album._id}
            album={album}
            albumRefs={albumRefs}
            artist={artist}
            index={index}
          />
        ))}
      </div>
    );
  } else if (displayAlbum.viewas === "grid") {
    content = (
      <div
        className="grid overflow-hidden"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        }}
      >
        {albumsByArtist?.map((album, index) => (
          <ClassifyDiscographyAlbumGrid
            key={album._id}
            album={album}
            albumRefs={albumRefs}
            artist={artist}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {content}
      <WebsiteInformation />
    </>
  );
};
export default ClassifyDiscographyMain;
