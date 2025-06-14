import CardImageAlbum from "@/components/card/card.image.album";
import { album_service } from "@/service/album.service";
import { IAlbum } from "@/types/data";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  album: IAlbum;
}

const AlbumListAlbum = ({ album }: IProps) => {
  const [listAlbumRelated, setListAlbumRelated] = useState<IAlbum[]>([]);
  const [numberOfDisplayCard, setNumberOfDisplayCard] = useState<number>(20);
  const [layout, setLayout] = useState<string>(
    () => localStorage.getItem("layout") || ""
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchListAlbumRelated = async () => {
    const res = await album_service.fetchAlbumRelated(album.releasedBy._id);
    if (res) setListAlbumRelated(res);
  };

  const resizeCard = () => {
    const container = containerRef.current;
    if (!container || listAlbumRelated.length === 0) return;

    const firstAlbum = listAlbumRelated.find(
      (album) => cardRefs.current[album._id]
    );
    if (!firstAlbum) return;

    const cardEl = cardRefs.current[firstAlbum._id];
    if (!cardEl) return;

    const cardWidth = cardEl.clientWidth;
    const containerWidth = container.clientWidth;

    if (cardWidth === 0) return;

    const count = Math.round(containerWidth / cardWidth);
    console.log(containerWidth);
    console.log(cardWidth);
    console.log(count);
    setNumberOfDisplayCard(count);
  };

  // Fetch data ban đầu
  useEffect(() => {
    fetchListAlbumRelated();
  }, []);

  // Resize khi dữ liệu hoặc layout thay đổi
  useEffect(() => {
    resizeCard();
  }, [listAlbumRelated, layout]);

  // Resize khi window resize
  useEffect(() => {
    window.addEventListener("resize", resizeCard);
    return () => {
      window.removeEventListener("resize", resizeCard);
    };
  }, []);

  // Theo dõi layout trong cùng 1 tab (thủ công)
  useEffect(() => {
    let previousLayout = localStorage.getItem("layout") || "";

    const interval = setInterval(() => {
      const currentLayout = localStorage.getItem("layout") || "";
      if (currentLayout !== previousLayout) {
        previousLayout = currentLayout;
        setLayout(currentLayout); // cập nhật layout → trigger resizeCard thông qua dependency
      }
    }, 300); // check mỗi 300ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-4">
        <div className="text-xl font-bold">
          Album khác của {album.releasedBy.stageName}
        </div>
        <div>
          <span className="hover:underline text-white-06 font-bold cursor-pointer">
            Xem danh sách đĩa nhạc
          </span>
        </div>
      </div>

      <div className="w-full">
        <div
          ref={containerRef}
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          }}
        >
          {listAlbumRelated.map((item, index) => (
            <div
              key={item._id}
              ref={(el) => {
                cardRefs.current[item._id] = el;
              }}
              className={` ${
                index >= numberOfDisplayCard
                  ? "opacity-0 pointer-events-none absolute"
                  : "opacity-100 relative transition-opacity duration-300"
              }`}
            >
              <CardImageAlbum album={item} maxTrackForAlbum={null} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumListAlbum;
