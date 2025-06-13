import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import { useAppDispatch } from "@/lib/hook";
import { ITrack } from "@/types/data";
import { HiDotsHorizontal } from "react-icons/hi";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  track: ITrack;
  size?: number;
}

const ButtonDotTrack = ({ size = 20, track }: IButtonProps) => {
  const dispatch = useAppDispatch();

  const handleOpenContextMenuTrack = (event: React.MouseEvent) => {
    if (!track) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuTrack({
        isOpenContextMenuTrack: true,
        temporaryTrack: track,
        position: position,
        inLibrary: false,
      })
    );
  };
  return (
    <div
      className="cursor-pointer"
      onClick={(e) => handleOpenContextMenuTrack(e)}
    >
      <HiDotsHorizontal size={size} />
    </div>
  );
};

export default ButtonDotTrack;
