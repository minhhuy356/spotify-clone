import { AiFillSound } from "react-icons/ai";
import { useState } from "react";
import { TiVolumeDown, TiVolumeMute } from "react-icons/ti";

const VolumeControl = ({
  volume,
  onChange,
  onMouseUp,
  onMuteVolume,
  onUnMuteVolume,
}: {
  volume: number;
  onChange: (value: number) => void;
  onMouseUp: (value: number) => void;
  onMuteVolume: () => void;
  onUnMuteVolume: () => void;
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="flex items-center space-x-2 px-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {volume !== 0 ? (
        <TiVolumeDown
          size={32}
          onClick={() => onMuteVolume()}
          className="cursor-pointer"
        />
      ) : (
        <TiVolumeMute
          size={32}
          onClick={() => onUnMuteVolume()}
          className="cursor-pointer"
        />
      )}

      <input
        type="range"
        min="0"
        max="100"
        value={volume * 100} // Hiển thị giá trị từ 0 → 100
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        onMouseUp={(e) => {
          const val = Number(e.currentTarget.value) / 100;
          // Gọi onChange lại 1 lần để chắc chắn đồng bộ giá trị
          onChange(val);
          if (val > 0) {
            localStorage.setItem("volumeBefore", val.toString());
          }
        }}
        className="w-24 h-1 rounded-lg appearance-none cursor-pointer range-slider"
      />
      <style jsx>{`
        .range-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 5px;
        }

        /* Thanh kéo - không hover */
        .range-slider::-webkit-slider-runnable-track {
          background: linear-gradient(
            to right,
            ${isHovering ? "#1db954" : "#ffffff"} ${volume * 100}%,
            #535353 ${volume * 100}%
          );
          height: 6px;
          border-radius: 5px;
        }

        /* Firefox */
        .range-slider::-moz-range-track {
          background: linear-gradient(
            to right,
            ${isHovering ? "#1db954" : "#ffffff"} ${volume * 100}%,
            #535353 ${volume * 100}%
          );
          height: 6px;
          border-radius: 5px;
        }

        /* Cục kéo (thumb) */
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #ffffff;
          cursor: pointer;

          opacity: ${isHovering ? 1 : 0}; /* Ẩn thumb khi không hover */
          margin-top: -4px;
        }

        .range-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #ffffff;
          cursor: pointer;

          opacity: ${isHovering ? 1 : 0};
        }
      `}</style>
    </div>
  );
};

export default VolumeControl;
