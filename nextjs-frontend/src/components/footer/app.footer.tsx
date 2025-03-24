import { useRef, useState } from "react";
import AudioPlayer from "../audio/audio.player";
import { useAppSelector } from "@/lib/hook";
import { selectCurrentTrack } from "@/lib/features/tracks/tracks.slice";
import { backendUrl, disk_tracks } from "@/api/url";
import VolumeControl from "./volume";

interface IProps {
  isMobile: boolean;
}

const AppFooter = ({ isMobile }: IProps) => {
  const currentTrack = useAppSelector(selectCurrentTrack);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(0); // Giá trị từ 0 → 1

  const handleChangeVolume = (vol: number) => {
    setVolume(vol); // Cập nhật lại state
    if (audioRef.current) {
      audioRef.current.volume = vol;
      localStorage.setItem("volume", vol.toString());
    }
  };

  return (
    <div className="w-full bg-black py-4 flex text-white">
      <div
        className={`${
          isMobile ? "size-14" : "flex-1"
        } flex items-center px-4 gap-4`}
      >
        {currentTrack && (
          <img
            src={`${backendUrl}${disk_tracks.images}${currentTrack?.imgUrl}`}
            className="size-14 rounded"
          />
        )}
        <div className={`${isMobile ? "block" : "flex flex-col"} `}>
          <span className="font-semibold">{currentTrack?.title}</span>
          <span className="text-white-06">
            {currentTrack?.artists
              .filter(
                (item) =>
                  item.artistTypeDetail.artistTypeGroup.name ===
                  "Nghệ sĩ biểu diễn"
              )
              .map((item) => item.artist.stageName)
              .join(", ")}
          </span>
        </div>
      </div>

      <div className={`${isMobile ? "" : "flex-1"} `}>
        <AudioPlayer
          audioPlayerRef={audioRef}
          setVolume={setVolume}
          volume={volume}
        />
      </div>

      <div
        className={`${
          isMobile ? "" : "flex-1"
        } flex justify-end px-4 items-center`}
      >
        <VolumeControl
          volume={volume}
          onChange={(vol) => handleChangeVolume(vol)}
        />
      </div>
    </div>
  );
};

export default AppFooter;
