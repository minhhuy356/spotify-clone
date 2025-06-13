import { ReactNode, useRef, useState, useEffect, forwardRef } from "react";

type CustomScrollbarProps = {
  children: ReactNode;
  fatherRef?: React.RefObject<HTMLDivElement | null>;
  headerRef?: React.RefObject<HTMLDivElement | null>;
  setScroll?: (value: number) => void;
};

const ScrollBar = (props: CustomScrollbarProps) => {
  const { fatherRef, headerRef, children, setScroll } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const [scrollThumbHeight, setScrollThumbHeight] = useState<number>(20);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [trackHeight, setTrackHeight] = useState<number>(0);
  const isDragging = useRef<boolean>(false);
  const startY = useRef<number>(0);
  const startScrollTop = useRef<number>(0);
  const scrollTarget = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (setScroll) setScroll(scrollTop); // Đồng bộ trạng thái khi `open` thay đổi
  }, [scrollTop]);

  useEffect(() => {
    const updateLayout = () => {
      const father = fatherRef?.current;
      const content = contentRef?.current;
      if (!father || !content) return;

      const visibleHeight = father.clientHeight;
      setTrackHeight(visibleHeight);

      requestAnimationFrame(() => {
        if (content.scrollHeight >= visibleHeight) {
          const thumbHeight = Math.max(
            (visibleHeight / content.scrollHeight) * visibleHeight,
            20
          );
          setScrollThumbHeight(thumbHeight);
        }
      });
    };

    // Thêm MutationObserver để phát hiện thay đổi trong nội dung
    const observer = new MutationObserver(updateLayout);
    if (contentRef.current) {
      observer.observe(contentRef.current, { childList: true, subtree: true });
    }

    updateLayout(); // Chạy khi mount

    window.addEventListener("resize", updateLayout);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [fatherRef, headerRef]);

  // useEffect(() => {
  //   const observer = new MutationObserver(() => {
  //     updateLayout();
  //   });

  //   if (contentRef.current) {
  //     observer.observe(contentRef.current, { childList: true, subtree: true });
  //   }

  //   return () => observer.disconnect();
  // }, []);

  // Hàm animation cuộn lên mượt mà
  const smoothScrollTo = (targetScroll: number) => {
    if (!contentRef.current) return;
    scrollTarget.current = targetScroll;

    const animateScroll = () => {
      if (!contentRef.current) return;
      const currentScroll = contentRef.current.scrollTop;
      const diff = scrollTarget.current - currentScroll;

      if (Math.abs(diff) < 1) {
        contentRef.current.scrollTop = scrollTarget.current;
        return;
      }

      contentRef.current.scrollTop += diff * 0.05; // Điều chỉnh tốc độ cuộn
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    };

    cancelAnimationFrame(animationFrameRef.current);
    animateScroll();
  };

  // Xử lý cuộn chuột
  const handleWheel = (e: WheelEvent) => {
    if (!contentRef.current) return;
    e.preventDefault();

    const newTarget = contentRef.current.scrollTop + e.deltaY * 2;
    smoothScrollTo(newTarget);
  };

  // Gán sự kiện cuộn
  useEffect(() => {
    const content = contentRef.current;
    content?.addEventListener("wheel", handleWheel, { passive: false });
    return () => content?.removeEventListener("wheel", handleWheel);
  }, []);

  // Cập nhật vị trí thanh cuộn khi nội dung cuộn
  const handleContentScroll = () => {
    if (!contentRef.current) return;
    const content = contentRef.current;
    const maxScrollTop = content.scrollHeight - trackHeight;

    const scrollRatio = content.scrollTop / maxScrollTop;
    setScrollTop(scrollRatio * (trackHeight - scrollThumbHeight));
  };

  // Kéo thanh cuộn
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollTop;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !contentRef.current) return;
    const content = contentRef.current;
    const maxScrollTop = content.scrollHeight - trackHeight;

    let deltaY = e.clientY - startY.current;
    let newScrollTop = startScrollTop.current + deltaY;

    newScrollTop = Math.max(
      0,
      Math.min(newScrollTop, trackHeight - scrollThumbHeight)
    );

    const scrollRatio = newScrollTop / (trackHeight - scrollThumbHeight);
    smoothScrollTo(scrollRatio * maxScrollTop);
    setScrollTop(newScrollTop);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
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
        onScroll={handleContentScroll}
        className="w-full overflow-hidden h-full "
        style={{
          maxHeight: `${trackHeight}px`,
        }}
      >
        {children}
      </div>

      {/* Thanh cuộn tùy chỉnh */}
      <div
        className="absolute top-0 right-0 w-3 bg-transparent z-10"
        style={{
          height: `${trackHeight}px`,
          opacity: isHovered ? 1 : 0,
          transition: isHovered
            ? "opacity 0.1s ease-in"
            : "opacity 0.5s ease-out 1s", // Chờ 0.5s rồi mới ẩn từ từ
          display:
            contentRef.current && trackHeight >= contentRef.current.scrollHeight
              ? "none"
              : "block",
        }}
      >
        <div
          ref={scrollBarRef}
          className="cursor-pointer bg-white-05"
          style={{
            height: ` ${scrollThumbHeight}px`,
            transform: `translateY(${scrollTop}px)`,
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default ScrollBar;
