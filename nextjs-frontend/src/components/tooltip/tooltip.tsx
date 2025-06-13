import { HTMLAttributes, ReactNode } from "react";
type IFronSize =
  | "text-xs"
  | "text-sm"
  | "text-base"
  | "text-lg"
  | "text-xl"
  | "text-2xl"
  | "text-3xl"
  | "text-4xl"
  | "text-6xl"
  | "text-7xl"
  | "text-8xl"
  | "text-9xl";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  fontSize?: IFronSize; // ví dụ: "text-sm", "text-lg"
}

const getTooltipPositionClass = (placement: string) => {
  switch (placement) {
    case "bottom":
      return "top-full mt-2 left-1/2 -translate-x-1/2";
    case "left":
      return "right-full mr-2 top-1/2 -translate-y-1/2";
    case "right":
      return "left-full ml-2 top-1/2 -translate-y-1/2";
    case "top":
    default:
      return "bottom-full mb-2 left-1/2 -translate-x-1/2";
  }
};

const Tooltip = ({
  content,
  children,
  placement = "top",
  fontSize = "text-base",
  ...rest
}: IProps) => {
  const positionClass = getTooltipPositionClass(placement);

  return (
    <div className="group relative inline-block" {...rest}>
      {children}
      <div
        className={`absolute ${positionClass} px-3 py-2 rounded bg-40 text-white-09
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          pointer-events-none z-10 whitespace-nowrap !${fontSize}`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
