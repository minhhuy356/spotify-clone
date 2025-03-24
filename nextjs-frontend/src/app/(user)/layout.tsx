"use client";

import AppFooter from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import Left from "@/components/main/main.left";

import ScrollBar from "@/components/scroll/scroll";
import React from "react";
import Right from "@/components/main/right/main.right";
import ContextMenuAccount from "@/components/context-menu/context-menu.account";
import ContextMenuTrack from "@/components/context-menu/context-menu.track";
import {
  hardCenterWidth,
  hardLeftWidth,
  hardRightWidth,
  maxLeftWidth,
  maxLeftWidthMobileScreen,
  maxRightWidth,
  minLeftWidth,
  minRightWidth,
  space,
  ultimateLeftWidth,
  widthDrag,
} from "../layout";

interface ILayout {
  left: IPosition;
  right: number;
  center: number;
}

interface IPosition {
  width: number;
  isClose: boolean;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [leftWidth, setLeftWidth] = React.useState<number>(300);
  const [rightWidth, setRightWidth] = React.useState<number>(300);
  const [centerWidth, setCenterWidth] = React.useState<number>(0); // Initialize to 0
  const [screenWidth, setScreenWidth] = React.useState<number>(0); // Initialize to 0
  const [isMobile, setIsMobile] = React.useState<boolean>(false); // Initialize to 0
  const layoutBasic: ILayout = {
    left: {
      width: leftWidth,
      isClose: false,
    },
    right: rightWidth,
    center: centerWidth,
  };

  const [isLayout, setIsLayout] = React.useState<boolean>(false);

