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
import { MdDone } from "react-icons/md";

export type TypeForm = "shorten" | "normal";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  typeForm: TypeForm;
  setTypeForm: (value: TypeForm) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>; // Avatar ref
}

const DialogCollectionFormTrack = ({
  typeForm,
  setTypeForm,
  isOpen,
  setIsOpen,
  anchorRef,
}: IProps) => {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [top, setTop] = useState<number>(0);
  const [right, setRight] = useState<number>(0);
  const [position, setPosition] = useState<Position>("fixed");

  // Handle opening the tab and calculating the position
  const handleCloseTab = () => {
    setIsOpen(false);
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

    window.addEventListener("resize", handleCloseTab);
    window.addEventListener("wheel", handleCloseTab);
    document.addEventListener("mousedown", handleClickOutside); // Lắng nghe sự kiện click

    return () => {
      window.removeEventListener("resize", handleCloseTab);
      window.removeEventListener("wheel", handleCloseTab);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Tính toán vị trí context menu
  useLayoutEffect(() => {
    if (anchorRef.current && formRef.current && isOpen) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuRect = formRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let calculatedTop = anchorRect.bottom + 12;
      let calculatedRight = anchorRect.x;
      let positionType = position;

      const isOverflowingBottom = menuRect.bottom > viewportHeight;
      const isOverflowingRight = menuRect.right > viewportWidth;
      const isOverflowingTop = menuRect.top < 0;
      const isOverflowingLeft = menuRect.left < 0;

      if (
        isOverflowingBottom ||
        isOverflowingRight ||
        isOverflowingTop ||
        isOverflowingLeft
      ) {
        // Chuyển sang vị trí cố định trên màn hình
        calculatedTop = 12; // Gắn sát top màn hình
        calculatedRight = 12; // Gắn sát right màn hình
        positionType = "fixed"; // Chuyển sang fixed để thoát khỏi div cha
      }
      setTop(calculatedTop);
      setRight(calculatedRight);
      setPosition(positionType);
    }
  }, [isOpen]);

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
      <div className="p-3 text-sm font-bold">
        <p>Xem dưới dạng</p>
      </div>
      <div className="flex flex-col">
        <div
          className={`${
            typeForm === "shorten" ? "text-green-500" : "text-white-08"
          } p-2 hover:bg-50 cursor-pointer justify-between  flex gap-2 rounded-xs min-w-[200px]`}
          onClick={() => setTypeForm("shorten")}
        >
          <div className="flex gap-2">
            <HiMenuAlt3 size={25} />
            <p>Rút gọn</p>{" "}
          </div>
          {typeForm === "shorten" && <MdDone size={25} />}
        </div>
        <div
          className={`${
            typeForm === "normal" ? "text-green-500" : "text-white-08"
          } p-2 hover:bg-50 cursor-pointer  flex justify-between  gap-2 rounded-xs min-w-[200px]`}
          onClick={() => setTypeForm("normal")}
        >
          <div className="flex gap-2">
            <TbMenu2 size={25} />
            <p>Danh sách</p>
          </div>
          {typeForm === "normal" && <MdDone size={25} />}
        </div>
      </div>
    </div>
  );
};

export default DialogCollectionFormTrack;
