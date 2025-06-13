import {
  backendUrl,
  disk_tracks,
  frontendUrl,
  url_disk_playlists,
} from "@/api/url";
import { order } from "@/contants/artist.type";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { GroupedArtist } from "../../../right/main.right";
import { track_artist_service } from "@/service/track-artist.service";
import {
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
  selectWaitTrackList,
} from "@/lib/features/tracks/tracks.slice";
import { IPlaylist, ITrack } from "@/types/data";

import {
  setOpenContextMenuPlaylist,
  setOpenContextMenuTrack,
} from "@/lib/features/local/local.slice";
import { ChooseLibraryBy } from "../../left.main";
import { RiMusic2Line, RiPushpinLine } from "react-icons/ri";
import { ILayout } from "@/app/layout";

interface IProps {
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
  playlist: IPlaylist;
}

const PlaylistCard = ({
  chooseLibraryBy,
  setChooseLibraryBy,
  playlist,
}: IProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);

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

  const handleOpenContextMenuPlaylist = (
    playlist: IPlaylist,
    event: React.MouseEvent
  ) => {
    if (!playlist) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuPlaylist({
        isOpenContextMenuPlaylist: true,
        temporaryPlaylist: playlist,
        position,
        inLibrary: true,
      })
    );
  };

  if (
    !session ||
    chooseLibraryBy !== "all" ||
    !session.user.playlists ||
    session.user.playlists.length < 1
  )
    return <></>;

  return (
    <>
      <div
        className="hover:bg-40 rounded cursor-pointer group flex justify-between "
        key={playlist._id}
        onContextMenu={(event) => {
          handleOpenContextMenuPlaylist(playlist, event);
        }}
      >
        <div className="flex gap-4 items-center p-2 hover:bg-40 rounded cursor-pointer ">
          {!playlist.imgUrl ? (
            <div className="size-[48px] p-2 bg-50 rounded flex items-center justify-center text-white-06">
              <RiMusic2Line size={30} />{" "}
            </div>
          ) : (
            <img
              className="size-[48px] rounded"
              src={`${backendUrl}${url_disk_playlists}${playlist.imgUrl}`}
            />
          )}
          {!isLeftClose && (
            <div className=" flex-col flex flex-1 ">
              <span>{playlist.name}</span>
              <div className="text-white-06 text-[0.85rem] flex gap-1">
                {playlist.pinnedAt && (
                  <RiPushpinLine size={20} className="text-green-500" />
                )}

                <span className=" line-clamp-1">
                  Danh sách phát - {session.user.name || session.user.email}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlaylistCard;
