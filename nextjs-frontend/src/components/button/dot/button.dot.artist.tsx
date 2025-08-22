import { calculatePosition } from "@/helper/context-menu/caculatePosition";
import { setOpenContextMenuArtist } from "@/lib/features/local/local.slice";
import { useAppDispatch } from "@/lib/hook";
import { IArtist } from "@/types/data";
import { useRef } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  artist: IArtist;
}

const ButtonDotArtist = ({ artist }: IButtonProps) => {
  const dispatch = useAppDispatch();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const handleOpenContextMenuArtist = (event: React.MouseEvent) => {
    if (!artist) return;

    const position = calculatePosition(dotRef);

    dispatch(
      setOpenContextMenuArtist({
        isOpenContextMenuArtist: true,
        temporaryArtist: artist,
        position: position,
        inLibrary: false,
      })
    );
  };
  return (
    <div ref={dotRef} onClick={(e) => handleOpenContextMenuArtist(e)}>
      <HiDotsHorizontal size={30} />
    </div>
  );
};

export default ButtonDotArtist;
