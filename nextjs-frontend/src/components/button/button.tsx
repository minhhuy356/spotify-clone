import React, { useEffect } from "react";
import { TiTickOutline } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { MdError } from "react-icons/md";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  status: IStatus; // Nhận status từ props
  setStatus: React.Dispatch<React.SetStateAction<IStatus>>; // Nhận hàm setStatus từ props
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

export interface IStatus {
  pending: boolean;
  success: boolean;
  error: boolean;
}
export const initialStatus: IStatus = {
  pending: false,
  success: false,
  error: false,
};

const Button: React.FC<IButtonProps> = ({ title, status, setStatus }) => {
  const [showStars, setShowStars] = React.useState<boolean>(false);

  useEffect(() => {
    handleClick();
  }, [status]);

  const handleClick = () => {
    if (status.success) {
      setShowStars(true);
      setTimeout(() => setShowStars(false), 800);
      setTimeout(() => setStatus(initialStatus), 5000);
    } else if (status.error) {
      console.error("Xử lý lỗi!");
      setTimeout(() => setStatus(initialStatus), 2000);
    }
  };

  return (
    <div className="relative">
      <div
        className={`w-28 h-12 flex justify-center items-center rounded-md border cursor-pointer transition-all duration-500
        ${status.success ? "border-green-500 text-green-500 w-[13rem]" : ""}
        ${status.error ? "border-red-500 text-red-500 w-[13rem]" : ""}
        ${
          !status.success && !status.error
            ? "hover:text-white hover:border-white border-white-06 text-white-06"
            : ""
        }
      `}
      >
        {status.error && (
          <div className="flex gap-1">
            {" "}
            <motion.div
              animate={{
                scale: [1, 1.5, 1], // Phóng to rồi thu nhỏ lại
                rotate: [-10, 10, -8, 8, -5, 5, 0], // Lắc qua lắc lại
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            >
              <MdError size={24} />
            </motion.div>
            <button className="line-clamp-1">Tạo mới thất bại</button>
          </div>
        )}
        {status.success && (
          <div className=" flex gap-1">
            <motion.div
              animate={{
                scale: [1, 1.5, 1], // Phóng to rồi thu nhỏ lại
                rotate: [-10, 10, -8, 8, -5, 5, 0], // Lắc qua lắc lại
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            >
              <TiTickOutline size={24} />
            </motion.div>
            <button className="line-clamp-1">Tạo mới thành công</button>
          </div>
        )}
        {status.pending && <CircularProgress size={20} />}
        {!status.pending && !status.success && !status.error && (
          <button className="line-clamp-1">{title}</button>
        )}

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
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="absolute text-green-500"
                >
                  {index % 2 === 0 ? <CiStar /> : <FaStar />}
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Button;
