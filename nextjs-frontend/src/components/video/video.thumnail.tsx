import { backendUrl, disk_tracks } from "@/api/url";
import { ITrack } from "@/types/data";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import "./style.video.thumnail.css";
import Color from "color";
import Frame from "../frame/frame";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  coverColor: string;
  track: ITrack;
}

const VideoThumbnail = ({ track, coverColor }: IProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbnail, setThumbnail] = useState<string>("");

  useEffect(() => {
    const captureThumbnail = () => {
      const video = videoRef.current;
      if (!video) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        setThumbnail(imageUrl);
      }
    };

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0.1; // tránh bị black frame
      video.addEventListener("loadeddata", captureThumbnail);
    }

    return () => {
      video?.removeEventListener("loadeddata", captureThumbnail);
    };
  }, [track]);

  return (
    <div className="relative w-[38px] h-[48px] grid place-items-center cursor-pointer">
      <div className="absolute inset-0 z-10 ">
        <Frame />
      </div>

      <div className=" group relative">
        {thumbnail ? (
          <img
            src={thumbnail} // ✅ Dùng ảnh vừa tạo từ canvas
            alt="Thumbnail"
            className=" object-cover object-center rounded-[4px] w-[30px] h-[40px] "
          />
        ) : (
          <img
            src={`${backendUrl}${disk_tracks.images}${track.imgUrl}`}
            alt="Thumbnail"
            className=" object-cover object-center rounded-[4px] w-[30px] h-[40px] "
          />
        )}

        {/* <div className="rounded-[4px] w-[30px] h-[40px] absolute inset-0 top-0 bg-black-05 opacity-0 group-hover:opacity-100 transition-all duration-300"></div> */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <FaPlay size={12} className="translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail;
