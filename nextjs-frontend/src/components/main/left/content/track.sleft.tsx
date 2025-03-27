import { backendUrl, disk_tracks, frontendUrl } from "@/api/url";
import { order } from "@/contants/artist.type";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import Link from "next/link";
import { Fragment } from "react";
import { GroupedArtist } from "../../right/main.right";
import { track_artist_service } from "@/service/track-artist.service";
import {
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { ITrack } from "@/types/data";
import { FaPause, FaPlay } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import { ChooseLibraryBy } from "../left.main";
interface IProps {
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
}

const TracksCard = ({ chooseLibraryBy, setChooseLibraryBy }: IProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const isPlay = useAppSelector(selectIsPlay);
  const playingSource = useAppSelector(selectPlayingSource);
  const currentTrack = useAppSelector(selectCurrentTrack);

  if (!session?.user?.tracks?.length) return null; // Kiểm tra tránh lỗi

  const handlePlayTrack = (track: ITrack) => {
    console.log(track);
    dispatch(
      play({
        waitTrackList: [track],
        currentTrack: track,
        isInWaitlist: false,
        playingSource: "track",
      })
    );
  };

  const handleOpenContextMenuTrack = (
    track: ITrack,
    event: React.MouseEvent
  ) => {
    console.log(true);
    if (!track) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuTrack({
        isOpenContextMenuTrack: true,
        temporaryTrack: track,
        position,
      })
    );
  };

  if (chooseLibraryBy !== "all") return <></>;

  return (
    <>
      {session.user.tracks.map((track) => {
        // Sắp xếp nghệ sĩ theo nhóm
        const sortedArtist = [...track.artists].sort((a, b) => {
          const groupA =
            a.artistTypeDetail.artistTypeGroup?.name?.toUpperCase() || "";
          const groupB =
            b.artistTypeDetail.artistTypeGroup?.name?.toUpperCase() || "";
          return (order[groupA] || 0) - (order[groupB] || 0);
        });

        // Gom nhóm nghệ sĩ
        const groupedArtistList = Object.values(
          sortedArtist
            .sort((a, b) => a.artistTypeDetail.order - b.artistTypeDetail.order)
            .reduce((acc, item) => {
              const key = `${item.artist._id}-${item.useStageName}`;
              if (!acc[key]) {
                acc[key] = {
                  artist: item.artist,
                  useStageName: item.useStageName,
                  artistTypeGroup: item.artistTypeDetail.artistTypeGroup,
                  artistTypeDetails: [],
                };
              }
              acc[key].artistTypeDetails.push(item.artistTypeDetail);
              return acc;
            }, {} as Record<string, GroupedArtist>)
        );

        // Lọc những nghệ sĩ có useStageName === true
        const filteredArtists = groupedArtistList.filter(
          (item) => item.useStageName === true
        );

        // Kiểm tra track hiện tại có đang phát hay không
        const isTrackPlaying =
          isPlay &&
          playingSource === "track" &&
          currentTrack?._id === track._id;

        const isTrackCurrent =
          playingSource === "track" && currentTrack?._id === track._id;

        return (
          <div
            className="hover:bg-40 rounded cursor-pointer group flex justify-between"
            key={track._id}
            onContextMenu={(event) => {
              handleOpenContextMenuTrack(track, event);
            }}
          >
            <div className="flex gap-4 items-center p-2 hover:bg-40 rounded cursor-pointer">
              <div
                className="relative size-[48px] rounded"
                onClick={() => handlePlayTrack(track)}
              >
                <img
                  src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
                  alt={track.title}
                  className="size-[48px] rounded"
                />
                {isTrackPlaying ? (
                  <FaPause className="absolute top-1/2 left-1/2 -translate-1/2 group-hover:block hidden cursor-pointer" />
                ) : (
                  <FaPlay className="absolute top-1/2 left-1/2 -translate-1/2 group-hover:block hidden cursor-pointer" />
                )}
              </div>
              <div className=" flex-col hidden lg:flex">
                <Link
                  href={`track/${track._id}`}
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
      })}
    </>
  );
};

export default TracksCard;
