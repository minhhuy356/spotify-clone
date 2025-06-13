import { sendRequest } from "@/api/api";
import {
  api_track_artists,
  backendUrl,
  disk_tracks,
  frontendUrl,
} from "@/api/url";
import { IAlbum, ITrack } from "@/types/data";
import { HtmlHTMLAttributes, useEffect, useState } from "react";
import ButtonPlay from "../button/button.play";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { useRouter } from "next/navigation";
import {
  selectCurrentTrack,
  selectIsPlay,
} from "@/lib/features/tracks/tracks.slice";
import ButtonPause from "../button/button.pause";
import Link from "next/link";
import "./style.css";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  album: IAlbum;
  maxTrackForAlbum?: number | null;
}

const CardImageAlbum = ({ album, maxTrackForAlbum = null }: IProps) => {
  const [trackByAlbum, setTrackByAlbum] = useState<ITrack[]>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isPlay = useAppSelector(selectIsPlay);
  const currentTrack = useAppSelector(selectCurrentTrack);

  const fetchTrackByAlbum = async () => {
    const res = await sendRequest<IBackendRes<ITrack[]>>({
      url: `${backendUrl}${api_track_artists.album}${album._id}`,
      method: "GET",
    });

    setTrackByAlbum(res.data);
  };

  useEffect(() => {
    fetchTrackByAlbum();
  }, []);

  if (
    typeof maxTrackForAlbum === "number" &&
    trackByAlbum &&
    trackByAlbum.length < maxTrackForAlbum
  ) {
    return null;
  }

  return (
    <div
      key={album._id}
      className="flex-none p-3 rounded-md group relative hover:bg-card-image"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="flex flex-col gap-2 relative z-10">
        <div className="relative">
          <img
            src={`${backendUrl}${disk_tracks.images}${album.imgUrl}`}
            alt={album.name}
            className="w-full h-full object-cover rounded-md"
          />
          <div
            className={`${
              album._id === currentTrack?._id && isPlay ? "hidden " : "block"
            } play absolute bottom-0 right-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bottom-2 z-20`}
          >
            <ButtonPlay size={1} />
          </div>
          <div
            className={`${
              album._id === currentTrack?._id && isPlay
                ? "opacity-100"
                : "opacity-0"
            } absolute bottom-[8px] right-[8px] transition-all duration-300 hover:scale-110 z-20`}
          >
            <ButtonPause />
          </div>
        </div>
        <Link
          href={`${frontendUrl}album/${album._id}`}
          className="text-xl line-clamp-2 font-bold hover:underline"
        >
          {album.name}
        </Link>
        <div className="text-white-06 text-sm">
          {album.releasedBy?.stageName}
        </div>
      </div>
    </div>
  );
};

export default CardImageAlbum;
