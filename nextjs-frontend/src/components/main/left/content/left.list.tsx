import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import ArtistCard from "./card/left.artist.card";
import TracksCard from "./card/left.track.card";
import AlbumsCard from "./card/left.album.card";
import { ChooseLibraryBy } from "../left.main";
import PlaylistCard from "./card/left.playlist.card";
import FolderCard from "./card/left.folder.card";
import ContextMenuTrack from "@/components/context-menu/context-menu.track";
import ContextMenuArtist from "@/components/context-menu/context-menu.artist";
import ContextMenuAlbum from "@/components/context-menu/context-menu.album";
import ContextMenuFolder from "@/components/context-menu/context-menu.folder";
import ContextMenuPlaylist from "@/components/context-menu/context-menu.playlist";
import ModalDeleteFolder from "@/components/modal/modal.custom";
import { useEffect, useState } from "react";
import {
  selectTemporaryAlbum,
  selectTemporaryArtist,
  selectTemporaryFolder,
  selectTemporaryPlaylist,
  selectTemporaryTrack,
  setNotification,
} from "@/lib/features/local/local.slice";
import { user_activity_service } from "@/service/user-activity.service";
import ModalCustom from "@/components/modal/modal.custom";
import { IAlbum, IArtist, IFolder, IPlaylist, ITrack } from "@/types/data";
import ModalUpdatePlaylist from "@/components/modal/modal.update.playlist";
import { user_playlist_service } from "@/service/user-playlist.service";
import { useNotification } from "@/components/notification/notification-context";
import IconFavorite from "@/components/icon/icon.favorite";
import CollectionTrackCard from "./card/left.collection-track.card";

interface IProps {
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
}

interface ITrackWithType extends ITrack {
  type: string;
}

interface IArtistWithType extends IArtist {
  type: string;
}

interface IFolderWithType extends IFolder {
  type: string;
}

interface IPlaylistWithType extends IPlaylist {
  type: string;
}
interface IAlbumWithType extends IAlbum {
  type: string;
}

