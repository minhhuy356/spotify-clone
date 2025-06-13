import { HTMLAttributes, useEffect, useState } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  bars?: number;
  width?: number;
  height?: number;
  color?: string;
}
const EqualizerIcon = ({
  bars = 3,
  width = 16,
  height = 16,
  color = "white",
}: IProps) => {
  const [animations, setAnimations] = useState<number[]>([]);

  useEffect(() => {
    const genAnimations = Array.from(
      { length: bars },
      () => Math.random() * 0.3 + 0.2 // duration 0.2s–0.5s
    );
    setAnimations(genAnimations);
  }, [bars]);

  const barWidth = 4; // giữ cố định width mỗi thanh bar
  const totalBarsWidth = barWidth * bars;
  const totalGap = width - totalBarsWidth;
  const gap = bars > 1 ? totalGap / (bars - 1) : 0;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {animations.map((duration, i) => (
        <rect
          key={i}
          x={i * (barWidth + gap)}
          y={height / 2}
          width={barWidth}
          height={height / 2}
          fill={color}
          rx={barWidth / 2}
          ry={2}
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
      ))}
    </svg>
  );
};

export default EqualizerIcon;
