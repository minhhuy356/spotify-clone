import {
  selectSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  subscribeTrack,
  user_activity_service,
} from "@/service/user-activity.service";
import { ITrack } from "@/types/data";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDone } from "react-icons/md";
import { useNotification } from "../notification/notification-context";
import IconFavorite from "../icon/icon.favorite";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubscribed: boolean;
  onSubscribe: (value: boolean) => void;
  onUnsubscribe: (value: boolean) => void;
  size?: number;
  colorAdd?: string;
}

const ButtonSubscribeCircle = ({
  colorAdd,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  size = 15,
}: IButtonProps) => {
  return (
    <div
      className={`cursor-pointer relative`}
      style={{ width: size + 4, height: size + 4 }}
    >
      <div
        className={`absolute left-0.5 top-0.5 bg-green-base p-[2px] rounded-full text-black 
      ${!isSubscribed ? "scale-0 z-0" : "scale-100 z-100"} 
      transition-transform duration-300 flex justify-center items-center`}
        onClick={() => onUnsubscribe(false)}
        style={{ width: size + 4, height: size + 4 }}
      >
        <MdDone size={size - 4} />
      </div>

      <div
        className={`absolute left-0.5 top-0.5 flex items-center justify-center 
      ${!isSubscribed ? "z-100 scale-100" : "z-0 scale-0"} 
      transition-transform duration-300`}
        onClick={() => onSubscribe(true)}
        style={{ width: size + 5, height: size + 5 }}
      >
        <IoIosAddCircleOutline
          size={size + 20}
          className={`${
            colorAdd ? colorAdd : "text-white-07 hover:text-white"
          }`}
        />
      </div>
    </div>
  );
};

export default ButtonSubscribeCircle;
