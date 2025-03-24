"use client";
import React, { useState } from "react";
import { TbBellRingingFilled } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IArtist, IUserActivity } from "@/types/data";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { sendRequest } from "@/api/api";
import { api_user_activity, backendUrl } from "@/api/url";
import store from "@/lib/store";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubscribe: boolean;
  size?: number;
  icon?: boolean;
  artist: IArtist;
}

const customPositions = [
  { x: -10, y: -10 },
  { x: 20, y: -10 },
  { x: 50, y: -10 },
  { x: 80, y: -10 },
  { x: 70, y: 15 },
  { x: 10, y: 15 },
  { x: 40, y: 15 },
];

const SubscribeArtistQueue: Array<{ artistId: string; quantity: number }> = [];
let isProcessingQueue = false;

const processSubscribeAritstQueue = async (session: any) => {
  if (isProcessingQueue || SubscribeArtistQueue.length === 0) return;
  isProcessingQueue = true;
  while (SubscribeArtistQueue.length > 0) {
    const action = SubscribeArtistQueue.shift();
    if (!action) continue;
    try {
      await sendRequest<IBackendRes<IUserActivity>>({
        url: `${backendUrl}${api_user_activity.artist}`,
        method: "POST",
        body: {
          user: session?.user._id,
          artist: action.artistId,
          quantity: action.quantity,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
    } catch (error) {
      console.error(
        `Error processing like for track ${action.artistId}:`,
        error
      );
    }
  }
  isProcessingQueue = false;
};

const ButtonSubscribe: React.FC<IButtonProps> = (props: IButtonProps) => {
  const { isSubscribe, size = 1, icon = false, artist } = props;

  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);

  const [showStars, setShowStars] = useState<boolean>(false);

  const handleClick = () => {
    if (!isSubscribe) {
      setShowStars(true);

      // Ẩn ngôi sao sau 0.8 giây (thời gian animation)
      setTimeout(() => {
        setShowStars(false);
      }, 800);
    } else {
      setShowStars(false);
    }
  };

  const handleSubscribeArtist = async () => {
    if (!session || !artist) return;

    const isSubscribed = session.user.artists.some((a) => a._id === artist._id);
    const newArtists = isSubscribed
      ? session.user.artists.filter((item) => item._id !== artist._id)
      : [...session.user.artists, artist];

    SubscribeArtistQueue.push({
      artistId: artist._id,
      quantity: isSubscribed ? -1 : 1,
    });

    if (!isProcessingQueue) {
      processSubscribeAritstQueue(session);
    }

    dispatch(
      setSessionActivity({ artists: newArtists, tracks: [], albums: [] })
    );

    // **Lấy lại session mới từ Redux rồi lưu vào localStorage**
    setTimeout(() => {
      const newSession = JSON.stringify(store.getState().auth.session); // 🔹 Lấy lại session mới từ Redux
      console.log(newArtists);
      localStorage.setItem("session", newSession);
    }, 100);
  };

  return (
    <div
      className="relative cursor-pointer "
      style={{ scale: size }}
      onClick={() => handleSubscribeArtist()}
    >
      {/* Nút button */}
      <div
        className={` h-[2.25rem] text-xs flex justify-center items-center rounded-full border  ${
          isSubscribe
            ? `border-green-500 text-green-500 ${
                icon ? "w-[9rem]" : "w-[7rem]"
              } transition-all duration-500`
            : "hover:text-white hover:border-white border-white-06 text-white-06 w-[5rem]"
        }`}
        onClick={handleClick}
      >
        <div className="flex gap-2 items-center relative cursor-pointer ">
          {icon && isSubscribe && (
            <motion.div
              animate={
                isSubscribe
                  ? {
                      scale: [1, 1.5, 1], // Phóng to rồi thu nhỏ lại
                      rotate: [-10, 10, -8, 8, -5, 5, 0], // Lắc qua lắc lại
                    }
                  : {}
              }
              transition={{
                duration: 0.8, // Thời gian animation
                ease: "easeInOut",
              }}
              className={`${isSubscribe ? "text-green-500" : ""}`}
            >
              <TbBellRingingFilled size={18} />
            </motion.div>
          )}

          <button className="line-clamp-1 font-semibold cursor-pointer ">
            {!isSubscribe ? "Theo dõi" : "Đang theo dõi"}
          </button>

          {/* Ngôi sao chỉ xuất hiện khi showStars === true */}
          <AnimatePresence>
            {showStars &&
              customPositions.map((pos, index) => {
                const endX = pos.x * 2;
                const endY = index % 2 === 0 ? pos.y * 2.7 : pos.y * 2.2;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      left: `${endX}px`,
                      top: `${endY}px`,
                      opacity: 1,
                      scale: 1, // Tăng kích thước khi nổ
                      rotate: Math.random() * 360,
                    }}
                    exit={{ opacity: 0, scale: 0 }} // Biến mất dần
                    transition={{
                      duration: 0.5, // Tổng thời gian hiệu ứng
                      ease: "easeOut",
                    }}
                    className={`absolute "text-green-500" 
                     `}
                  >
                    {index % 2 === 0 ? <CiStar /> : <FaStar />}
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ButtonSubscribe;
