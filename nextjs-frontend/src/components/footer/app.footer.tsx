import { useRef, useState } from "react";
import AudioPlayer from "../audio/audio.player";
import { useAppSelector } from "@/lib/hook";
import { selectCurrentTrack } from "@/lib/features/tracks/tracks.slice";
import { backendUrl, disk_tracks } from "@/api/url";
import VolumeControl from "./volume";

interface IProps {}

const AppFooter = ({}: IProps) => {
  const currentTrack = useAppSelector(selectCurrentTrack);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(0); // Giá trị từ 0 → 1

  // Khi đang kéo

  const handleChangeVolume = (vol: number) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    localStorage.setItem("volume", vol.toString());
  };

  const handleChangeVolumeEnd = (vol: number) => {
    // Chỉ lưu lại volumeBefore nếu > 0
    if (vol > 0) {
      localStorage.setItem("volumeBefore", vol.toString());
    }
  };

  const handleMuteVolume = () => {
    localStorage.setItem("volume", "0");
    setVolume(0);
  };

  const handleUnMuteVolume = () => {
    const volumeBefore = parseFloat(
      localStorage.getItem("volumeBefore") || "0"
    );
    localStorage.setItem("volume", volumeBefore.toString());
    setVolume(volumeBefore);
  };

  return (
    <div className="w-full bg-black py-4 flex text-white">
      <div
        className={` flex-1
         flex items-center px-4 gap-4`}
      >
        {currentTrack && (
          <img
            src={`${backendUrl}${disk_tracks.images}${currentTrack?.imgUrl}`}
            className="size-14 rounded"
          />
        )}
        <div className={`flex flex-col `}>
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

      <div className={`flex-1 `}>
        <AudioPlayer
          audioPlayerRef={audioRef}
          setVolume={setVolume}
          volume={volume}
        />
      </div>

      <div className={`flex-1 flex justify-end px-4 items-center`}>
        <VolumeControl
          volume={volume}
          onChange={handleChangeVolume}
          onMouseUp={handleChangeVolumeEnd}
          onMuteVolume={handleMuteVolume}
          onUnMuteVolume={handleUnMuteVolume}
        />
      </div>
    </div>
  );
};

export default AppFooter;
