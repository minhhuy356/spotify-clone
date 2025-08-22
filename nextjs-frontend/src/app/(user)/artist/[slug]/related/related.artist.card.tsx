"use client";
import { router_artist } from "@/api/router";
import { backendUrl, disk_artists, frontendUrl } from "@/api/url";
import ButtonPause from "@/components/button/button.pause";
import ButtonPlay from "@/components/button/button.play";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { track_artist_service } from "@/service/track-artist.service";
import { IArtist } from "@/types/data";
import Link from "next/link";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  artist: IArtist;
}

const RelatedArtistCard = ({ artist }: IProps) => {
  const isPlay = useAppSelector(selectIsPlay);

  const playingSource = useAppSelector(selectPlayingSource);
  const dispatch = useAppDispatch();

  const handleClickArtist = async (isPlayIn: boolean) => {
    if (!artist._id) return;

    if (isPlayIn) {
      const tracksByArtist = await track_artist_service.getTrackForArtist(
        artist._id
      );

      if (tracksByArtist) {
        dispatch(
          play({
            waitTrackList: tracksByArtist,
            currentTrack:
              tracksByArtist.find((item) => item.order === 1) ||
              tracksByArtist[0],

            playingSource: {
              _id: artist._id,
              in: "artist",
              title: artist.stageName,
              before: "artist",
            },
          })
        );
      }
    } else {
      dispatch(pause());
    }
  };

  return (
    <div
      key={artist._id}
      className="flex flex-col gap-4 p-3 hover:bg-card-image rounded cursor-pointer group"
    >
      <div className="relative">
        <Link href={`${frontendUrl}${router_artist}${artist._id}`}>
          {" "}
          <img
            src={`${backendUrl}${disk_artists.avatar}${artist.avatarImgUrl}`}
            alt=""
            className="rounded-full w-full h-auto aspect-square object-cover object-center"
          />
        </Link>

        <div
          className={`${
            artist._id === playingSource?._id && isPlay ? "hidden " : "block"
          } absolute bottom-0 right-2 opacity-0  transition-all duration-300 group-hover:opacity-100 group-hover:bottom-2`}
          onClick={() => handleClickArtist(true)}
        >
          <ButtonPlay size={1} />
        </div>
        <div
          className={`${
            artist._id === playingSource?._id && isPlay ? "block" : "hidden"
          } absolute bottom-[8px] right-[8px] transition-all duration-300 hover:scale-110`}
          onClick={() => handleClickArtist(false)}
        >
          <ButtonPause />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{artist.stageName}</h3>
        <p className=" text-white-06">Nghệ sĩ</p>
      </div>
    </div>
  );
};
export default RelatedArtistCard;
