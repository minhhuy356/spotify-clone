import ButtonPlay from "@/components/button/button.play";
import ButtonSubscribeCircle from "@/components/button/button.subscribe.circle";
import ButtonDotAlbum from "@/components/button/dot/button.dot.album";
import DialogCollectionFormTrack, {
  TypeForm,
} from "@/components/dialog/dialog.collection.form-track";
import IconFavorite from "@/components/icon/icon.favorite";
import { useNotification } from "@/components/notification/notification-context";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { user_activity_service } from "@/service/user-activity.service";
import { IAlbum, ITrack } from "@/types/data";
import { useMediaQuery } from "@mui/material";
import { HTMLAttributes, useEffect, useRef } from "react";
import { HiMenu, HiOutlineArrowCircleDown } from "react-icons/hi";
import { HiOutlineArrowDownCircle } from "react-icons/hi2";
import AlbumListenFirst from "./album.listen-first";
import ButtonPause from "@/components/button/button.pause";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectListenFirst,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import { selectScrollCenter } from "@/lib/features/scroll-center/scroll-center.slice";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  isOpenDialogTypeForm: boolean;
  setIsOpenDialogTypeForm: (value: boolean) => void;
  setTypeForm: (value: TypeForm) => void;
  typeForm: TypeForm;
  album: IAlbum;
  trackByAlbum: ITrack[];
  coverColor: string;
}

const AlbumOpenratingArea = ({
  isOpenDialogTypeForm,
  setIsOpenDialogTypeForm,
  setTypeForm,
  typeForm,
  album,
  trackByAlbum,
  coverColor,
}: IProps) => {
  const anchorRef = useRef<HTMLImageElement>(null);

  const dispatch = useAppDispatch();
  const { setNotification } = useNotification();
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const isPlay = useAppSelector(selectIsPlay);
  const session = useAppSelector(selectSession);
  const listenFirst = useAppSelector(selectListenFirst);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const playingSource = useAppSelector(selectPlayingSource);
  const subscribeButtonSize = isDesktop ? 29 : 21;

  const handleSubscribeAlbum = async (isSubscribe: boolean) => {
    if (!session) return;

    if (isSubscribe) {
      const res = await user_activity_service.subscribeAlbum(session, {
        albumId: album._id,
        quantity: 1,
      });
      if (res) {
        dispatch(
          setSessionActivity({ albums: [...session.user.albums, album] })
        );
        setNotification({
          content: `Đã thêm vào thư viện`,
          isOpen: true,
          icon: (
            <div className="size-10 rounded overflow-hidden">
              <IconFavorite />
            </div>
          ),
        });
      }
    } else {
      const res = await user_activity_service.subscribeAlbum(session, {
        albumId: album._id,
        quantity: -1,
      });
      if (res) {
        const newAlbum = session.user.albums.filter(
          (item) => item._id !== album._id
        );
        dispatch(setSessionActivity({ albums: newAlbum }));
        setNotification({
          content: `Đã xóa vào thư viện`,
          isOpen: true,
          icon: (
            <div className="size-10 rounded overflow-hidden">
              <IconFavorite />
            </div>
          ),
        });
      }
    }
  };

  if (!session) return <></>;

  const isPlayInAlbum =
    isPlay &&
    session.user.albums.some((item) => item._id === currentTrack?.album._id) &&
    playingSource.in === "album";

  const isSubscribeAlbum =
    session?.user.albums.some((t) => t._id === album._id) || false;

  const handlePlayPause = (isPlay: boolean) => {
    if (isPlay) {
      dispatch(
        play({
          currentTrack: trackByAlbum[0],
          waitTrackList: trackByAlbum,
          inWaitList: false,
          playingSource: {
            _id: album._id,
            before: "album",
            in: "album",
            title: album.name,
          },
        })
      );
    } else {
      dispatch(pause());
    }
  };
  const scrollCenter = useAppSelector(selectScrollCenter);
  useEffect(() => {
    handlePlayPause(scrollCenter.isPlay);
  }, [scrollCenter.isPlay]);

  return (
    <div className="flex justify-between bg-inherit ">
      <div className="flex items-center gap-4 bg-inherit">
        <div className="mr-0 lg:mr-2 cursor-pointer">
          {isPlayInAlbum && !listenFirst.modalListenFirst.isOpen ? (
            <div onClick={() => handlePlayPause(false)}>
              <ButtonPause size={isDesktop ? 1.3 : 1.1} />
            </div>
          ) : (
            <div onClick={() => handlePlayPause(true)}>
              <ButtonPlay size={isDesktop ? 1.3 : 1.1} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap bg-inherit">
          {/* Button Listen first */}
          <div className="bg-inherit ">
            <AlbumListenFirst
              album={album}
              coverColor={coverColor}
              allTrack={trackByAlbum}
            />
          </div>
          {/* Subscribe Button */}
          <div className="-translate-y-[3px]">
            <ButtonSubscribeCircle
              size={subscribeButtonSize} // nhỏ hơn ở mobile
              isSubscribed={isSubscribeAlbum}
              onSubscribe={handleSubscribeAlbum}
              onUnsubscribe={handleSubscribeAlbum}
            />
          </div>

          {/* Download Icon */}
          <div className="text-white/70 hover:text-white cursor-pointer">
            <HiOutlineArrowDownCircle className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>

          {/* Dot Menu Button */}
          <div className="text-white/60 hover:text-white cursor-pointer">
            <ButtonDotAlbum
              className="w-6 h-6 lg:w-8 lg:h-8" // responsive bằng class
              album={album}
            />
          </div>
        </div>
      </div>
      <div
        ref={anchorRef}
        className="flex gap-2 items-center text-white-08 hover:text-white cursor-pointer "
        onClick={() => {
          setIsOpenDialogTypeForm(!isOpenDialogTypeForm);
        }}
      >
        <p className="text-[0.75rem] lg:text-[1rem] ">Danh sách</p>
        <HiMenu className="w-6 h-6 lg:w-8 lg:h-8" />
      </div>{" "}
      {isOpenDialogTypeForm && (
        <DialogCollectionFormTrack
          anchorRef={anchorRef}
          isOpen={isOpenDialogTypeForm}
          setIsOpen={setIsOpenDialogTypeForm}
          setTypeForm={setTypeForm}
          typeForm={typeForm}
        />
      )}
    </div>
  );
};

export default AlbumOpenratingArea;
