"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Slider, Divider } from "@mui/material";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { BsPauseCircle, BsPlayCircle } from "react-icons/bs";
import { formatTime } from "@/helper/format/formatUtils";
import { ITrack } from "@/types/data";
import {
  change,
  pause,
  play,
  selectCurrentTime,
  selectCurrentTrack,
  selectIsPlay,
  selectListenFirst,
  selectPlayingSource,
  selectWaitTrackList,
  setCurrentTime,
} from "@/lib/features/tracks/tracks.slice";
import { findIndexById } from "@/helper/context-menu/context-menu.track";

import { sendRequest } from "@/api/api";

import { selectIsSeek } from "@/lib/features/seek.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { api_track_artists, api_tracks, backendUrl } from "@/api/url";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { track_service } from "@/service/track.service";
import { track_artist_service } from "@/service/track-artist.service";
import { user_daily_fetch_tracks_service } from "@/service/user-daily-fetched-tracks.service";

interface IAudioPlayerProps {
  audioPlayerRef: any;
  volume: any;
  setVolume: (volume: any) => void;
}

const AudioPlayer: React.FC<IAudioPlayerProps> = ({
  audioPlayerRef,
  volume,
  setVolume,
}) => {
  const [duration, setDuration] = useState(0);

  const session = useAppSelector(selectSession);
  const currentTrack = useAppSelector(selectCurrentTrack);
  const waitTrackList = useAppSelector(selectWaitTrackList);
  const playingSource = useAppSelector(selectPlayingSource);
  const isPlay = useAppSelector(selectIsPlay);
  const currentTime = useAppSelector(selectCurrentTime);
  const listenFirst = useAppSelector(selectListenFirst);
  const seeking = useAppSelector(selectIsSeek);
  const dispatch = useAppDispatch();

  const [timeListened, setTimeListened] = useState(0);

  // Trạng thái để theo dõi việc gọi API
  const hasCalledApiRef = useRef(false); // Tham chiếu để kiểm tra nếu API đã được gọi
  useEffect(() => {
    const audio = audioPlayerRef.current;

    if (audio) {
      const handleTimeUpdate = () => {
        setTimeListened((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime === 5 && !hasCalledApiRef.current) {
            increaseCountView(); // Chỉ gọi API nếu chưa gọi
            hasCalledApiRef.current = true; // Đánh dấu API đã được gọi
            clearInterval(interval); // Dừng interval để không chạy tiếp
          }

          return newTime;
        });
      };

      const interval = setInterval(handleTimeUpdate, 1000); // Chạy mỗi giây

      return () => clearInterval(interval);
    }
  }, [audioPlayerRef, currentTrack]); // Thêm isViewCounted vào dependency

  const increaseCountView = async () => {
    if (currentTrack && session) {
      const resTrack = await track_service.increaseCountView(
        currentTrack._id,
        session?.user._id
      );

      if (resTrack) return resTrack;
    }
  };

  useEffect(() => {
    const audio = audioPlayerRef.current;

    if (audio) {
      if (isPlay && listenFirst.modalListenFirst.isOpen === false) {
        const newVolume = localStorage.getItem("volume");

        if (newVolume) {
          audioPlayerRef.current.volume = parseFloat(newVolume);
          audio.play();
        }
      } else {
        audio.pause();
      }
    }
  }, [waitTrackList, isPlay, listenFirst]);

  // const fetchWaitlistBasedOnGenre = async () => {
  //   if (currentTrack) {
  //     const genres = currentTrack.genres.map((item) => item.name);
  //     const res = await track_artist_service.fetchWaitlistBasedOnGenre(
  //       genres,
  //       "some"
  //     );
  //     if (res) {
  //       const dataFilter = res.filter((item) => item._id !== currentTrack._id);

  //       dispatch(
  //         play({
  //           waitTrackList: [currentTrack, ...dataFilter],
  //           currentTrack: currentTrack,
  //         })
  //       );
  //     }
  //   }
  // };

  // const fetchWaitlistByArtist = async () => {
  //   if (currentTrack) {
  //     const artistId = playingSource._id;
  //     const res = await track_artist_service.getTrackForArtist(
  //       artistId,
  //       "countPlay"
  //     );
  //     console.log(res);
  //     if (res) {
  //       const dataFilter = res.filter((item) => item._id !== currentTrack._id);

  //       dispatch(
  //         play({
  //           waitTrackList: [...waitTrackList, ...dataFilter],
  //           currentTrack: currentTrack,
  //         })
  //       );
  //     }
  //   }
  // };

  const fetchWaitlistBasedOnTrack = async () => {
    if (currentTrack && session) {
      const artistsId = currentTrack.artists.map((item) => item.artist._id);
      const genres = currentTrack.genres.map((item) => item._id);
      const res = await user_daily_fetch_tracks_service.fetchByTrack(
        artistsId,
        genres,
        "track.countPlay",
        "desc",
        4,
        session?.access_token
      );
      if (res) {
        const dataFilter = res.filter((item) => item._id !== currentTrack._id);

        dispatch(
          play({
            waitTrackList: [currentTrack, ...dataFilter],
            currentTrack: currentTrack,
          })
        );
      }
    }
  };

  useEffect(() => {
    const audio = audioPlayerRef.current;

    if (playingSource.in === "album" || playingSource.in === "artist") return;

    if (audio && currentTrack && waitTrackList) {
      const isLastTrack =
        waitTrackList.find((item) => item._id === currentTrack._id) ===
        waitTrackList[waitTrackList.length - 1];

      if (isLastTrack) {
        fetchWaitlistBasedOnTrack();
        return;
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (audio) {
      audio.currentTime = currentTime; // Cập nhật thời gian phát dựa trên Redux
    }
  }, [seeking]);

  const handlePlayPauseMusic = () => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const onTimeUpdate = () => dispatch(setCurrentTime(audio.currentTime));
    audio.addEventListener("timeupdate", onTimeUpdate);

    const clone = [...waitTrackList];
    if (!isPlay && currentTrack) {
      audio
        .play()
        .then(() =>
          dispatch(
            play({
              waitTrackList: clone,
              currentTrack: currentTrack,
            })
          )
        )
        .catch((error: any) => console.error("Playback failed:", error));
    } else {
      audio.pause();
      dispatch(pause());
    }

    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  };

  useEffect(() => {
    const savedVolume = localStorage.getItem("volume");
    if (savedVolume) {
      const volume = parseFloat(savedVolume);
      setVolume(volume);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      dispatch(setCurrentTime(audioPlayerRef.current.currentTime));
    }
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    if (audioPlayerRef.current) {
      const time = Array.isArray(newValue) ? newValue[0] : newValue;
      audioPlayerRef.current.currentTime = time;
      dispatch(setCurrentTime(time));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioPlayerRef.current) {
      setDuration(audioPlayerRef.current.duration);
    }
  };

  const handleTrackEnded = () => {
    if (currentTrack) {
      const indexCurrentTrack = findIndexById(waitTrackList, currentTrack);

      const indexNextTrack = indexCurrentTrack + 1;

      const idNextTrack = waitTrackList[indexNextTrack + 1];

      if (idNextTrack && currentTrack) {
        dispatch(change({ currentTrack: idNextTrack }));
      }
      return;
    }
  };

  const handleNextTrack = () => {
    if (currentTrack) {
      const indexcurrentTrack = findIndexById(waitTrackList, currentTrack);

      const indexNextTrack = indexcurrentTrack + 1;

      const nextTrack = waitTrackList[indexNextTrack];

      if (nextTrack) {
        dispatch(change({ currentTrack: nextTrack }));
      }
      return;
    }
  };

  const handlePreviousTrack = () => {
    if (currentTrack) {
      const indexcurrentTrack = findIndexById(waitTrackList, currentTrack);

      const indexNextTrack = indexcurrentTrack - 1;

      const previousTrack = waitTrackList[indexNextTrack];

      if (previousTrack) {
        dispatch(change({ currentTrack: previousTrack }));
      }
      return;
    }
  };

  return (
    <div className=" min-w-[300px] flex justify-between items-center gap-2">
      <div
        className={` flex flex-col items-center justify-center text-black  w-full transition-all duration-500 `}
      >
        {currentTrack && (
          <audio
            ref={audioPlayerRef}
            src={`${backendUrl}${api_tracks.stream}${
              currentTrack?.audioUrl || ""
            }`}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            preload="metadata"
            onEnded={handleTrackEnded}
          />
        )}

        <div
          className={` flex items-center justify-center mb-1 gap-2 text-white`}
        >
          <MdSkipPrevious
            className="cursor-pointer"
            size={35}
            onClick={handlePreviousTrack}
          />
          {isPlay && listenFirst.modalListenFirst.isOpen === false ? (
            <BsPauseCircle
              className="cursor-pointer"
              size={35}
              onClick={handlePlayPauseMusic}
            />
          ) : (
            <BsPlayCircle
              className="cursor-pointer"
              size={35}
              onClick={handlePlayPauseMusic}
            />
          )}

          <MdSkipNext
            className="cursor-pointer"
            size={35}
            onClick={handleNextTrack}
          />
        </div>
        <div className="text-white w-full gap-2 justify-between items-center flex ">
          <Typography variant="body2">{formatTime(currentTime)}</Typography>
          <Slider
            value={currentTime}
            min={0}
            max={duration}
            step={1}
            onChange={handleSeek}
            sx={{
              width: "100%", // Chiều dài slider
              "& .MuiSlider-thumb": {
                width: 10, // Kích thước nút tròn
                height: 10,
                backgroundColor: "white", // Màu của track
              },
              "& .MuiSlider-track": {
                backgroundColor: "white", // Màu của track
              },
              "& .MuiSlider-rail": {
                backgroundColor: "gray", // Màu của rail (phần chưa chạy)
              },
            }}
          />
          <Typography variant="body2">{formatTime(duration)}</Typography>
        </div>

        {/* Hiển thị slider khi hover vào text */}
      </div>
    </div>
  );
};

export default AudioPlayer;
