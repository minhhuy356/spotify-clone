"use client";

import { useAppSelector } from "@/lib/hook";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function GlobalTooltip() {
  const tooltip = useAppSelector((state) => state.tooltip.tooltip);

  // State để giữ dữ liệu cuối cùng của tooltip (ngăn mất dữ liệu ngay khi Redux set null)
  const [internalTooltip, setInternalTooltip] = useState<typeof tooltip>(null);

  // Điều khiển hiển thị và giữ DOM lại sau khi ẩn
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (tooltip) {
      setInternalTooltip(tooltip);
      setShouldRender(true);
      // Trigger fade-in
      requestAnimationFrame(() => setVisible(true));
    } else {
      // Trigger fade-out
      setVisible(false);
      // Delay unmount
      const timeout = setTimeout(() => {
        setShouldRender(false);
        setInternalTooltip(null); // clear content sau khi animation xong
      }, 150); // duration khớp với transition-opacity

      return () => clearTimeout(timeout);
    }
  }, [tooltip]);

  if (!shouldRender || !internalTooltip) return null;

  const { anchorRect, position, content } = internalTooltip;

  const spacing = 8;
  const centerX = anchorRect.left + anchorRect.width / 2;
  const centerY = anchorRect.top + anchorRect.height / 2;

  const getStyleFromPosition = (): React.CSSProperties => {
    switch (position) {
      case "top":
        return {
          top: anchorRect.top - spacing,
          left: centerX,
          transform: "translate(-50%, -100%)",
        };
      case "bottom":
        return {
          top: anchorRect.bottom + spacing,
          left: centerX,
          transform: "translate(-50%, 0)",
        };
      case "left":
        return {
          top: centerY,
          left: anchorRect.left - spacing,
          transform: "translate(-100%, -50%)",
        };
      case "right":
        return {
          top: centerY,
          left: anchorRect.right + spacing,
          transform: "translate(0, -50%)",
        };
      case "top-left":
        return {
          top: anchorRect.top - spacing,
          left: anchorRect.left,
          transform: "translate(0, -100%)",
        };
      case "top-right":
        return {
          top: anchorRect.top - spacing,
          left: anchorRect.right,
          transform: "translate(-100%, -100%)",
        };
      case "bottom-left":
        return {
          top: anchorRect.bottom + spacing,
          left: anchorRect.left,
        };
      case "bottom-right":
        return {
          top: anchorRect.bottom + spacing,
          left: anchorRect.right,
          transform: "translate(-100%, 0)",
        };
      case "center":
        return {
          top: centerY,
          left: centerX,
          transform: "translate(-50%, -50%)",
        };
      default:
        return {};
    }
  };

  return createPortal(
    <div
      className={`fixed z-[9999] bg-35 text-white px-2 py-1 rounded shadow-md  shadow-black-07 text pointer-events-none whitespace-nowrap transition-opacity duration-150 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={getStyleFromPosition()}
    >
      {content}
    </div>,
    document.body
  );
}
