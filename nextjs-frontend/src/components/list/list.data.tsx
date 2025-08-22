import CardImageAlbum from "@/components/card/card.image.album";
import { album_service } from "@/service/album.service";
import { IAlbum, IArtist, ITrack, ITrackArtist } from "@/types/data";
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";

import { track_artist_service } from "@/service/track-artist.service";
import CardImageArtist from "../card/card.image.artist";
type IData = IAlbum | IArtist;
type TTypeData = "album" | "artist";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  textMore?: ReactNode;
  tData: TTypeData;
  listDataRelated: IData[];
  textHeader?: string;
  loading?: boolean;
}

function castDataArtist<T>(data: IData) {
  return data as IArtist;
}
function castDataAlbum<T>(data: IData) {
  return data as IAlbum;
}

const ListData = ({
  tData,
  title = "Title",
  textMore = <p>Hiện tất cả</p>,
  listDataRelated,
  textHeader = "",
  loading,
}: IProps) => {
  const [numberOfDisplayCard, setNumberOfDisplayCard] = useState<number>(20);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const resizeCard = () => {
    const container = containerRef.current;

    if (!container || listDataRelated.length === 0) return;

    const firstAlbum = listDataRelated.find(
      (data) => cardRefs.current[data._id]
    );
    if (!firstAlbum) return;

    const cardEl = cardRefs.current[firstAlbum._id];
    if (!cardEl) return;

    const cardWidth = cardEl.clientWidth;
    const containerWidth = container.clientWidth;

    if (cardWidth === 0) return;

    const count = Math.round(containerWidth / cardWidth);
    setNumberOfDisplayCard(count);
    setMaxHeight(cardEl.clientHeight);
  };

  // const fetchListArtistRelated = async () => {
  //   const artist = data as IArtist;
  //   const res = await album_service.fetchAlbumRelated(artist._id);
  //   if (res) setListDataRelated(res);
  // };

  useEffect(() => {
    resizeCard();
  }, [listDataRelated, containerRef]);

  // Dùng ResizeObserver để theo dõi container width thay đổi
  useEffect(() => {
    if (listDataRelated.length === 0 || !containerRef.current) return;

    const observer = new ResizeObserver(() => {
      resizeCard();
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [listDataRelated]); // Chỉ observe sau khi list có dữ liệu

  return (
    <div className="flex flex-col" ref={containerRef}>
      <div className="flex justify-between px-4">
        <div className="flex flex-col">
          {textHeader && <div className="text-white-06">{textHeader}</div>}
          <div className="text-2xl font-bold">{title}</div>
        </div>

        <div>
          <span className="hover:underline text-white-06 font-bold cursor-pointer">
            {textMore}
          </span>
        </div>
      </div>

      <div className="w-full">
        <div
          className="grid whitespace-nowrap overflow-hidden"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            maxHeight: `${maxHeight}px`,
          }}
        >
          {listDataRelated.map((item, index) => (
            <>
              {tData === "album" && (
                <CardImageAlbum
                  album={castDataAlbum(item)}
                  index={index}
                  numberOfDisplayCard={numberOfDisplayCard}
                  ref={(el) => {
                    cardRefs.current[item._id] = el;
                  }}
                />
              )}{" "}
              {tData === "artist" && (
                <CardImageArtist
                  artist={castDataArtist(item)}
                  index={index}
                  numberOfDisplayCard={numberOfDisplayCard}
                  ref={(el) => {
                    cardRefs.current[item._id] = el;
                  }}
                />
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListData;
