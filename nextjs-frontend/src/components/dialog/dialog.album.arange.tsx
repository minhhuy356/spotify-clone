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
import { IoArrowDownOutline } from "react-icons/io5";
import { CgMenuGridO } from "react-icons/cg";
import { IDisplayAlbum } from "@/app/(user)/artist/[slug]/discography/[type]/classify.discography.header.artist";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectDisplayAlbum,
  updateDisplayAlbum,
} from "@/lib/features/scroll-center/scroll-center.slice";

export type TypeForm = "shorten" | "normal";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  // typeForm: TypeForm;
  // setTypeForm: (value: TypeForm) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  displayAlbum: IDisplayAlbum;
  setDisplayAlbum: React.Dispatch<React.SetStateAction<IDisplayAlbum>>;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

const DialogAlbumArrange = ({
  // typeForm,
  // setTypeForm,
  isOpen,
  setIsOpen,
  anchorRef,
}: IProps) => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const space = 16;
  const [top, setTop] = useState<number>(0);
  const [right, setRight] = useState<number>(0);
  const [position, setPosition] = useState<Position>("fixed");
  const dispatch = useAppDispatch();
  const displayAlbum = useAppSelector(selectDisplayAlbum);
  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    setIsOpen(false);
  };

  const doduRef = useRef<number | null>(null);

  const calculatePosition = () => {
    if (anchorRef.current && formRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const formRect = formRef.current.getBoundingClientRect();

      // Nếu đã có giá trị dodu rồi thì không tính lại nữa
      if (doduRef.current === null) {
        doduRef.current = formRect.width - anchorRect.width;
      }

      const calculatedTop = anchorRect.bottom + space;
      const calculatedLeft = anchorRect.left - doduRef.current;

      setTop(calculatedTop);
      setRight(calculatedLeft);
      setPosition("fixed");
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

  const handleUpdateDisplayAlbum = <K extends keyof IDisplayAlbum>(
    key: K,
    value: IDisplayAlbum[K]
  ) => {
    dispatch(updateDisplayAlbum({ [key]: value }));
    handleCloseTab();
  };
  if (!isOpen) return null; // Ẩn menu nếu không mở

  return (
    <div
      ref={formRef}
      style={{
        position: position, // Sử dụng `fixed` nếu bị tràn
        left: `${right}px`,
        top: `${top}px`,
      }}
      className="bg-40 p-1 rounded overflow-hidden z-[1000]"
    >
      <div className="flex flex-col gap-1 min-w-[180px]">
        <div className="flex flex-col gap-0 ">
          <div className="text-[11px] font-bold text-white-06 py-3 px-4">
            Sắp xếp theo
          </div>
          <div className="flex flex-col ">
            {" "}
            <div
              className={`${
                displayAlbum.arange === "day"
                  ? "text-green-500"
                  : "text-white-08"
              } text-[13px] font-bold  py-3 pl-4 pr-2 flex justify-between gap-8 hover:bg-hover rounded-xs cursor-default items-center`}
              onClick={() => handleUpdateDisplayAlbum("arange", "day")}
            >
              <span>Ngày phát hành</span>
              {displayAlbum.arange === "day" && (
                <IoArrowDownOutline size={20} className="text-green-500" />
              )}
            </div>
            <div
              className={`${
                displayAlbum.arange === "name"
                  ? "text-green-500"
                  : "text-white-08"
              } text-[13px] font-bold  py-3 pl-4 pr-2 flex justify-between gap-8 hover:bg-hover rounded-xs cursor-default items-center`}
              onClick={() => handleUpdateDisplayAlbum("arange", "name")}
            >
              <span>Tên</span>{" "}
              {displayAlbum.arange === "name" && (
                <IoArrowDownOutline size={20} className="text-green-500" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <div className="text-[11px] font-bold text-white-06 py-3 px-4">
            {" "}
            Xem dưới dạng
          </div>
          <div className="flex flex-col ">
            {" "}
            <div
              className={`${
                displayAlbum.viewas === "list"
                  ? "text-green-500"
                  : "text-white-08"
              } text-[13px] font-bold  py-3 pl-4 pr-2 flex justify-between gap-8 hover:bg-hover rounded-xs cursor-default items-center`}
              onClick={() => handleUpdateDisplayAlbum("viewas", "list")}
            >
              <div className="flex gap-2">
                <TbMenu2 size={20} /> <span>Danh sách</span>
              </div>
              {displayAlbum.viewas === "list" && (
                <MdOutlineDone size={20} className="text-green-500" />
              )}
            </div>
            <div
              className={`${
                displayAlbum.viewas === "grid"
                  ? "text-green-500"
                  : "text-white-08"
              } text-[13px] font-bold  py-3 pl-4 pr-2 flex justify-between gap-8 hover:bg-hover rounded-xs cursor-default items-center`}
              onClick={() => handleUpdateDisplayAlbum("viewas", "grid")}
            >
              <div className="flex gap-2">
                <CgMenuGridO size={20} /> <span>Lưới</span>
              </div>
              {displayAlbum.viewas === "grid" && (
                <MdOutlineDone size={20} className="text-green-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogAlbumArrange;
