"use client";
import { router_artist } from "@/api/router";
import { backendUrl } from "@/api/url";
import ButtonPause from "@/components/button/button.pause";
import ButtonPlay from "@/components/button/button.play";
import DialogAlbumArrange from "@/components/dialog/dialog.album.arange";
import DialogAlbumClassification from "@/components/dialog/dialog.album.classification";
import {
  selectDiscography,
  selectScrollCenter,
  TTypeAlbum,
} from "@/lib/features/scroll-center/scroll-center.slice";
import {
  pause,
  play,
  selectIsPlay,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { track_artist_service } from "@/service/track-artist.service";
import { IAlbum, IArtist } from "@/types/data";
import { useEffect, useRef, useState } from "react";
import { CiMenuBurger, CiMenuFries } from "react-icons/ci";
import { FaCaretDown } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
interface IProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface IDisplayAlbum {
  arange?: "day" | "name";
  viewas?: "grid" | "list";
}
const ClassifyDiscographyHeaderArtist = ({}: IProps) => {
  const scrollCenter = useAppSelector(selectScrollCenter);
  const discography = useAppSelector(selectDiscography);
  const [isOpenDialogAlbumClassification, setIsOpenDialogAlbumClassification] =
    useState<boolean>(false);
  const classifyRef = useRef<HTMLImageElement>(null);

  const [isOpenDialogAlbumArrange, setIsOpenDialogAlbumArrange] =
    useState<boolean>(false);
  const arrangeRef = useRef<HTMLImageElement>(null);
  const [displayAlbum, setDisplayAlbum] = useState<IDisplayAlbum>({
    arange: "day",
    viewas: "list",
  });
  const convertTypeLink = (type: TTypeAlbum) => {
    if (type === "album") return "Album";
    if (type === "all") return "Tất cả";
    if (type === "single") return "Đĩa đơn và Đĩa mở rộng (EP)";
  };

  if (!discography.artist) return <></>;

  return (
    <>
      <div className="px-6 h-[40px] w-full flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold hover:underline cursor-pointer ">
          {discography.artist.stageName}
        </h1>
        <div className="flex gap-4 text-white-06 text-sm pr-4">
          <div
            className="flex gap-[6px] items-center hover:text-white cursor-pointer"
            ref={classifyRef}
            onClick={() => {
              setIsOpenDialogAlbumClassification(
                !isOpenDialogAlbumClassification
              );
            }}
          >
            <p className="line-clamp-1">{convertTypeLink(discography.type)}</p>
            <FaCaretDown size={20} className="-translate-y-[]" />
          </div>
          <div
            className="text-xs flex gap-[6px] items-center hover:text-white cursor-pointer hover:scale-105 duration-100 transition-all relative"
            ref={arrangeRef}
            onClick={() => {
              setIsOpenDialogAlbumArrange(!isOpenDialogAlbumArrange);
            }}
          >
            <p className="line-clamp-1">Ngày phát hành</p>
            <IoMenu size={20} />
          </div>
        </div>
      </div>{" "}
      <DialogAlbumClassification
        artist={discography.artist}
        anchorRef={classifyRef}
        isOpen={isOpenDialogAlbumClassification}
        setIsOpen={setIsOpenDialogAlbumClassification}
      />
      <DialogAlbumArrange
        anchorRef={arrangeRef}
        isOpen={isOpenDialogAlbumArrange}
        setIsOpen={setIsOpenDialogAlbumArrange}
        setDisplayAlbum={setDisplayAlbum}
        displayAlbum={displayAlbum}
      />
    </>
  );
};
export default ClassifyDiscographyHeaderArtist;
