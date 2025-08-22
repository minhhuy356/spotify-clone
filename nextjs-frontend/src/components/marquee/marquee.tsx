import { useEffect, useRef, useState, ReactNode } from "react";

interface IMarquee {
  children: ReactNode;
  speed?: number;
  className?: string;
}

const Marquee: React.FC<IMarquee> = ({ children, speed = 0.2 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tlx, setTlx] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    // Kiểm tra nếu nội dung bị tràn
    if (container.scrollWidth > container.clientWidth) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [children]); // Cập nhật nếu nội dung thay đổi

  useEffect(() => {
    if (!containerRef.current || !isHovered || !isOverflowing) return;

    const container = containerRef.current;
    const maxTlx = container.scrollWidth - container.clientWidth;
    let animationFrame: number;

    const animate = () => {
      setTlx((prevTlx) => {
        let newTlx = prevTlx + direction * speed;
        if (newTlx >= maxTlx) {
          setDirection(-1);
          return maxTlx - 1;
        } else if (newTlx <= 0) {
          setDirection(1);
          return 1;
        }
        return newTlx;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [direction, isHovered, speed, isOverflowing]);

  const handleMouseEnter = () => {
    if (isOverflowing) {
      hoverTimeout.current = setTimeout(() => setIsHovered(true), 500);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setIsHovered(false);
    setTlx(0);
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex"
        ref={containerRef}
        style={{
          transform: isOverflowing ? `translateX(-${tlx}px)` : "none",
          transition: isOverflowing ? "transform 0.05s linear" : "none",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Marquee;
