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
import IconFavorite from "@/components/icon/icon.favorite";
import { useRouter } from "next/navigation";
import { ILayout } from "@/app/layout";

interface IProps {
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
}

const CollectionTrackCard = ({
  chooseLibraryBy,
  setChooseLibraryBy,
}: IProps) => {
  const dispatch = useAppDispatch();
  const session = useAppSelector(selectSession);
  const router = useRouter();

  const rawLayout = localStorage.getItem("layout");
  const layout: ILayout = rawLayout ? JSON.parse(rawLayout) : {};
  const [isLeftClose, setIsLeftClose] = useState<boolean>();

  const isPlay = useAppSelector(selectIsPlay);
  const playingSource = useAppSelector(selectPlayingSource);

  useEffect(() => {
    if (layout.left.width < 280) {
      setIsLeftClose(true);
    } else {
      setIsLeftClose(false);
    }
  }, [layout]);

  const handleOpenContextMenuTrack = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(
      setOpenContextMenuTrack({
        isOpenContextMenuTrack: true,
        position: { x: event.clientX, y: event.clientY },
        inLibrary: true,
      })
    );
  };

  const navigate = () => {
    router.push(`${frontendUrl}/collection/tracks`);
  };

  const isPlayInCollection =
    isPlay &&
    playingSource._id === "collection" &&
    playingSource.in === "collection";

  if (chooseLibraryBy !== "all" || !session) return <></>;

  return (
    <div
      className="hover:bg-40 rounded cursor-pointer group flex gap-4 items-center justify-between p-2 text-white"
      onContextMenu={handleOpenContextMenuTrack}
      onClick={navigate}
    >
      <div className="flex gap-4">
        <div className="size-[48px] rounded overflow-hidden ">
          <IconFavorite />
        </div>
        {!isLeftClose && (
          <div className=" flex flex-col ">
            <div
              className={`${
                playingSource.in === "collection"
                  ? "text-green-500"
                  : "text-white"
              }`}
            >
              <p>Bài hát đã thích</p>
            </div>{" "}
            <div className="text-white-06 text-sm">
              <p>Danh sách phát • {session.user.tracks.length} bài hát</p>
            </div>
          </div>
        )}
      </div>

      <div
        className={`${
          isPlayInCollection ? "text-green-500 block" : "hidden"
        } flex items-center mr-2`}
      >
        <AiFillSound />
      </div>
    </div>
  );
};

export default CollectionTrackCard;
