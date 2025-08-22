import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { logout } from "@/lib/features/auth/auth.thunk";
import { useRouter } from "next/navigation";
interface IProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>; // Avatar ref
}

export type Position = "absolute" | "fixed";

const ContextMenuAccount = ({ isOpen, setIsOpen, anchorRef }: IProps) => {
  const session = useAppSelector(selectSession);
  const route = useRouter();

  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [top, setTop] = useState<number>(0);
  const [right, setRight] = useState<number>(0);
  const [position, setPosition] = useState<Position>("absolute");
  const handleLogout = () => {
    if (session) {
      dispatch(logout({ session: session }));
      localStorage.removeItem("session");
      window.location.reload();
    }
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setPosition("absolute");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const updateMenuPosition = () => {
      if (!isOpen || !anchorRef.current || !menuRef.current) return;

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let calculatedTop = anchorRect.bottom; // Mặc định: Dưới avatar
      let calculatedRight = 0; // Mặc định: Bên phải avatar
      let positionType: Position = "absolute"; // Mặc định là absolute

      // Kiểm tra nếu menu đang bị tràn khỏi màn hình
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
        // Nếu menu bị tràn, chuyển sang vị trí cố định
        calculatedTop = 12; // Cố định top màn hình
        calculatedRight = 12; // Cố định right màn hình
        positionType = "fixed";
      }

      setTop(calculatedTop);
      setRight(calculatedRight);
      setPosition(positionType);
    };

    // Gọi ngay lập tức để tính toán vị trí ban đầu
    updateMenuPosition();

    // Lắng nghe sự kiện resize
    window.addEventListener("resize", updateMenuPosition);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [isOpen]); // Chạy lại khi menu mở

  // Tính toán vị trí context menu
  useEffect(() => {
    if (isOpen && anchorRef.current && menuRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let calculatedTop = anchorRect.bottom; // Mặc định: Dưới avatar
      let calculatedRight = 0; // Mặc định: Bên phải avatar
      let positionType = position; // Mặc định là absolute

      // Nếu menu tràn khỏi màn hình dưới hoặc phải
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
      ref={menuRef}
      style={{
        position: position, // Sử dụng `fixed` nếu bị tràn
        right: `${right}px`,
        top: `${top}px`,
      }}
      className="bg-40 text-white min-w-[260px] rounded overflow-hidden shadow-lg p-1 z-1000 flex flex-col text-lg"
    >
      {session?.user?.roles?.map((item) => {
        if (item.name === "ADMIN") {
          return (
            <div
              key={item.name}
              className="py-3 px-3 hover:bg-hover cursor-pointer rounded-sm hover:underline flex justify-between"
              onClick={() => route.push("/admin")}
            >
              <span>Admin</span>
              <FaExternalLinkAlt />
            </div>
          );
        }
      })}
      <div className="py-3 px-3 hover:bg-hover cursor-pointer rounded-sm hover:underline flex justify-between">
        <Link href={`/profile/${session?.user._id}`}>Thông tin cá nhân</Link>
        <FaExternalLinkAlt />
      </div>
      <div className="border-t border-hover">
        <div
          className="py-3 px-3 hover:bg-hover cursor-pointer rounded-sm hover:underline"
          onClick={handleLogout}
        >
          Đăng xuất
        </div>
      </div>
    </div>
  );
};

export default ContextMenuAccount;
