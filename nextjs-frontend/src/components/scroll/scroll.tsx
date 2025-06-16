"use client";

import { setScrollCenter } from "@/lib/features/scroll-center/scroll-center.slice";
import { useAppDispatch } from "@/lib/hook";
import {
  ReactNode,
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";

type CustomScrollbarProps = {
  children: ReactNode;
  fatherRef?: React.RefObject<HTMLDivElement | null>;
  headerRef?: React.RefObject<HTMLDivElement | null>;
  setScroll?: (value: number) => void;
  position: "center" | "left" | "right";
};

const ScrollBar = ({
  children,
  fatherRef,
  headerRef,
  setScroll,
  position,
}: CustomScrollbarProps) => {
  const dispatch = useAppDispatch();

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const lastMove = useRef(0);

  const [scrollThumbHeight, setScrollThumbHeight] = useState(20);
  const [scrollTop, setScrollTop] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const updateLayout = useCallback(() => {
    const father = fatherRef?.current;
    const header = headerRef?.current;
    const content = contentRef.current;

    if (!father || !content) return;

    const visibleHeight = father.clientHeight - (header?.clientHeight ?? 0);
    const scrollHeight = content.scrollHeight;

    // Nếu scrollHeight = 0 thì nội dung chưa render xong → delay lại
    if (scrollHeight === 0) {
      setTimeout(updateLayout, 50);
      return;
    }

    setTrackHeight(visibleHeight);

    if (scrollHeight >= visibleHeight) {
      const thumbHeight = Math.max(
        (visibleHeight / scrollHeight) * visibleHeight,
        20
      );
      setScrollThumbHeight(thumbHeight);
      setShowScrollbar(true);
    } else {
      setShowScrollbar(false);
    }
  }, [fatherRef, headerRef]);

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      updateLayout();
    }, 50); // delay để DOM có nội dung

    const resizeHandler = () => updateLayout();
    window.addEventListener("resize", resizeHandler);

    const observer = new MutationObserver(() => {
      setTimeout(updateLayout, 50);
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      window.removeEventListener("resize", resizeHandler);
    };
  }, [updateLayout]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const content = contentRef.current;
      const maxScrollTop = content.scrollHeight - trackHeight;
      const currentScrollTop = content.scrollTop;
      const scrollRatio = currentScrollTop / maxScrollTop;
      const newThumbTop = scrollRatio * (trackHeight - scrollThumbHeight);

      requestAnimationFrame(() => {
        setScrollTop(newThumbTop);
        if (position === "center") {
          dispatch(setScrollCenter({ scroll: currentScrollTop }));
        }

        setScroll?.(currentScrollTop);
      });
    };

    const el = contentRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [trackHeight, scrollThumbHeight, dispatch, setScroll]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollTop;
    setIsDraggingState(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const now = Date.now();
    if (now - lastMove.current < 16) return;
    lastMove.current = now;

    if (!isDragging.current || !contentRef.current) return;

    const deltaY = e.clientY - startY.current;
    let newScrollTop = startScrollTop.current + deltaY;
    newScrollTop = Math.max(
      0,
      Math.min(newScrollTop, trackHeight - scrollThumbHeight)
    );

    const scrollRatio = newScrollTop / (trackHeight - scrollThumbHeight);
    const maxScrollTop = contentRef.current.scrollHeight - trackHeight;

    contentRef.current.scrollTop = scrollRatio * maxScrollTop;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setIsDraggingState(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Nội dung cuộn */}
      <div
        ref={contentRef}
        className="w-full h-full overflow-y-scroll overflow-x-hidden"
        style={{
          maxHeight: `${trackHeight}px`,
          scrollbarWidth: "none",
        }}
      >
        {children}
      </div>

      {/* Scrollbar tùy chỉnh */}
      {showScrollbar && (
        <div
          className="absolute top-0 right-0 w-3 z-50 bg-transparent"
          style={{
            height: `${trackHeight}px`,
            opacity: isHovered ? 1 : 0,
            transition: isHovered
              ? "opacity 0.1s ease-in"
              : "opacity 0.5s ease-out 1s",
          }}
        >
          <div
            ref={scrollBarRef}
            className={`${
              isDraggingState ? "bg-white-07" : "hover:bg-white-05 bg-white-03"
            }`}
            style={{
              height: `${scrollThumbHeight}px`,
              transform: `translateY(${scrollTop}px)`,
            }}
            onMouseDown={handleMouseDown}
          />
        </div>
      )}
    </div>
  );
};

export default ScrollBar;
