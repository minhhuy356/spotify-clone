import { setOpenContextMenuTrack } from "@/lib/features/local/local.slice";
import { useAppDispatch } from "@/lib/hook";
import { ITrack } from "@/types/data";
import { HiDotsHorizontal } from "react-icons/hi";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  track: ITrack;
}

const ButtonDotTrack = ({ track }: IButtonProps) => {
  const dispatch = useAppDispatch();

  const handleOpenContextMenuTrack = (event: React.MouseEvent) => {
    if (!track) return;
    console.log(track);

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuTrack({
        isOpenContextMenuTrack: true,
        temporaryTrack: track,
        position: position,
      })
    );
  };
  return (
    <div onClick={(e) => handleOpenContextMenuTrack(e)}>
      <HiDotsHorizontal size={20} />
    </div>
  );
};

export default ButtonDotTrack;
