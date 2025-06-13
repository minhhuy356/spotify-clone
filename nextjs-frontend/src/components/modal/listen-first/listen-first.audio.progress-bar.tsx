import { useEffect, useRef, useState } from "react";

interface IProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  index: number;
}

const AudioProgressBar = ({ audioRef, index }: IProps) => {
  const [progress, setProgress] = useState<number>(0);
  const animationRef = useRef<number | null>(null);

  // Update progress function chạy theo frame
  const update = () => {
    const audio = audioRef.current;
    if (audio && audio.duration > 0) {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(percent);
    }
    animationRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Khi đổi bài, reset progress về 0 ngay lập tức
    setProgress(0);

    // Khi play bắt đầu update
    const onPlay = () => {
      animationRef.current = requestAnimationFrame(update);
    };

    // Khi pause hoặc ended thì dừng update
    const onPauseOrEnded = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    audio.addEventListener("canplay", onPlay);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPauseOrEnded);
    audio.addEventListener("ended", onPauseOrEnded);

    // Nếu audio đang phát thì update luôn
    if (!audio.paused && audio.readyState >= 1) {
      animationRef.current = requestAnimationFrame(update);
    }

    return () => {
      audio.removeEventListener("canplay", onPlay);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPauseOrEnded);
      audio.removeEventListener("ended", onPauseOrEnded);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [audioRef, index]);

  return (
    <div className="relative rounded h-[4px] w-full bg-white-02 overflow-hidden">
      <div
        className="absolute top-0 left-0 rounded h-[4px] bg-white-07 transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default AudioProgressBar;
