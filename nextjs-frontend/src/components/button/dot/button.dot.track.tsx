import { calculatePosition } from "@/helper/context-menu/caculatePosition";
import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import { useAppDispatch } from "@/lib/hook";
import { ITrack } from "@/types/data";
import { useRef } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  track: ITrack;
  size?: number;
  space?: number;
}

const ButtonDotTrack = ({ size = 20, track, space = 0 }: IButtonProps) => {
  const dispatch = useAppDispatch();

  const dotRef = useRef<HTMLDivElement | null>(null);

  const handleOpenContextMenuTrack = (event: React.MouseEvent) => {
    if (!track || !dotRef) return;

    const position = calculatePosition(dotRef, space);

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
      ref={dotRef}
      className="cursor-pointer"
      onClick={(e) => handleOpenContextMenuTrack(e)}
    >
      <HiDotsHorizontal size={size} />
    </div>
  );
};

export default ButtonDotTrack;
