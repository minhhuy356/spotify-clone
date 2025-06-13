import CardImageAlbum from "@/components/card/card.image.album";
import { album_service } from "@/service/album.service";
import { IAlbum } from "@/types/data";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  album: IAlbum;
}

const AlbumListAblum = ({ album }: IProps) => {
  const [listAlbumRelated, setListAlbumRelated] = useState<IAlbum[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchListAlbumRelated = async () => {
    const res = await album_service.fetchAlbumRelated(album.releasedBy._id);
    if (res) {
      setListAlbumRelated(res);
    }
  };

  useEffect(() => {
    fetchListAlbumRelated();
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
          className="grid "
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          }}
        >
          {listAlbumRelated.map((item) => (
            <CardImageAlbum
              key={item._id}
              album={item}
              maxTrackForAlbum={null}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumListAblum;
