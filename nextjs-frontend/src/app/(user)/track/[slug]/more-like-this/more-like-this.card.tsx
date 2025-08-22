"use client";
import { router_track } from "@/api/router";
import { backendUrl, disk_albums, disk_tracks, frontendUrl } from "@/api/url";
import ButtonPause from "@/components/button/button.pause";
import ButtonPlay from "@/components/button/button.play";
import { convertTypeAlbum } from "@/helper/albums/album";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { track_artist_service } from "@/service/track-artist.service";
import { IAlbum, ITrack } from "@/types/data";
import Link from "next/link";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  album: IAlbum;
}

const MoreLikeThisTrackCard = ({ album }: IProps) => {
  const isPlay = useAppSelector(selectIsPlay);

  const playingSource = useAppSelector(selectPlayingSource);
  const dispatch = useAppDispatch();

  const handlePlayPauseAlbum = async (isPlayIn: boolean) => {
    if (!album) return;
    const trackByAlbum = await track_artist_service.fetchTrackForAlbum(
      album._id
    );
    if (trackByAlbum) {
      if (isPlayIn) {
        dispatch(
          play({
            currentTrack: trackByAlbum[0],
            waitTrackList: trackByAlbum,
            inWaitList: false,
            playingSource: {
              _id: album._id,
              before: "album",
              in: "album",
              title: album.name,
            },
          })
        );
      } else {
        dispatch(pause());
      }
    }
  };

  return (
    <div
      key={album._id}
      className="flex flex-col gap-4 p-3 hover:bg-card-image rounded cursor-pointer group"
    >
      <div className="relative">
        <Link href={`${frontendUrl}${router_track}${album._id}`}>
          {" "}
          <img
            src={`${backendUrl}${disk_albums.images}${album.imgUrl}`}
            alt=""
            className="rounded w-full h-auto aspect-square object-cover object-center"
          />
        </Link>

        <div
          className={`${
            album._id === playingSource?._id && isPlay ? "hidden " : "block"
          } absolute bottom-0 right-2 opacity-0  transition-all duration-300 group-hover:opacity-100 group-hover:bottom-2`}
          onClick={() => handlePlayPauseAlbum(true)}
        >
          <ButtonPlay size={1} />
        </div>
        <div
          className={`${
            album._id === playingSource?._id && isPlay ? "block" : "hidden"
          } absolute bottom-[8px] right-[8px] transition-all duration-300 hover:scale-110`}
          onClick={() => handlePlayPauseAlbum(false)}
        >
          <ButtonPause />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{album.name}</h3>
        <div className="text-white-06 text-sm font-bold">
          {new Date(album.createdAt).getFullYear()}
          {` • ${convertTypeAlbum(album.type)}`}
        </div>
      </div>
    </div>
  );
};
export default MoreLikeThisTrackCard;
