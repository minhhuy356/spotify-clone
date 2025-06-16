import {
  selectScrollCenter,
  setIsPlay,
} from "@/lib/features/scroll-center/scroll-center.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { useMediaQuery } from "@mui/material";
import Color from "color";
import { HTMLAttributes, useEffect, useState } from "react";
import ButtonPause from "../button/button.pause";
import ButtonPlay from "../button/button.play";
import {
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectListenFirst,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { usePathname } from "next/navigation";

interface IProps extends HTMLAttributes<HTMLDivElement> {}

const HeaderScroll = ({}: IProps) => {
  const pathname = usePathname();
  const parts = pathname.split("/");
  const secondPart = parts[1];
  const _id = parts[2];
  const scrollCenter = useAppSelector(selectScrollCenter);

  const [opacityHeader, setOpacityHeader] = useState<number>(0);
  const session = useAppSelector(selectSession);
  const listenFirst = useAppSelector(selectListenFirst);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const playingSource = useAppSelector(selectPlayingSource);
  const isPlay = useAppSelector(selectIsPlay);

  const [isPlayHeader, setIsPlayHeader] = useState<boolean>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (scrollCenter) {
      const opacity =
        scrollCenter.scroll === 0
          ? 0
          : scrollCenter.scroll / scrollCenter.coverHeight;
      // console.log(scrollCenter);
      setOpacityHeader(opacity);
    }
  }, [scrollCenter]);

  if (!session) return <></>;

  useEffect(() => {
    if (secondPart === "album") {
      const isPlayInAlbum =
        isPlay &&
        session.user.albums.some((item) => item._id === playingSource._id) &&
        playingSource.in === "album";

      setIsPlayHeader(isPlayInAlbum);
    } else if (secondPart === "artist") {
      const isPlayInArtist =
        isPlay &&
        session?.user.artists.some((item) => item._id === playingSource._id) &&
        playingSource.in === "artist";
      console.log(isPlayInArtist);
      setIsPlayHeader(isPlayInArtist);
    } else if (secondPart === "collection") {
      const isPlayInCollection = isPlay && playingSource.in === "collection";

      setIsPlayHeader(isPlayInCollection);
    } else if (secondPart === "track") {
      const isPlayInTrack =
        isPlay &&
        session?.user.tracks.some((item) => item._id === playingSource._id) &&
        playingSource.in === "track";

      setIsPlayHeader(isPlayInTrack);
    }
  }, [session, isPlay, playingSource, currentTrack, pathname]);

  return (
    <div
      className="h-16 px-4 absolute z-50 top-0 left-0 right-0"
      style={{
        backgroundColor: `${scrollCenter.color}`,
        opacity: opacityHeader,
      }}
    >
      <div
        className={`w-fit h-full flex gap-4 items-center ${
          opacityHeader < 1 ? "opacity-0" : "opacity-100 "
        } transition-all duration-300`}
      >
        <div className="cursor-pointer">
          {isPlayHeader && !listenFirst.modalListenFirst.isOpen ? (
            <div
              onClick={() => {
                dispatch(setIsPlay({ isPlay: false }));
              }}
            >
              <ButtonPause size={1} />
            </div>
          ) : (
            <div
              onClick={() => {
                dispatch(setIsPlay({ isPlay: true }));
              }}
            >
              <ButtonPlay size={1} />
            </div>
          )}{" "}
        </div>
        <div className="text-3xl font-bold">{scrollCenter.name}</div>
      </div>
    </div>
  );
};

export default HeaderScroll;
