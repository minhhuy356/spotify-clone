import { styleContextMenuTrack } from "@/contants/tab.more";
import { ITrack } from "@/types/data";
import { off } from "process";

// Tính toán vị trí hiển thị
export const calculatePosition = (
  divRef: React.RefObject<HTMLDivElement | null>,
  space?: number
): { x: number; y: number } => {
  if (!divRef?.current) return { x: 0, y: 0 };

  const triggerRect = divRef.current.getBoundingClientRect();
  const menuHeight = divRef.current.offsetHeight;
  const menuWidth = styleContextMenuTrack.width;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const spacing = space || 0; // Khoảng cách mong muốn

  let x = triggerRect.right + spacing; // Menu nằm bên phải và cách 12px
  let y = triggerRect.top + spacing; // Menu nằm dưới và cách 12px

  // Nếu vượt ra ngoài chiều ngang viewport → chuyển sang trái
  if (x + menuWidth > viewportWidth) {
    x = triggerRect.left - menuWidth - spacing; // sang trái và cách 12px
  }

  // Nếu vượt ra ngoài chiều dọc viewport → đẩy lên trên
  if (y + menuHeight > viewportHeight) {
    y = viewportHeight - menuHeight - spacing;
  }

  // Nếu vẫn bị quá trên màn hình thì đẩy xuống 1 chút
  if (y < 0) {
    y = spacing;
  }

  return { x, y };
};

export const insertAt = (array: any[], item: object, index: number) => {
  // Nếu index nhỏ hơn 0 hoặc lớn hơn độ dài của mảng, thêm item vào cuối
  if (index < 0 || index > array.length) {
    return [...array, item];
  }
  // Thêm item vào vị trí chỉ định bằng cách dùng slice
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const findIndexById = (array: ITrack[], track: ITrack): number => {
  return array.findIndex((item) => item._id === track._id);
};
