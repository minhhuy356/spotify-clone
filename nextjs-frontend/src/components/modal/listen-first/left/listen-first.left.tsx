import {
  selectIsPending,
  selectListenFirst,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { useAppSelector } from "@/lib/hook";
import { Fragment, HTMLAttributes, useEffect, useState } from "react";
import "./style.css";
import { backendUrl, disk_artists, disk_tracks, frontendUrl } from "@/api/url";
import ButtonSubscribe from "@/components/button/button.subscribe.artist";

import ButtonSubscribeArtist from "@/components/button/button.subscribe.artist";
import { IArtist } from "@/types/data";
import { artist_service } from "@/service/artist.service";
import { useMediaQuery } from "@mui/material";
import Tooltip from "@/components/tooltip/tooltip";
import Link from "next/link";
import ArtistSorter from "@/helper/artist/artist";
import AudioProgressBar from "@/components/modal/listen-first/listen-first.audio.progress-bar";
import ListenFirstLeftTags from "./listen-first.left.tags";
import Skeleton from "@/components/skeleton/skeleton";
import { selectSession } from "@/lib/features/auth/auth.slice";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const LeftListenFirst = ({ index, audioRef }: IProps) => {
  const listenFirst = useAppSelector(selectListenFirst);
  const playingSource = useAppSelector(selectPlayingSource);
  const isPending = useAppSelector(selectIsPending);
  const [prevIndex, setPrevIndex] = useState(index);
  const [isInitial, setIsInitial] = useState(true);
  const [animating, setAnimating] = useState(false);
  const session = useAppSelector(selectSession);
  const [artist, setArtist] = useState<IArtist>();
  const xl = useMediaQuery("(min-width: 1200px)");
  const lg = useMediaQuery("(min-width:992px)");
  const direction = index > prevIndex ? "up" : "down";

  useEffect(() => {}, [audioRef]);

  useEffect(() => {
    if (index !== prevIndex) {
      setIsInitial(false);
      setAnimating(true);
      const timeout = setTimeout(() => {
        setPrevIndex(index);
        setAnimating(false);
      }, 300); // khớp thời gian animation
      return () => clearTimeout(timeout);
    }
  }, [index]);

  const prevTrack = listenFirst.playingAudioListenFirst.allTrack[prevIndex];
  const currentTrack = listenFirst.playingAudioListenFirst.allTrack[index];

  const isSubscribeAritst =
    session?.user.artists.some(
      (item) =>
        item._id ===
        listenFirst.playingAudioListenFirst.allTrack[index].releasedBy._id
    ) || false;

  const fetchArtist = async () => {
    try {
      if (!listenFirst.playingAudioListenFirst.allTrack[index]?.releasedBy._id)
        throw new Error();
      const res = await artist_service.getArtistById(
        listenFirst.playingAudioListenFirst.allTrack[index]?.releasedBy._id
      );
      if (res) {
        setArtist(res);
      }
    } catch (error) {
      throw new Error();
    }
  };

  useEffect(() => {
    fetchArtist();
  }, [session]);

  // Gọi phương thức sortAndGroupArtists để lấy danh sách nghệ sĩ đã sắp xếp và nhóm
  const filteredArtists = ArtistSorter.sortAndGroupArtists(
    listenFirst.playingAudioListenFirst.allTrack[index].artists,
    listenFirst.playingAudioListenFirst.allTrack[index].releasedBy._id
  );

  if (!artist) return <></>;

  return (
    <div className="w-full h-full flex flex-col justify-between ">
      {isPending ? (
        <Skeleton height={"2rem"} width={"50%"} borderRadius={"1rem"} />
      ) : (
        <div className="text-md xl:text-xl font-bold">
          {listenFirst.playingAudioListenFirst.isTag ? "#" : ""}
          {listenFirst.playingAudioListenFirst.title}
        </div>
      )}
      <div className="flex flex-col gap-6 justify-center pl-2 2xl:pl-8 3xl:pl-16 relative ">
        <div className="flex flex-col gap-1">
          {" "}
          {isPending ? (
            <Skeleton height={"2rem"} width={"100%"} borderRadius={"1rem"} />
          ) : (
            <div className="relative min-h-[2lh] flex flex-col justify-end text-2xl xl:text-3xl 2xl:text-5xl font-bold">
              {animating && prevTrack && (
                <div className="absolute bottom-0 left-0 w-full">
                  <Link
                    href={`${frontendUrl}/track/${currentTrack._id}`}
                    key={`prev-${prevTrack._id}`}
                    className={`track-title animate-out-${direction} hover:underline cursor-pointer line-clamp-1`}
                  >
                    {prevTrack.title}
                  </Link>
                </div>
              )}{" "}
              <div className="absolute bottom-0 left-0 max-w-fit">
                <Link
                  href={`${frontendUrl}/track/${currentTrack._id}`}
                  key={`current-${currentTrack._id}`}
                  className={`track-title hover:underline cursor-pointer line-clamp-1 ${
                    isInitial ? "" : animating ? `animate-in-${direction}` : ""
                  }`}
                >
                  {" "}
                  <span title={`${currentTrack.title}`}>
                    {" "}
                    {currentTrack.title}{" "}
                  </span>
                </Link>
              </div>
            </div>
          )}
          {isPending ? (
            <Skeleton height={"1.5rem"} width={"30%"} borderRadius={"1rem"} />
          ) : (
            <div className="text-white-06 ">
              {playingSource.in === "album" ? (
                listenFirst.playingAudioListenFirst.allTrack[index]?.releasedBy
                  .stageName
              ) : (
                <>
                  {filteredArtists.map((item, index) => (
                    <Fragment key={item.artist._id}>
                      <Link
                        href={`${frontendUrl}/artist/${item.artist._id}`}
                        className="hover:underline hover:text-white whitespace-nowrap"
                      >
                        {item.artist.stageName}
                      </Link>
                      {index < filteredArtists.length - 1 && ", "}
                    </Fragment>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {isPending ? (
          <Skeleton height={"2rem"} width={"100%"} borderRadius={"1rem"} />
        ) : (
          <div className="flex gap-4 items-center">
            <img
              src={`${backendUrl}${disk_tracks.images}${listenFirst.playingAudioListenFirst.allTrack[index].imgUrl}`}
              alt=""
              className="rounded size-6 xl:size-14"
            />
            <AudioProgressBar index={index} audioRef={audioRef} />
          </div>
        )}
      </div>

      <div className="text-white flex flex-col gap-2 justify-center">
        {isPending ? (
          <Skeleton height={"2rem"} width={"80%"} borderRadius={"1rem"} />
        ) : (
          <div className="flex gap-1 lg:gap-3 xl:gap-4 ">
            <div className="flex items-center">
              <img
                src={`${backendUrl}${disk_artists.avatar}${listenFirst.playingAudioListenFirst.allTrack[index].releasedBy.avatarImgUrl}`}
                alt=""
                className="rounded-full size-6 xl:size-8"
              />
            </div>

            <div className="flex gap-1 xl:gap-2 xl:w-auto w-10">
              <div className=" items-center text-sm hover:underline cursor-pointer hidden lg:flex">
                {
                  listenFirst.playingAudioListenFirst.allTrack[index].releasedBy
                    .stageName
                }
              </div>
              <div className=" items-center text-sm  cursor-pointer text-white-06 hidden xl:flex text-nowrap">
                • {artist?.countLike}
              </div>
              <div className="xl:w-auto w-4">
                <ButtonSubscribeArtist
                  artist={
                    listenFirst.playingAudioListenFirst.allTrack[index]
                      .releasedBy
                  }
                  isSubscribe={isSubscribeAritst}
                  size={xl ? 1 : lg ? 0.8 : 0.5}
                />
              </div>
            </div>
          </div>
        )}{" "}
        {isPending ? (
          <Skeleton height={"2rem"} width={"40%"} borderRadius={"1rem"} />
        ) : (
          <ListenFirstLeftTags listenFirst={listenFirst} index={index} />
        )}
      </div>
    </div>
  );
};

export default LeftListenFirst;