const ListLibrary = ({ chooseLibraryBy, setChooseLibraryBy }: IProps) => {
  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);
  const { setNotification } = useNotification();

  const temporaryFolder = useAppSelector(selectTemporaryFolder);
  const temporaryPlaylist = useAppSelector(selectTemporaryPlaylist);
  const temporaryArtist = useAppSelector(selectTemporaryArtist);
  const temporaryTrack = useAppSelector(selectTemporaryTrack);
  const temporaryAlbum = useAppSelector(selectTemporaryAlbum);

  const [isOpenModalDeleteFolder, setIsOpenModalDeleteFolder] =
    useState<boolean>(false);
  const [isOpenModalDeletePlaylist, setIsOpenModalDeletePlaylist] =
    useState<boolean>(false);
  const [isOpenModalDeleteTrack, setIsOpenModalDeleteTrack] =
    useState<boolean>(false);
  const [isOpenModalDeleteArtist, setIsOpenModalDeleteArtist] =
    useState<boolean>(false);
  const [isOpenModalDeleteAlbum, setIsOpenModalDeleteAlbum] =
    useState<boolean>(false);

  const [isOpenModalUpdatePlaylist, setIsOpenModalUpdatePlaylist] =
    useState<boolean>(false);
  const [isOpenModalUpdateFolder, setIsOpenModalUpdateFolder] =
    useState<boolean>(false);

  const [listLibrary, setListLibrary] = useState<any>([]);

  useEffect(() => {
    if (!session?.user) return;

    const { playlists, tracks, folders, artists, albums } = session.user;

    const newListLibrary = [playlists, tracks, folders, artists, albums]
      .flatMap((item) => {
        if (Array.isArray(item)) {
          return item
            .filter((i) => "addLibraryAt" in i)
            .map((i) => {
              // Tạo một bản sao của đối tượng và thêm thuộc tính 'type'
              let newItem:
                | IArtistWithType
                | IFolderWithType
                | IAlbumWithType
                | IPlaylistWithType;

              // Khởi tạo newItem với giá trị mặc định là bản sao của đối tượng i
              newItem = { ...i } as
                | IArtistWithType
                | IFolderWithType
                | IAlbumWithType
                | IPlaylistWithType;

              // Thêm trường 'type' cho từng loại
              if (item === playlists) {
                newItem.type = "playlist";
              } else if (item === folders) {
                newItem.type = "folder";
              } else if (item === artists) {
                newItem.type = "artist";
              } else if (item === albums) {
                newItem.type = "album";
              }

              return newItem;
            });
        }
        return [];
      })
      .sort((a, b) => {
        // Kiểm tra xem có tồn tại pinnedAt hay không
        if (a.pinnedAt && !b.pinnedAt) return -1; // a được ưu tiên hơn
        if (!a.pinnedAt && b.pinnedAt) return 1; // b được ưu tiên hơn
        if (a.pinnedAt && b.pinnedAt) {
          // Nếu cả hai đều có pinnedAt, sắp xếp theo pinnedAt
          return (
            new Date(b.pinnedAt).getTime() - new Date(a.pinnedAt).getTime()
          );
        }

        // Nếu không có pinnedAt, sắp xếp theo addLibraryAt
        return (
          new Date(b.addLibraryAt).getTime() -
          new Date(a.addLibraryAt).getTime()
        );
      });

    setListLibrary(newListLibrary);
  }, [session?.user]);

  if (!session) return <></>;

  return (
    <div>
      {" "}
      {listLibrary.length > 0 &&
        listLibrary.map((item: any, index: number) => {
          if (item.type === "album") {
            return (
              <AlbumsCard
                key={item._id}
                album={item}
                chooseLibraryBy={chooseLibraryBy}
                setChooseLibraryBy={setChooseLibraryBy}
              />
            );
          }
          if (item.type === "playlist") {
            return (
              <PlaylistCard
                key={item._id}
                playlist={item}
                chooseLibraryBy={chooseLibraryBy}
                setChooseLibraryBy={setChooseLibraryBy}
              />
            );
          }
          if (item.type === "artist") {
            return (
              <ArtistCard
                key={item._id}
                artist={item}
                chooseLibraryBy={chooseLibraryBy}
                setChooseLibraryBy={setChooseLibraryBy}
              />
            );
          }

          if (item.type === "folder") {
            return (
              <FolderCard
                key={item._id}
                folder={item}
                chooseLibraryBy={chooseLibraryBy}
                setChooseLibraryBy={setChooseLibraryBy}
              />
            );
          }
          return null;
        })}
      {/* <TracksCard
        track={temporaryTrack}
        chooseLibraryBy={chooseLibraryBy}
        setChooseLibraryBy={setChooseLibraryBy}
      /> */}
      <CollectionTrackCard
        chooseLibraryBy={chooseLibraryBy}
        setChooseLibraryBy={setChooseLibraryBy}
      />
      <ContextMenuTrack setIsOpenModalDeleteTrack={setIsOpenModalDeleteTrack} />
      <ContextMenuArtist
        setIsOpenModalDeleteArtist={setIsOpenModalDeleteArtist}
      />
      <ContextMenuAlbum setIsOpenModalDeleteAlbum={setIsOpenModalDeleteAlbum} />
      <ContextMenuPlaylist
        setIsOpenModalDeletePlaylist={setIsOpenModalDeletePlaylist}
        setIsOpenModalUpdatePlaylist={setIsOpenModalUpdatePlaylist}
      />
      <ContextMenuFolder
        setIsOpenModalDeleteFolder={setIsOpenModalDeleteFolder}
      />
      <ModalCustom
        isOpen={isOpenModalDeleteFolder}
        setIsOpen={setIsOpenModalDeleteFolder}
        body={
          temporaryFolder && (
            <p>
              Thao tác này sẽ xóa <b>{temporaryFolder.name}</b> ra khỏi{" "}
              <b>thư viện</b>.
            </p>
          )
        }
        header={<span>Xóa khỏi thư viện?</span>}
        textConfirm="Xóa"
        onConfirm={async () => {
          if (temporaryFolder) {
            const newFolders = session.user.folders.filter(
              (item) => item._id !== temporaryFolder?._id
            );
            dispatch(setSessionActivity({ folders: newFolders }));
            const res = await user_activity_service.deleteFolder(
              temporaryFolder?._id,
              session?.access_token
            );
            if (res) {
              setNotification({
                content: `Đã xóa khỏi thư viện`,
                isOpen: true,
              });
            }
          }
        }}
      />
      <ModalCustom
        isOpen={isOpenModalDeletePlaylist}
        setIsOpen={setIsOpenModalDeletePlaylist}
        body={
          temporaryPlaylist && (
            <p>
              Thao tác này sẽ xóa <b>{temporaryPlaylist.name}</b> ra khỏi{" "}
              <b>thư viện</b>.
            </p>
          )
        }
        header={<span>Xóa khỏi thư viện?</span>}
        textConfirm="Xóa"
        onConfirm={async () => {
          if (temporaryPlaylist) {
            const newPlaylists = session.user.playlists.filter(
              (item) => item._id !== temporaryPlaylist._id
            );
            dispatch(setSessionActivity({ playlists: newPlaylists }));

            const res = await user_playlist_service.deletePlaylist(
              temporaryPlaylist._id,
              session?.access_token
            );
            if (res) {
              setNotification({
                content: `Đã xóa khỏi thư viện`,
                isOpen: true,
              });
            }
          }
        }}
      />
      <ModalCustom
        isOpen={isOpenModalDeleteAlbum}
        setIsOpen={setIsOpenModalDeleteAlbum}
        body={
          temporaryAlbum && (
            <p>
              Thao tác này sẽ xóa <b>{temporaryAlbum.name}</b> ra khỏi{" "}
              <b>thư viện</b>.
            </p>
          )
        }
        header={<span>Xóa khỏi thư viện?</span>}
        textConfirm="Xóa"
        onConfirm={async () => {
          if (temporaryAlbum) {
            const newAlbums = session.user.albums.filter(
              (item) => item._id !== temporaryAlbum._id
            );
            dispatch(setSessionActivity({ albums: newAlbums }));
            const res = await user_activity_service.subscribeAlbum(session, {
              albumId: temporaryAlbum._id,
              quantity: -1,
            });
            if (res) {
              setNotification({
                content: `Đã xóa khỏi thư viện`,
                isOpen: true,
              });
            }
          }
        }}
      />
      <ModalCustom
        isOpen={isOpenModalDeleteArtist}
        setIsOpen={setIsOpenModalDeleteArtist}
        body={
          temporaryArtist && (
            <p>
              Thao tác này sẽ xóa <b>{temporaryArtist.stageName}</b> ra khỏi{" "}
              <b>thư viện</b>.
            </p>
          )
        }
        header={<span>Xóa khỏi thư viện?</span>}
        textConfirm="Xóa"
        onConfirm={async () => {
          if (temporaryArtist) {
            const newArtists = session.user.artists.filter(
              (item) => item._id !== temporaryArtist._id
            );
            dispatch(setSessionActivity({ artists: newArtists }));

            const res = await user_activity_service.subscribeArtist(session, {
              artistId: temporaryArtist._id,
              quantity: -1,
            });
            if (res) {
              setNotification({
                content: `Đã xóa khỏi thư viện`,
                isOpen: true,
              });
            }
          }
        }}
      />
      <ModalCustom
        isOpen={isOpenModalDeleteTrack}
        setIsOpen={setIsOpenModalDeleteTrack}
        body={
          temporaryTrack && (
            <p>
              Thao tác này sẽ xóa <b>{temporaryTrack.title}</b> ra khỏi{" "}
              <b>thư viện</b>.
            </p>
          )
        }
        header={<span>Xóa khỏi thư viện?</span>}
        textConfirm="Xóa"
        onConfirm={async () => {
          if (temporaryTrack) {
            const newTracks = session.user.tracks.filter(
              (item) => item._id !== temporaryTrack._id
            );
            dispatch(setSessionActivity({ tracks: newTracks }));
            const res = await user_activity_service.subscribeTrack(session, {
              trackId: temporaryTrack._id,
              quantity: -1,
            });
            if (res) {
              setNotification({
                content: `Đã xóa khỏi thư viện`,
                isOpen: true,
                icon: (
                  <div className="size-10 rounded overflow-hidden">
                    <IconFavorite />
                  </div>
                ),
              });
            }
          }
        }}
      />
      <ModalUpdatePlaylist
        isOpen={isOpenModalUpdatePlaylist}
        setIsOpen={setIsOpenModalUpdatePlaylist}
      />
    </div>
  );
};

export default ListLibrary;
