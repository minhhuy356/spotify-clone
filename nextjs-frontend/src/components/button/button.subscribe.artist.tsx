"use client";
import React, { useEffect, useState } from "react";
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

const processSubscribeAritstQueue = async (
  session: any
): Promise<{ quantity: number; artist: IArtist | null }> => {
  if (isProcessingQueue || SubscribeArtistQueue.length === 0)
    return { quantity: 0, artist: null };
  isProcessingQueue = true;
  let totalQuantity = 0;
  let artist: IArtist | null = null;

  while (SubscribeArtistQueue.length > 0) {
    const action = SubscribeArtistQueue.shift();
    if (!action) continue;
    try {
      const res = await sendRequest<IBackendRes<IArtist>>({
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
      totalQuantity += action.quantity; // Accumulate the quantity
      artist = res.data || null; // Assuming the artist is inside the 'artist' property of res.data
    } catch (error) {
      console.error(
        `Error processing like for track ${action.artistId}:`,
        error
      );
    }
  }

  isProcessingQueue = false;
  return { quantity: totalQuantity, artist: artist }; // Return both quantity and artist
};

const ButtonSubscribeArtist: React.FC<IButtonProps> = (props: IButtonProps) => {
  const { isSubscribe, size = 1, icon = false, artist } = props;

  const dispatch = useAppDispatch();

  const session = useAppSelector(selectSession);

  const [showStars, setShowStars] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(isSubscribe);

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

    // const newArtists = isSubscribed
    //   ? session.user.artists.filter((item) => item._id !== artist._id)
    //   : [...session.user.artists, artist];

    SubscribeArtistQueue.push({
      artistId: artist._id,
      quantity: subscribed ? -1 : 1,
    });

    setSubscribed(!subscribed);

    if (!isProcessingQueue) {
      const res = await processSubscribeAritstQueue(session);

      let newArtist;
      if (res.artist) {
        if (res.quantity === 1) {
          newArtist = [...session.user.artists, res.artist]; // Use the spread operator to combine the arrays
        } else {
          newArtist = session.user.artists.filter(
            (item) => item._id !== artist._id
          );
        }
      }

      dispatch(setSessionActivity({ artists: newArtist }));
    }
  };

  useEffect(() => {
    setSubscribed(isSubscribe);
  }, [isSubscribe]);

  return (
    <div
      className="relative cursor-pointer "
      style={{ scale: size }}
      onClick={() => handleSubscribeArtist()}
    >
      {/* Nút button */}
      <div
        className={` h-[2rem] text-xs flex justify-center items-center rounded-full border  ${
          subscribed
            ? `border-green-500 text-green-500 ${
                icon ? "w-[9rem]" : "w-[7rem]"
              } transition-all duration-500`
            : "hover:text-white hover:border-white border-border text-white-06 w-[5rem]"
        }`}
        onClick={handleClick}
      >
        <div className="flex gap-2 items-center relative cursor-pointer ">
          {icon && subscribed && (
            <motion.div
              animate={
                subscribed
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
              className={`${subscribed ? "text-green-500" : ""}`}
            >
              <TbBellRingingFilled size={18} />
            </motion.div>
          )}

          <button
            className={`line-clamp-1 font-semibold cursor-pointer  ${
              !subscribed ? "text-white" : ""
            }`}
          >
            {!subscribed ? "Theo dõi" : "Đang theo dõi"}
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

export default ButtonSubscribeArtist;