  const leftRef = React.useRef<HTMLDivElement | null>(null);
  const centerRef = React.useRef<HTMLDivElement | null>(null);
  const rightRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const initialWidth = window.innerWidth;
      setScreenWidth(initialWidth);
      setCenterWidth(initialWidth - leftWidth - rightWidth - space);
    }
  }, []);

  React.useLayoutEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;

      let layout: ILayout =
        JSON.parse(localStorage.getItem("layout") || "null") || layoutBasic;

      if (screenWidth >= 877 && screenWidth < 900) {
        layout.left.width = minLeftWidth;
        layout.right = hardRightWidth;
        layout.center =
          hardCenterWidth +
          (screenWidth -
            hardCenterWidth -
            hardRightWidth -
            minLeftWidth -
            space);
        setIsMobile(true);
        console.log(isMobile);
      } else if (screenWidth > 900) {
        setIsMobile(false);
        if (layout.left.isClose === false) {
          const scaleFactor = 0.05;
          layout.left.width = Math.max(
            Math.min(hardLeftWidth + (screenWidth - 900) * scaleFactor, 600),
            hardLeftWidth
          );

          if (screenWidth === window.screen.width) {
            layout.left.width = hardLeftWidth;
          }

          layout.center =
            screenWidth - layout.left.width - layout.right - space;

          if (layout.center <= hardCenterWidth) {
            layout.center = hardCenterWidth;
          }

          if (screenWidth < 1200) {
            layout.left.width = hardLeftWidth;
          }
        } else {
          layout.center =
            screenWidth - layout.left.width - layout.right - space;
        }
      } else if (screenWidth < 877) {
        layout.center = hardCenterWidth;
        setIsMobile(true);
      }
      setLeftWidth(layout.left.width);
      setRightWidth(layout.right);
      setCenterWidth(layout.center);
      setIsLayout(true);
      localStorage.setItem("layout", JSON.stringify(layout));
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    side: "left" | "right"
  ) => {
    e.preventDefault();
    document.body.style.cursor = "grab"; // Đổi con trỏ khi kéo

    const startX = e.clientX;
    const screenWidth = window.innerWidth;

    const onMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - startX;

      const layoutBasic = {
        left: {
          width: leftWidth,
          isClose: false,
        },
        right: rightWidth,
        center: centerWidth,
      };

      let layout: ILayout =
        JSON.parse(localStorage.getItem("layout") || "null") || layoutBasic;
      // screen > 900
      if (screenWidth > 900) {
        if (side === "left") {
          let tempLeft = leftWidth + deltaX;
          layout.left.width = tempLeft;
          // Nếu chưa vượt 300
          if (layout.left.width <= hardLeftWidth) {
            if (layout.left.width < leftWidth) {
              if (layout.left.width < leftWidth - 100) {
                layout.left.width = minLeftWidth;
                layout.left.isClose = true;
              } else {
                layout.left.width = hardLeftWidth;
              }
            }

            if (layout.left.width > leftWidth) {
              if (layout.left.width > minLeftWidth + 100) {
                layout.left.width = hardLeftWidth;

                layout.left.isClose = false;
              } else {
                layout.left.width = minLeftWidth;
              }
            }
            layout.center =
              screenWidth - layout.left.width - layout.right - space;
          } else if (
            layout.left.width > maxLeftWidth &&
            layout.left.width < ultimateLeftWidth
          ) {
            // Vượt 300 >
            if (layout.left.width > leftWidth) {
              if (layout.left.width > maxLeftWidth + 100) {
                layout.left.width = ultimateLeftWidth;
              } else {
                layout.left.width = maxLeftWidth;
              }
            }

            if (layout.left.width < leftWidth) {
              if (layout.left.width < ultimateLeftWidth - 100) {
                layout.left.width = maxLeftWidth;
              } else {
                layout.left.width = ultimateLeftWidth;
              }
            }
          }
          // reponsive center and right
          if (layout.left.width > leftWidth) {
            if (layout.center >= hardCenterWidth) {
              layout.center =
                screenWidth - layout.right - layout.left.width - space;
            }
            if (layout.center < hardCenterWidth) {
              layout.center = hardCenterWidth;
              console.log(true);
              if (layout.right > hardRightWidth) {
                layout.right =
                  screenWidth - layout.center - layout.left.width - space;
              }
              if (
                layout.left.width >
                screenWidth - layout.right - layout.center + 100
              ) {
                layout.right = minRightWidth;
              }
              layout.left.width =
                screenWidth - layout.right - layout.center - space;

              if (layout.right === minRightWidth) {
                layout.left.width =
                  screenWidth - layout.right - layout.center - space + 16;
              }
            }
          } else {
            layout.center =
              screenWidth - layout.left.width - layout.right - space;
            if (
              layout.center > hardCenterWidth + 200 &&
              layout.right === minRightWidth
            ) {
              console.log(true);
              layout.right = hardRightWidth;
              layout.left.width =
                screenWidth - hardCenterWidth - hardRightWidth - space;
              layout.center = hardCenterWidth;
            }
            if (layout.right === minRightWidth) {
              layout.center =
                screenWidth - layout.left.width - layout.right - space + 16;
            }
          }
        } else if (side === "right") {
          let tempLeft = rightWidth - deltaX;
          layout.right = tempLeft;

          if (layout.right < rightWidth) {
            if (layout.right < minRightWidth) {
              layout.right = minRightWidth;
            } else if (layout.right < hardRightWidth) {
              layout.right = hardRightWidth;
            }
          } else {
            if (layout.right < hardRightWidth) {
              if (layout.right >= minRightWidth + 100) {
                layout.right = hardRightWidth;
                if (layout.center <= hardCenterWidth) {
                  layout.center = hardCenterWidth;
                  layout.left.width =
                    screenWidth - layout.right - layout.center - space;
                }
              } else {
                layout.right = minRightWidth;
              }
            } else {
              if (layout.right <= maxRightWidth) {
                if (layout.center <= hardCenterWidth) {
                  layout.center = hardCenterWidth;
                  layout.left.width =
                    screenWidth - layout.right - layout.center - space;
                }
              } else {
                layout.right = maxRightWidth;
              }
            }
          }

          layout.center =
            screenWidth - layout.left.width - layout.right - space;
          if (layout.right === minRightWidth) {
            layout.center =
              screenWidth - layout.left.width - layout.right - space + 16;
          }
        }
      } else {
        // screen <900
        if (side === "left") {
          let tempLeft = leftWidth + deltaX;
          layout.left.width = tempLeft;

          if (layout.left.width < hardLeftWidth) {
            if (layout.left.width < leftWidth) {
              if (layout.left.width < leftWidth - 50) {
                layout.left.width = minLeftWidth;
                layout.left.isClose = true;
              } else {
                layout.left.width = hardLeftWidth;
              }
            }

            if (layout.left.width > leftWidth) {
              if (layout.left.width > minLeftWidth + 50) {
                layout.left.width = hardLeftWidth;
                layout.left.isClose = false;
              } else {
                layout.left.width = minLeftWidth;
              }
            }
          } else {
            if (layout.left.width >= maxLeftWidthMobileScreen) {
              layout.left.width = maxLeftWidthMobileScreen;
            }
          }

          layout.center = screenWidth + layout.right - layout.left.width;
        }
      }

      setLeftWidth(layout.left.width);
      setRightWidth(layout.right);
      setCenterWidth(layout.center);

      localStorage.setItem("layout", JSON.stringify(layout));
    };

    const onMouseUp = () => {
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (!isLayout) return <></>;

  return (
    <div>
      {" "}
      <div className="relative h-screen w-full">
        <div
          className={`grid ${
            isMobile
              ? "grid-rows-[auto_minmax(448px,1fr)_auto]"
              : "grid-rows-[auto_1fr_auto]"
          } bg-base h-screen `}
        >
          <div className="w-full bg-black">
            <AppHeader isMobile={isMobile} />
          </div>

          {/* Content */}
          <div
            className={`grid h-full bg-black text-white gap-[4px] min-h-[448px] ${
              rightWidth === minRightWidth ? "pl-2" : " px-2"
            } `}
            style={{
              gridTemplateColumns: `${leftWidth}px ${widthDrag}px ${centerWidth}px ${widthDrag}px ${rightWidth}px`,
            }}
          >
            <div
              className=" bg-base min-h-0 w-full overflow-hidden rounded-lg"
              ref={leftRef}
            >
              <Left
                leftWidth={leftWidth}
                fatherRef={leftRef}
                hardLeftWidth={hardLeftWidth}
              />
            </div>

            {/* Thanh kéo giữa Left & Center */}
            <div
              className="w-[3px]  bg-transparent hover:bg-hover cursor-grab"
              onMouseDown={(e) => handleDrag(e, "left")}
            />

            {/* Center */}
            <div
              className="rounded-lg bg-base min-h-0 overflow-hidden "
              ref={centerRef}
            >
              <div className="w-full text-white h-full ">
                <ScrollBar fatherRef={centerRef}>{children}</ScrollBar>
              </div>
            </div>

            {/* Thanh kéo giữa Center & Right */}

            <div
              className={`${
                screenWidth > 900 ? "visible" : "invisible   "
              }w-[3px] bg-transparent hover:bg-hover cursor-grab`}
              onMouseDown={(e) => handleDrag(e, "right")}
            />
            {/* Right */}

            <div
              className={` ${
                rightWidth <= 50 ? " rounded-l" : " rounded-b-lg"
              }  overflow-hidden bg-base min-h-0  flex flex-col`}
              ref={rightRef}
            >
              <div>
                <Right fatherRef={rightRef} rightWidth={rightWidth} />
              </div>
            </div>
          </div>

          <div className="w-full">
            <AppFooter isMobile={isMobile} />
          </div>
        </div>
      </div>
      <ContextMenuTrack />
    </div>
  );
}
