import { useEffect, useState } from "react";
import { isEqual } from "lodash";
import { AiFillSound } from "react-icons/ai";
import { FaPause, FaPlay } from "react-icons/fa";
import Link from "next/link";
import { backendUrl, disk_artists, frontendUrl } from "@/api/url";
import { selectSession } from "@/lib/features/auth/auth.slice";
import {
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { track_artist_service } from "@/service/track-artist.service";
import { IArtist, ITrack } from "@/types/data";
import { setOpenContextMenuArtist } from "@/lib/features/local/local.slice";
import { ChooseLibraryBy } from "../../left.main";
import { RiPushpinLine } from "react-icons/ri";
import { ILayout } from "@/app/layout";

interface IProps {
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
  artist: IArtist;
}

const ArtistsCard = ({ chooseLibraryBy, artist }: IProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const isPlay = useAppSelector(selectIsPlay);
  const playingSource = useAppSelector(selectPlayingSource);
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const currentTrack = useAppSelector(selectCurrentTrack);

  const rawLayout = localStorage.getItem("layout");
  const layout: ILayout = rawLayout ? JSON.parse(rawLayout) : {};
  const [isLeftClose, setIsLeftClose] = useState<boolean>();
  useEffect(() => {
    if (layout.left.width < 280) {
      setIsLeftClose(true);
    } else {
      setIsLeftClose(false);
    }
  }, [layout]);

  if (!session?.user?.artists?.length) return null; // Kiểm tra tránh lỗi

  const handlePlayArtist = async (artist: IArtist) => {
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
            in: "artist",
            title: artist.stageName,
            before: "artist",
          },
        })
      );
    }
  };

  const handleOpenContextMenuTrack = (
    artist: IArtist,
    event: React.MouseEvent
  ) => {
    if (!artist) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuArtist({
        isOpenContextMenuArtist: true,
        temporaryArtist: artist,
        position,
        inLibrary: true,
      })
    );
  };

  const isArtistPlaying =
    isPlay &&
    playingSource.in === "artist" &&
    currentTrack &&
    currentTrack.releasedBy._id === artist._id;

  const isArtistCurrent =
    currentTrack &&
    playingSource.in === "artist" &&
    currentTrack.releasedBy._id === artist._id;

  if (
    (chooseLibraryBy !== "artist" && chooseLibraryBy !== "all") ||
    session.user.artists.length < 1
  )
    return <></>;

  return (
    <>
      <div
        className="hover:bg-40 rounded cursor-pointer group flex justify-between"
        key={artist._id}
        onContextMenu={(e) => handleOpenContextMenuTrack(artist, e)}
      >
        <div className="flex gap-4 items-center p-2 hover:bg-40 rounded cursor-pointer group">
          <div
            className="relative size-12 rounded "
            onClick={() => handlePlayArtist(artist)}
          >
            <div className="relative size-12 rounded-full overflow-hidden">
              <img
                src={`${backendUrl}${disk_artists.avatar}${artist.avatarImgUrl}`}
                alt=""
                className="size-12 object-cover object-center"
              />{" "}
              <div className="size-12 absolute top-0 bg-transparent group-hover:bg-black-05 "></div>
            </div>
            {isArtistPlaying ? (
              <FaPause className="absolute top-1/2 left-1/2 -translate-1/2 group-hover:block hidden cursor-pointer" />
            ) : (
              <FaPlay className="absolute top-1/2 left-1/2 -translate-1/2 group-hover:block hidden cursor-pointer" />
            )}
          </div>
          {!isLeftClose && (
            <div className="flex-col flex flex-1">
              <Link
                href={`${frontendUrl}artist/${artist._id}`}
                className={`${
                  isArtistCurrent ? "text-green-500" : ""
                } hover:underline`}
              >
                {artist.stageName}
              </Link>{" "}
              <div className="flex gap-1">
                {artist.pinnedAt && (
                  <RiPushpinLine size={20} className="text-green-500" />
                )}
                <span className="text-white-06 text-[0.85rem]">Nghệ sĩ</span>
              </div>
            </div>
          )}
        </div>
        <div
          className={`${
            isArtistPlaying ? "text-green-500 block" : "hidden"
          } flex items-center mr-2`}
        >
          <AiFillSound />
        </div>
      </div>
    </>
  );
};

export default ArtistsCard;
