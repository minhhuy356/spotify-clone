import ButtonPlay from "@/components/button/button.play";
import ButtonSubscribeCircle from "@/components/button/button.subscribe.circle";
import ButtonDotTrack from "@/components/button/dot/button.dot.track";
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
import { ITrack } from "@/types/data";
import { useMediaQuery } from "@mui/material";
import { HTMLAttributes, useEffect, useRef } from "react";
import { HiMenu, HiOutlineArrowCircleDown } from "react-icons/hi";
import { HiOutlineArrowDownCircle } from "react-icons/hi2";

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
import TrackListenFirst from "./track.listen-first";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  isOpenDialogTypeForm: boolean;
  setIsOpenDialogTypeForm: (value: boolean) => void;
  setTypeForm: (value: TypeForm) => void;
  typeForm: TypeForm;
  track: ITrack;
}

const PageTrackOpenratingArea = ({
  isOpenDialogTypeForm,
  setIsOpenDialogTypeForm,
  setTypeForm,
  typeForm,
  track,
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

  const handleSubscribeTrack = async (isSubscribe: boolean) => {
    if (!session) return;

    if (isSubscribe) {
      const res = await user_activity_service.subscribeTrack(session, {
        trackId: track._id,
        quantity: 1,
      });
      if (res) {
        dispatch(setSessionActivity({ tracks: [...session.user.tracks, res] }));
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
      const res = await user_activity_service.subscribeTrack(session, {
        trackId: track._id,
        quantity: -1,
      });
      if (res) {
        const newTrack = session.user.tracks.filter(
          (item) => item._id !== track._id
        );
        dispatch(setSessionActivity({ tracks: newTrack }));
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

  const isPlayInTrack =
    isPlay && currentTrack?._id === track._id && playingSource.in === "track";

  const isSubscribeTrack =
    session?.user.tracks.some((t) => t._id === track._id) || false;

  const handlePlayPause = (isPlay: boolean) => {
    if (isPlay) {
      dispatch(
        play({
          currentTrack: track,
          waitTrackList: [track],
          inWaitList: false,
          playingSource: {
            _id: track._id,
            before: "track",
            in: "track",
            title: track.title,
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
          {isPlayInTrack && !listenFirst.modalListenFirst.isOpen ? (
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
          {/* <div className="bg-inherit ">
            <TrackListenFirst track={track} />
          </div> */}
          {/* Subscribe Button */}
          <div className="-translate-y-[3px]">
            <ButtonSubscribeCircle
              size={subscribeButtonSize} // nhỏ hơn ở mobile
              isSubscribed={isSubscribeTrack}
              onSubscribe={handleSubscribeTrack}
              onUnsubscribe={handleSubscribeTrack}
            />
          </div>

          {/* Download Icon */}
          <div className="text-white/70 hover:text-white cursor-pointer">
            <HiOutlineArrowDownCircle className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>

          {/* Dot Menu Button */}
          <div className="text-white/60 hover:text-white cursor-pointer">
            <ButtonDotTrack
              className="w-6 h-6 lg:w-8 lg:h-8" // responsive bằng class
              track={track}
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

export default PageTrackOpenratingArea;
