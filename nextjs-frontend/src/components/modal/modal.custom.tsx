import { ReactNode, useEffect, useRef, useState } from "react";

interface IProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  body?: ReactNode;
  header?: ReactNode;
  onConfirm?: () => Promise<void>;
  textConfirm?: string;
}

const ModalCustom = ({
  isOpen,
  setIsOpen,
  onConfirm,
  body,
  header,
  textConfirm = "Xác nhận",
}: IProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const [animationVisible, setAnimationVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      // Delay để cho phép CSS transition chạy khi bật modal
      setTimeout(() => setAnimationVisible(true), 10); // delay rất nhỏ là đủ
    } else {
      setAnimationVisible(false);
      const timeout = setTimeout(() => setShow(false), 100); // khớp với duration của transition
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsOpen(false);
    if (onConfirm) {
      // Kiểm tra trước khi gọi
      await onConfirm();
    }
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex justify-center items-center transition-all duration-500 ${
        animationVisible ? "bg-black-03 visible" : "bg-transparent invisible"
      }`}
    >
      <div
        className={`fixed inset-0 z-[10000] flex justify-center items-center transition-all duration-500 ${
          animationVisible
            ? "h-[90%] visible opacity-100"
            : "h-[75%] invisible opacity-0"
        }`}
      >
        <div
          className="w-[420px] h-[220px] bg-white rounded-lg text-black"
          ref={modalRef}
        >
          <div className="p-6 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold">{header}</span>
              {body}
            </div>
            <div className="flex gap-5 justify-end">
              <button
                className="font-bold text-xl py-3 px-6 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </button>
              <button
                className="font-bold text-xl py-3 px-6 rounded-full bg-green-base cursor-pointer hover:border-green-500 border-2 hover:bg-white hover:scale-105 transition-all duration-150"
                onClick={handleConfirm}
              >
                {textConfirm}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCustom;
