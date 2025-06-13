import { ReactNode, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";

interface IProps {
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
}

const Preview = ({ open, children, onClose }: IProps) => {
  const childrenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        childrenRef.current &&
        !childrenRef.current.contains(event.target as Node)
      ) {
        onClose && onClose(); // Gọi `onClose` để cập nhật state bên ngoài
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]); // Dùng `open` thay vì `showPreview`

  if (!open) return null; // Kiểm tra `open` thay vì `showPreview`

  return (
    <div className="fixed inset-0 bg-black-03 bg-opacity-50 flex items-center justify-center z-[1000]">
      <div ref={childrenRef}>{children}</div>

      {/* Nút đóng */}
      <span
        className="absolute top-2 right-2 cursor-pointer text-black"
        onClick={onClose} // Đơn giản hóa logic
      >
        <IoMdClose size={24} />
      </span>
    </div>
  );
};

export default Preview;
