import {} from "@/lib/features/local/local.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import Color from "color";
import { ReactNode, useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

import { TiVolumeDown, TiVolumeMute } from "react-icons/ti";
import {
  selectListenFirst,
  selectPlayingSource,
  setListenFirst,
  setListenFirstTrackIndex,
} from "@/lib/features/tracks/tracks.slice";
import Left from "@/components/main/left/left.main";
import LeftListenFirst from "./left/listen-first.left";

import CenterListenFirst from "./center/listen-first.center";
import RightListenFirst from "./right/listen-first.right";
import AlbumAudioListenFirst from "./listen-first.audio";

interface IProps extends React.HtmlHTMLAttributes<HTMLDivElement> {}

const ModalListenFirst = ({ children }: IProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const listenFirst = useAppSelector(selectListenFirst);
  const playingSource = useAppSelector(selectPlayingSource);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [volume, setVolume] = useState<number>(() =>
    parseFloat(localStorage.getItem("volume") || "0")
  );

  useEffect(() => {
    dispatch(setListenFirstTrackIndex(index));
  }, [index]);

  useEffect(() => {
    setIndex(listenFirst.playingAudioListenFirst.trackIndex);
  }, [listenFirst.playingAudioListenFirst.trackIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        dispatch(
          setListenFirst({
            modalListenFirst: {
              isOpen: false,
            },
            playingSource: {
              in: playingSource.before,
              before: playingSource.before,
            },
            playingAudioListenFirst: {
              title: "",
              isPlayListenFirst: false,
              allTrack: [],
              trackIndex: 0,
            },
          })
        );
      }
    };

    if (listenFirst.modalListenFirst.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [listenFirst.modalListenFirst.isOpen]);

  if (!listenFirst.modalListenFirst.isOpen) return <></>;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black-07 bg-opacity-70 min-w-[800px] min-h-[600px] overflow-hidden h-full">
      <div
        ref={modalRef}
        className="relative  max-w-[1680px] aspect-[16/10]  rounded shadow-xl mx-auto border-[1px] border-white-01 overflow-hidden justify-center items-center"
        style={{ width: "min(85%, min(1680px, calc(85vh * (16 / 10))))" }}
      >
        <AlbumAudioListenFirst
          volume={volume}
          setVolume={setVolume}
          audioRef={audioRef}
        />
        <div
          className="absolute inset-0 z-10 "
          style={{
            background: `radial-gradient(circle at right center, ${Color(
              listenFirst.modalListenFirst.color || "#ffffff"
            )
              .darken(0.5)
              .hex()} 0%, rgba(15 15 15) 30%)`,
          }}
        />
        <div className="absolute inset-0 z-100 grid  grid-cols-[4.5fr_4.5fr_1fr] md:grid-rows-1 gap-1 md:gap-2  overflow-hidden">
          {/* Div 1 - cột trái (dưới md) */}
          <div className="col-span-1 row-start-1 md:col-span-1 md:row-start-auto  p-2 md:px-8 md:py-6 text-white ">
            <LeftListenFirst index={index} audioRef={audioRef} />
          </div>
          {/* Div 2 - toàn bộ hàng dưới (dưới md) */}
          <div
            className="col-span-1 row-start-1 md:col-span-1 md:row-start-auto text-white px-2 md:px-8 flex justify-center"
            // onWheel={handleWheel}
          >
            <CenterListenFirst index={index} setIndex={setIndex} />
          </div>
          {/* Div 3 - cột phải (dưới md) */}
          <div className="col-span-1 row-start-1 md:col-span-1 md:row-start-auto py-2 px-2 md:px-8 md:py-6 flex flex-col justify-between text-white">
            <RightListenFirst
              index={index}
              volume={volume}
              setVolume={setVolume}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalListenFirst;
