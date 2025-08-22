import {
  HtmlHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Position } from "../context-menu/context-menu.account";
import { HiMenuAlt3 } from "react-icons/hi";
import { TbMenu2 } from "react-icons/tb";
import { MdDone, MdOutlineDone } from "react-icons/md";
import { IArtist } from "@/types/data";
import Link from "next/link";
import { frontendUrl } from "@/api/url";
import { router_artist, router_url_artist } from "@/api/router";
import {
  selectDiscography,
  selectScrollCenter,
  TTypeAlbum,
} from "@/lib/features/scroll-center/scroll-center.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";

export type TypeForm = "shorten" | "normal";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>; // Avatar ref
  artist: IArtist;
}

const DialogAlbumClassification = ({
  isOpen,
  setIsOpen,
  anchorRef,
  artist,
}: IProps) => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const scrollCenter = useAppSelector(selectScrollCenter);
  const discography = useAppSelector(selectDiscography);
  const [top, setTop] = useState<number>(0);
  const [right, setRight] = useState<number>(0);
  const [position, setPosition] = useState<Position>("fixed");
  const displayAlbum = discography.displayAlbum;
  const space = 16;

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    setIsOpen(false);
  };
  const calculatePosition = () => {
    if (anchorRef.current && formRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();

      let calculatedTop = anchorRect.bottom + space;
      let calculatedRight = anchorRect.x;
      let positionType: Position = "fixed";

      console.log(anchorRef.current);

      setTop(calculatedTop);
      setRight(calculatedRight);
      setPosition(positionType);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        handleCloseTab();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        calculatePosition(); // thay vì đóng thì tính lại vị trí
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Tính toán vị trí context menu
  useLayoutEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen]);

  if (!isOpen) return null; // Ẩn menu nếu không mở

  const typeCurrent = discography.albums?.map((item) => item.type);

  return (
    <div
      ref={formRef}
      style={{
        position: position, // Sử dụng `fixed` nếu bị tràn
        left: `${right}px`,
        top: `${top}px`,
      }}
      className="bg-40 p-1 rounded overflow-hidden z-[1000] text-white-08"
    >
      {typeCurrent && typeCurrent?.length > 0 && (
        <Link
          onClick={() => setIsOpen(false)}
          href={`${frontendUrl}${router_artist}${artist._id}${router_url_artist.discographyAll}`}
          className={`p-3 text-sm font-bold hover:bg-hover rounded-xs flex justify-between gap-4 ${
            discography.type === "all" && "text-green-500"
          }`}
        >
          <p> Tất cả</p>
          {discography.type === "all" && <MdOutlineDone size={20} />}
        </Link>
      )}
      {typeCurrent?.includes("album") && (
        <Link
          onClick={() => setIsOpen(false)}
          href={`${frontendUrl}${router_artist}${artist._id}${router_url_artist.discographyAlbum}`}
          className={`p-3 text-sm font-bold hover:bg-hover rounded-xs flex justify-between gap-4 ${
            discography.type === "album" ? "text-green-500" : ""
          }`}
        >
          <p>Album</p>
          {discography.type === "album" && <MdOutlineDone size={20} />}
        </Link>
      )}
      {(typeCurrent?.includes("single") || typeCurrent?.includes("ep")) && (
        <Link
          onClick={() => setIsOpen(false)}
          href={`${frontendUrl}${router_artist}${artist._id}${router_url_artist.discographySingle}`}
          className={`p-3 text-sm font-bold hover:bg-hover rounded-xs flex justify-between gap-4 ${
            discography.type === "single" || discography.type === "ep"
              ? "text-green-500"
              : ""
          }`}
        >
          <p>Đĩa đơn và Đĩa mở rộng (EP)</p>
          {(discography.type === "single" || discography.type === "ep") && (
            <MdOutlineDone size={20} />
          )}
        </Link>
      )}
    </div>
  );
};

export default DialogAlbumClassification;
