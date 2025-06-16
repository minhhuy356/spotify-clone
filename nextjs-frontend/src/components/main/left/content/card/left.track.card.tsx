import { backendUrl, disk_tracks, frontendUrl } from "@/api/url";
import { order } from "@/contants/artist.type";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { GroupedArtist } from "../../../right/main.right";
import {
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { ITrack } from "@/types/data";
import { FaPause, FaPlay } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import { ChooseLibraryBy } from "../../left.main";
import ArtistSorter from "@/helper/artist/artist";
import { ILayout } from "@/app/layout";

interface IProps {
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
  track: ITrack;
}

const TracksCard = ({ chooseLibraryBy, setChooseLibraryBy, track }: IProps) => {
  const dispatch = useAppDispatch();
  const session = useAppSelector(selectSession);
  const isPlay = useAppSelector(selectIsPlay);
  const playingSource = useAppSelector(selectPlayingSource);
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

  if (!track) return null;

  const handlePlayTrack = () => {
    dispatch(
      play({
        waitTrackList: [track],
        currentTrack: track,

        playingSource: {
          _id: track._id,
          in: "track",
          title: "",
          before: "track",
        },
      })
    );
  };

  const handleOpenContextMenuTrack = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(
      setOpenContextMenuTrack({
        isOpenContextMenuTrack: true,
        temporaryTrack: track,
        position: { x: event.clientX, y: event.clientY },
        inLibrary: true,
      })
    );
  };

  const filteredArtists = ArtistSorter.sortAndGroupArtists(
    track.artists,
    track.releasedBy._id
  );

  const isTrackPlaying =
    isPlay && playingSource.in === "track" && currentTrack?._id === track._id;
  const isTrackCurrent =
    playingSource.in === "track" && currentTrack?._id === track._id;

  if (chooseLibraryBy !== "all" || !session?.user?.tracks?.length) return <></>;

  return (
    <div
      className="hover:bg-40 rounded cursor-pointer group flex justify-between"
      onContextMenu={handleOpenContextMenuTrack}
    >
      <div className="flex gap-4 items-center p-2 hover:bg-40 rounded cursor-pointer">
        <div className="relative size-[48px] rounded" onClick={handlePlayTrack}>
          <div className="relative size-12 overflow-hidden">
            <img
              src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
              alt={track.title}
              className="size-12 rounded "
            />{" "}
            <div className="size-12 absolute top-0 bg-transparent group-hover:*:bg-black-05"></div>
          </div>
          {isTrackPlaying ? (
            <FaPause className="absolute top-1/2 left-1/2 -translate-1/2 group-hover:block hidden cursor-pointer" />
          ) : (
            <FaPlay className="absolute top-1/2 left-1/2 -translate-1/2 group-hover:block hidden cursor-pointer" />
          )}
        </div>
        {!isLeftClose && (
          <div className="flex-col flex flex-1">
            <Link
              href={`${frontendUrl}track/${track._id}`}
              className={`${
                isTrackCurrent ? "text-green-500" : ""
              } hover:underline`}
            >
              {track.title}
            </Link>
            <span className="text-white-06 text-[0.85rem] line-clamp-1">
              Đĩa đơn -{" "}
              {filteredArtists.map((item, index) => (
                <Fragment key={item.artist._id}>
                  <Link
                    href={`${frontendUrl}/artist/${item.artist._id}`}
                    className="hover:underline hover:text-white"
                  >
                    {item.artist.stageName}
                  </Link>
                  {index < filteredArtists.length - 1 && ", "}
                </Fragment>
              ))}
            </span>
          </div>
        )}
      </div>
      <div
        className={`${
          isTrackPlaying ? "text-green-500 block" : "hidden"
        } flex items-center mr-2`}
      >
        <AiFillSound />
      </div>
    </div>
  );
};

export default TracksCard;
