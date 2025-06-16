"use client";
import { useEffect, useState, useRef } from "react";
import { Vibrant } from "node-vibrant/browser";
import Color from "color"; // Import thư viện màu sắc
import {
  IArtist,
  IChooseByArtist,
  IMonthlyListener,
  ITrack,
} from "@/types/data";
import { backendUrl, disk_artists, image_favorite } from "@/api/url";

import ButtonPlay from "@/components/button/button.play";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { HiDotsHorizontal, HiMenu } from "react-icons/hi";

import CollectionCover from "./collection.cover";
import DialogCollectionFormTrack, {
  TypeForm,
} from "@/components/dialog/dialog.collection.form-track";
import CollectionArtistTableTrack from "./collection.table.track";
import { useMediaQuery } from "@mui/material";
import {
  pause,
  play,
  selectCurrentTrack,
  selectIsPlay,
  selectPlayingSource,
} from "@/lib/features/tracks/tracks.slice";
import ButtonPause from "@/components/button/button.pause";
import WebsiteInformation from "@/components/footer/website-information";
import {
  selectScrollCenter,
  setColorAndName,
  setCoverHeight,
} from "@/lib/features/scroll-center/scroll-center.slice";

interface IProps {}

const CollectionTracksPage = ({}: IProps) => {
  const session = useAppSelector(selectSession);
  const dispatch = useAppDispatch();

  const anchorRef = useRef<HTMLImageElement>(null);

  const [isOpenDialogTypeForm, setIsOpenDialogTypeForm] =
    useState<boolean>(false);
  const [typeForm, setTypeForm] = useState<TypeForm>("normal");
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const isPlay = useAppSelector(selectIsPlay);

  const playingSource = useAppSelector(selectPlayingSource);

  const scrollCenter = useAppSelector(selectScrollCenter);

  useEffect(() => {
    dispatch(
      setColorAndName({ color: "rgb(80, 56, 160)", name: "Collection" })
    );
  }, []);
  const coverRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleSetCoverHeight = () => {
      const coverCurrent = coverRef.current;

      if (coverCurrent) {
        const coverHeight = coverCurrent.scrollHeight;

        dispatch(setCoverHeight({ coverHeight: coverHeight - 20 }));
      }
    };

    if (scrollCenter) {
      handleSetCoverHeight(); // Chỉ chạy sau khi có dữ liệu
      window.addEventListener("resize", handleSetCoverHeight);
      return () => window.removeEventListener("resize", handleSetCoverHeight);
    }
  }, [scrollCenter]);

  const handlePlayPause = (isPlay: boolean) => {
    if (isPlay && session) {
      dispatch(
        play({
          currentTrack: session?.user.tracks[0],
          waitTrackList: session?.user.tracks,
          inWaitList: false,
          playingSource: {
            _id: "collection",
            before: "collection",
            in: "collection",
            title: "collection",
          },
        })
      );
    } else {
      dispatch(pause());
    }
  };

  useEffect(() => {
    handlePlayPause(scrollCenter.isPlay);
  }, [scrollCenter.isPlay]);

  if (!scrollCenter.color && !scrollCenter.name) return <></>;

  const isPlayInCollection =
    isPlay &&
    playingSource._id === "collection" &&
    playingSource.in === "collection";

  console.log(isPlayInCollection);

  return (
    <div className="w-full h-full">
      {/* Ảnh Cover */}
      <div ref={coverRef}>
        {" "}
        <CollectionCover />
      </div>
      {/* Gradient động dựa trên màu ảnh */}
      <div className="relative ">
        <div
          className="w-full [height:clamp(179px,12vw,232px)]"
          style={{
            background: `linear-gradient(to bottom, rgb(80, 56, 160) 0%, transparent 100%)`,
            opacity: 0.2,
          }}
        ></div>
        <div className="absolute top-0 z-20 max-w-[1955px] mx-auto w-full p-8 right-0 left-0 flex flex-col gap-10">
          <div className="flex justify-between">
            <div className="flex items-center ">
              <div className="mr-12 cursor-pointer">
                {isPlayInCollection ? (
                  <div onClick={() => handlePlayPause(false)}>
                    <ButtonPause size={isDesktop ? 1.3 : 1.1} />
                  </div>
                ) : (
                  <div onClick={() => handlePlayPause(true)}>
                    <ButtonPlay size={isDesktop ? 1.3 : 1.1} />
                  </div>
                )}
              </div>
              {/* <div className="mr-10">
                <ButtonSubscribe
                    icon={true}
                    isSubscribe={isSubscribe}
                    size={isDesktop ? 1.3 : 1.1}
                    artist={artist}
                  />
              </div> */}
              {/* <div className="text-white-06 hover:text-white cursor-pointer">
                <ButtonDotArtist artist={artist} />
              </div> */}
            </div>
            <div
              ref={anchorRef}
              className="flex gap-2 items-center text-white-08 hover:text-white cursor-pointer "
              onClick={() => {
                setIsOpenDialogTypeForm(!isOpenDialogTypeForm);
              }}
            >
              <p className="text-[1.125rem]">Danh sách</p>
              <HiMenu size={25} />
            </div>
          </div>
          {/*List nhạc của nghệ sĩ*/}
          <CollectionArtistTableTrack typeForm={typeForm} />{" "}
          <WebsiteInformation />
        </div>

        <div className="py-3 px-6 flex flex-col 4xl:flex-row gap-6">
          <div className="w-[100%] 4xl:w-[60%]">
            {/* <ArtistTableTrack artist={artist} trackForArtist={trackForArtist} /> */}
          </div>

          {/*Lựa chọn của nghệ sĩ*/}
        </div>
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

export default CollectionTracksPage;
