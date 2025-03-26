import { setOpenContextMenuArtist } from "@/lib/features/local/local.slice";
import { useAppDispatch } from "@/lib/hook";
import { IArtist } from "@/types/data";
import { HiDotsHorizontal } from "react-icons/hi";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  artist: IArtist;
}

const ButtonDotArtist = ({ artist }: IButtonProps) => {
  const dispatch = useAppDispatch();

  const handleOpenContextMenuArtist = (event: React.MouseEvent) => {
    if (!artist) return;

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    dispatch(
      setOpenContextMenuArtist({
        isOpenContextMenuArtist: true,
        temporaryArtist: artist,
        position: position,
      })
    );
  };
  return (
    <div onClick={(e) => handleOpenContextMenuArtist(e)}>
      <HiDotsHorizontal size={30} />
    </div>
  );
};

export default ButtonDotArtist;
