import { useEffect, useRef, useState } from "react";

export type Breakpoint = {
  below1600: boolean;
  below1400: boolean;
  below1200: boolean;
  below1100: boolean;
  below900: boolean;
  below800: boolean;
  below750: boolean;
  below700: boolean;
  below650: boolean;
  below600: boolean;
};

export const useResponsiveBreakpoint = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>({
    below1600: false,
    below1400: false,
    below1200: false,
    below1100: false,
    below900: false,
    below800: false,
    below750: false,
    below700: false,
    below650: false,
    below600: false,
  });

  useEffect(() => {
    if (!ref.current) return;

    const update = (width: number) => {
      setBreakpoint({
        below1600: width < 1600,
        below1400: width < 1400,
        below1200: width < 1200,
        below1100: width < 1200,
        below900: width < 900,
        below800: width < 800,
        below750: width < 750,
        below700: width < 700,
        below650: width < 650,
        below600: width < 600,
      });
    };

    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, breakpoint };
};
