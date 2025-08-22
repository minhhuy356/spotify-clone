import { calculatePosition } from "@/helper/context-menu/caculatePosition";
import { setOpenContextMenuAlbum } from "@/lib/features/local/local.slice";
import { useAppDispatch } from "@/lib/hook";
import { IAlbum } from "@/types/data";
import { useRef } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  album: IAlbum;
  size?: number;
}

const ButtonDotAlbum = ({ album, size = 20 }: IButtonProps) => {
  const dispatch = useAppDispatch();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const handleOpenContextMenuAlbum = (event: React.MouseEvent) => {
    if (!album) return;

    const position = calculatePosition(dotRef);
    dispatch(
      setOpenContextMenuAlbum({
        isOpenContextMenuAlbum: true,
        temporaryAlbum: album,
        position: position,
        inLibrary: false,
      })
    );
  };
  return (
    <div ref={dotRef} onClick={(e) => handleOpenContextMenuAlbum(e)}>
      <HiDotsHorizontal size={size} />
    </div>
  );
};

export default ButtonDotAlbum;
