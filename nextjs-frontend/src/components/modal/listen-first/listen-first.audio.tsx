import { backendUrl, disk_tracks } from "@/api/url";
import { selectListenFirst } from "@/lib/features/tracks/tracks.slice";
import { useAppSelector } from "@/lib/hook";
import { HTMLAttributes, useEffect, useRef } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  volume: number;
  setVolume: (value: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AlbumAudioListenFirst = ({ volume, setVolume, audioRef }: IProps) => {
  const listenFirst = useAppSelector(selectListenFirst);

  // Update volume mỗi khi `volume` thay đổi
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume ?? 1;
    }
  }, [volume]);

  // Xử lý play/pause khi trackIndex thay đổi
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (volume === 0) {
      audio.pause();
    } else {
      // Nếu modal mở và volume > 0 thì play
      if (listenFirst.modalListenFirst.isOpen) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Play interrupted:", error);
          });
        }
      }
    }

    // return () => {
    //   // Dừng và reset khi đổi bài hoặc component unmount
    //   if (audio) {
    //     audio.pause();
    //     audio.currentTime = 0;
    //   }
    // };
  }, [
    listenFirst.playingAudioListenFirst.trackIndex,
    listenFirst.modalListenFirst.isOpen,
    volume,
    listenFirst.playingAudioListenFirst.allTrack,
  ]);

  const currentTrack =
    listenFirst.playingAudioListenFirst.allTrack[
      listenFirst.playingAudioListenFirst.trackIndex
    ];

  return (
    <audio
      ref={audioRef}
      loop
      src={`${backendUrl}${disk_tracks.videoListenFirst}${
        currentTrack.videoListenFirstUrl || ""
      }`}
      preload="metadata"
    />
  );
};

export default AlbumAudioListenFirst;
