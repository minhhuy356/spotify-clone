import { styleContextMenuTrack } from "@/contants/tab.more";
import { ITrack } from "@/types/data";
import { off } from "process";

// Tính toán vị trí hiển thị
export const calculatePosition = (
  positionTab: {
    right: number;
    top: number;
    left: number;
    bottom: number;
  },
  divRef: React.RefObject<HTMLDivElement>
): React.CSSProperties => {
  if (!positionTab || !divRef) return {};

  if (!positionTab || !divRef.current) return {};
  const divRect = divRef.current.getBoundingClientRect();
  const menuWidth = styleContextMenuTrack.width; // Độ rộng menu
  const menuHeight = divRect.height; // Chiều cao menu
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = positionTab.right; // Đặt menu bên phải nút bấm
  let top = positionTab.top;
  let right = positionTab.left; // Đặt menu bên phải nút bấm
  let bottom = positionTab.bottom;

  // Điều chỉnh vị trí nếu vượt ra khỏi viewport
  if (left + menuWidth > viewportWidth) {
    left = right - menuWidth; // Đặt menu bên trái nút bấm
  }
  if (top + menuHeight > viewportHeight) {
    top = viewportHeight - menuHeight - 50; // Đẩy menu lên phía trên
  }
  if (top < 0) {
    top = 10; // Nếu menu vượt lên trên viewport, đẩy nó xuống
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
  };
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
