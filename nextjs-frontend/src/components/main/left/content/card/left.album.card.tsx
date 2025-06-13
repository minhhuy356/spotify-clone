import { useEffect, useState } from "react";
import { isEqual } from "lodash";
import { AiFillSound } from "react-icons/ai";
import { FaPause, FaPlay } from "react-icons/fa";
import Link from "next/link";
import { backendUrl, disk_albums, frontendUrl } from "@/api/url";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { track_artist_service } from "@/service/track-artist.service";
import { IAlbum, ITrack } from "@/types/data";
import { setOpenContextMenuAlbum } from "@/lib/features/local/local.slice";
import { ChooseLibraryBy } from "../../left.main";
import { ILayout } from "@/app/layout";
interface IProps {
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
  album: IAlbum;
}

const AlbumsCard = ({ chooseLibraryBy, album }: IProps) => {
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

  if (!session?.user?.albums?.length) return null;

  const handlePlayAlbum = async (album: IAlbum) => {
    const tracksByAlbum = await track_artist_service.getTrackForAlbum(
      album._id
    );

    if (tracksByAlbum) {
      dispatch(
        play({
          waitTrackList: tracksByAlbum,
          currentTrack:
            tracksByAlbum.find((item) => item.order === 1) || tracksByAlbum[0],

          playingSource: {
            in: "album",
            title: album.name,
            before: "album",
          },
        })
      );
    }
  };
  if (waitTrackList.length > 0) {
  }

  const handleOpenContextMenuAlbum = (
    album: IAlbum,
    event: React.MouseEvent
  ) => {
    if (!album) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuAlbum({
        isOpenContextMenuAlbum: true,
        temporaryAlbum: album,
        position,
        inLibrary: true,
      })
    );
  };

  let isAlbumPlaying = false;
  let isCurrentAlbum = false;
  if (currentTrack?.album === null) {
    isAlbumPlaying = false;
  } else {
    if (currentTrack) {
      isAlbumPlaying =
        isPlay &&
        playingSource.in === "album" &&
        currentTrack.album._id === album._id;
      isCurrentAlbum =
        playingSource.in === "album" && currentTrack.album._id === album._id;
    } else {
      isAlbumPlaying = false;
    }
  }

  if (
    (chooseLibraryBy !== "album" && chooseLibraryBy !== "all") ||
    session.user.albums.length < 1
  )
    return <></>;

  return (
    <>
      <div
        className="hover:bg-40 rounded cursor-pointer group flex justify-between"
        key={album._id}
        onContextMenu={(e) => handleOpenContextMenuAlbum(album, e)}
      >
        <div className="flex gap-4 items-center p-2">
          <div
            className="relative size-[48px] rounded"
            onClick={() => handlePlayAlbum(album)}
          >
            <img
              src={`${backendUrl}${disk_albums.images}${album.imgUrl}`}
              alt={album.name}
              className="size-[48px] rounded "
            />
            {isAlbumPlaying ? (
              <FaPause className="absolute top-1/2 left-1/2 -translate-1/2 group-hover:block hidden cursor-pointer" />
            ) : (
              <FaPlay className="absolute top-1/2 left-1/2 -translate-1/2 group-hover:block hidden cursor-pointer" />
            )}
          </div>
          {!isLeftClose && (
            <div className=" flex-col  flex flex-1">
              <Link
                href={`album/${album._id}`}
                className={`${
                  isCurrentAlbum ? "text-green-500" : ""
                } hover:underline`}
              >
                {album.name}
              </Link>
              <span className="text-white-06 text-[0.85rem] line-clamp-1">
                Album -{" "}
                <Link
                  href={`${frontendUrl}/artist/${album.releasedBy._id}`}
                  className="hover:underline hover:text-white"
                >
                  {album.releasedBy.stageName}
                </Link>
              </span>
            </div>
          )}
        </div>

        <div
          className={`${
            isAlbumPlaying ? "text-green-500 block" : "hidden"
          } flex items-center mr-2`}
        >
          <AiFillSound />
        </div>
      </div>
    </>
  );
};

export default AlbumsCard;
