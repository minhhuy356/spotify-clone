import { HTMLAttributes, useEffect, useState } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  bars?: number;
  width?: number;
  height?: number;
  color?: string;
  rounded?: boolean;
  speed?: number; // mới: hệ số tốc độ (1 = bình thường, <1 = nhanh hơn, >1 = chậm hơn)
}

const EqualizerIcon = ({
  bars = 3,
  width = 16,
  height = 16,
  color = "white",
  className,
  rounded = true,
  speed = 1, // mặc định tốc độ bình thường
}: IProps) => {
  const [animations, setAnimations] = useState<number[]>([]);

  useEffect(() => {
    const genAnimations = Array.from(
      { length: bars },
      () => Math.random() * 0.3 + 0.2 // 0.2–0.5s
    );
    setAnimations(genAnimations);
  }, [bars]);

  const gapRatio = 0.4;
  const barWidth = width / (bars + gapRatio * (bars - 1));
  const gap = barWidth * gapRatio;

  const rx = rounded ? barWidth / 2 : 0;
  const ry = rounded ? 2 : 0;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {animations.map((baseDuration, i) => {
        const duration = baseDuration * speed;
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={height / 2}
            width={barWidth}
            height={height / 2}
            fill={color}
            rx={rx}
            ry={ry}
          >
            <animate
              attributeName="height"
              values={`${height * 0.2};${height};${height * 0.2}`}
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
            <animate
              attributeName="y"
              values={`${height * 0.8};0;${height * 0.8}`}
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          </rect>
        );
      })}
    </svg>
  );
};

export default EqualizerIcon;
