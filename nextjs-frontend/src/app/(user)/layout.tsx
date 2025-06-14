"use client";

import AppFooter from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import Left from "@/components/main/left/left.main";
import ScrollBar from "@/components/scroll/scroll";
import React, { useEffect, useRef, useState } from "react";
import Right from "@/components/main/right/main.right";
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
import Notification from "@/components/notification/notification";
import { NotificationProvider } from "@/components/notification/notification-context";
import { useAppSelector } from "@/lib/hook";
import {
  selectCurrentTime,
  selectCurrentTrack,
  selectListenFirst,
} from "@/lib/features/tracks/tracks.slice";
import ModalListenFirst from "@/components/modal/listen-first/listen-first.modal";
import WebsiteInformation from "@/components/footer/website-information";

interface ILayout {
  left: { width: number; isClose: boolean };
  right: { width: number; isClose: boolean };
  center: number;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layoutBasic = {
    left: { width: 300, isClose: false },
    right: { width: 0, isClose: true },
    center: 0,
  };

  const [layoutState, setLayoutState] = useState<ILayout>(layoutBasic);

  const [screenWidth, setScreenWidth] = useState<number>(0);

  const [isLayout, setIsLayout] = useState<boolean>(false);

  const leftRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const listenFirst = useAppSelector(selectListenFirst);
  const currentTrack = useAppSelector(selectCurrentTrack);

  const updateLayout = (partial: Partial<ILayout>) => {
    const newLayout = {
      ...layoutState,
      ...partial,
      left: {
        ...layoutState.left,
        ...(partial.left || {}),
      },
      right: {
        ...layoutState.right,
        ...(partial.right || {}),
      },
    };
    setLayoutState(newLayout);
    localStorage.setItem("layout", JSON.stringify(newLayout));
  };

  React.useLayoutEffect(() => {
    const initialWidth = window.innerWidth;
    setScreenWidth(initialWidth);
    updateLayout({
      center:
        initialWidth - layoutState.left.width - layoutState.right.width - space,
    });
  }, []);

  React.useLayoutEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      let layout: ILayout =
        JSON.parse(localStorage.getItem("layout") || "null") || layoutState;

      if (screenWidth < 900) {
        layout.left.width = minLeftWidth;
        if (layout.right.isClose) {
          layout.right.width = minRightWidth;
          layout.center =
            screenWidth - layout.left.width - layout.right.width - space;
        } else {
          layout.right.width = hardRightWidth;

          const futureCenter =
            hardCenterWidth +
            (screenWidth -
              hardCenterWidth -
              hardRightWidth -
              minLeftWidth -
              space) -
            8;
          if (
            layout.center >= hardCenterWidth &&
            futureCenter >= hardCenterWidth
          ) {
            layout.center = futureCenter;
          }
        }
      } else if (screenWidth > 900) {
        if (!layout.right.isClose) {
          const scaleFactor = 0.05;
          layout.right.width = Math.max(
            Math.min(
              hardRightWidth + (screenWidth - 900) * scaleFactor,
              maxRightWidth
            ),
            hardRightWidth
          );
        }

        if (!layout.left.isClose) {
          const scaleFactor = 0.05;
          layout.left.width = Math.max(
            Math.min(hardLeftWidth + (screenWidth - 900) * scaleFactor, 600),
            hardLeftWidth
          );
          if (screenWidth === window.screen.width) {
            layout.left.width = hardLeftWidth;
          }
          layout.center =
            screenWidth -
            layout.left.width -
            layout.right.width -
            space -
            (!layout.right.isClose ? 8 : 0);

          if (layout.center <= hardCenterWidth) {
            layout.center = hardCenterWidth;
          }
          if (screenWidth < 1200) {
            layout.left.width = hardLeftWidth;
          }
        } else {
          layout.center =
            screenWidth -
            layout.left.width -
            layout.right.width -
            space -
            (!layout.right.isClose ? 8 : 0);
        }
      }

      setScreenWidth(screenWidth);
      updateLayout(layout);
      setIsLayout(true);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    let layout: ILayout =
      JSON.parse(localStorage.getItem("layout") || "null") || layoutState;

    if (currentTrack) {
      if (screenWidth > 1200) {
        layout.right.width = maxRightWidth;
      } else {
        layout.right.width = hardRightWidth;
      }
      layout.right.isClose = false;
      layout.center =
        screenWidth - layout.left.width - layout.right.width - space - 8;
    }

    updateLayout(layout);
  }, [currentTrack]);

  // 🔧 handleDrag logic giữ nguyên – chỉ đổi sang dùng layoutState
  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    side: "left" | "right"
  ) => {
    e.preventDefault();
    document.body.style.cursor = "grab";

    const startX = e.clientX;
    const screenWidth = window.innerWidth;

    const onMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - startX;

      let layout: ILayout =
        JSON.parse(localStorage.getItem("layout") || "null") || layoutBasic;

      if (screenWidth > 900) {
        if (side === "left") {
          let tempLeft = layoutState.left.width + deltaX;
          layout.left.width = tempLeft;

          if (layout.left.width <= hardLeftWidth) {
            if (layout.left.width < layoutState.left.width) {
              if (layout.left.width < layoutState.left.width - 100) {
                layout.left.width = minLeftWidth;
                layout.left.isClose = true;
              } else {
                layout.left.width = hardLeftWidth;
              }
            }

            if (layout.left.width > layoutState.left.width) {
              if (layout.left.width > minLeftWidth + 100) {
                layout.left.width = hardLeftWidth;
                layout.left.isClose = false;
              } else {
                layout.left.width = minLeftWidth;
              }
            }

            layout.center =
              screenWidth - layout.left.width - layout.right.width - space;
          } else if (
            layout.left.width > maxLeftWidth &&
            layout.left.width < ultimateLeftWidth
          ) {
            if (layout.left.width > layoutState.left.width) {
              if (layout.left.width > maxLeftWidth + 100) {
                layout.left.width = ultimateLeftWidth;
              } else {
                layout.left.width = maxLeftWidth;
              }
            }

            if (layout.left.width < layoutState.left.width) {
              if (layout.left.width < ultimateLeftWidth - 100) {
                layout.left.width = maxLeftWidth;
              } else {
                layout.left.width = ultimateLeftWidth;
              }
            }
          }

          if (layout.left.width > layoutState.left.width) {
            if (layout.center >= hardCenterWidth) {
              layout.center =
                screenWidth - layout.right.width - layout.left.width - space;
            }

            if (layout.center < hardCenterWidth) {
              layout.center = hardCenterWidth;

              if (layout.right.width > hardRightWidth) {
                layout.right.width =
                  screenWidth - layout.center - layout.left.width - space;
              }

              if (
                layout.left.width >
                screenWidth - layout.right.width - layout.center + 100
              ) {
                layout.right.width = minRightWidth;
              }

              layout.left.width =
                screenWidth - layout.right.width - layout.center - space;

              if (layout.right.width === minRightWidth) {
                layout.left.width =
                  screenWidth - layout.right.width - layout.center - space;
              }
            }
          } else {
            layout.center =
              screenWidth - layout.left.width - layout.right.width - space;

            if (
              layout.center > hardCenterWidth + 200 &&
              layout.right.width === minRightWidth
            ) {
              layout.right.width = hardRightWidth;
              layout.left.width =
                screenWidth - hardCenterWidth - hardRightWidth - space;
              layout.center = hardCenterWidth;
            }

            if (layout.right.width === minRightWidth) {
              layout.center =
                screenWidth -
                layout.left.width -
                layout.right.width -
                space +
                16;
            }
          }
        } else if (side === "right") {
          let tempRight = layoutState.right.width - deltaX;
          layout.right.width = tempRight;

          if (layout.right.width < layoutState.right.width) {
            if (layout.right.width <= minRightWidth) {
              layout.right.width = minRightWidth;
              return;
            } else if (layout.right.width < hardRightWidth) {
              layout.right.width = hardRightWidth;
            }
          } else {
            if (layout.right.width < hardRightWidth) {
              if (layout.right.width >= minRightWidth + 100) {
                const futureCenter =
                  screenWidth - hardRightWidth - layout.left.width - space - 8;

                if (futureCenter >= hardCenterWidth) {
                  layout.right.width = hardRightWidth;
                  layout.center = futureCenter;
                } else {
                  const futureLeft =
                    screenWidth - hardCenterWidth - hardRightWidth - space;

                  if (futureLeft >= minLeftWidth) {
                    layout.right.width = hardRightWidth;
                    layout.center = hardCenterWidth;
                    layout.left.width = futureLeft;
                  } else {
                    layout.right.width = minRightWidth;
                    layout.center =
                      screenWidth -
                      layout.left.width -
                      layout.right.width -
                      space;
                  }
                }
              } else {
                layout.right.width = minRightWidth;
                layout.center =
                  screenWidth - layout.left.width - layout.right.width - space;
              }
            } else {
              if (layout.right.width <= maxRightWidth) {
                if (
                  screenWidth -
                    layout.right.width -
                    layout.left.width -
                    space >=
                  hardCenterWidth
                ) {
                  layout.center =
                    screenWidth -
                    layout.right.width -
                    layout.left.width -
                    space;
                } else {
                  layout.center = hardCenterWidth;
                  layout.left.width =
                    screenWidth - layout.right.width - layout.center - space;
                }
              } else {
                layout.right.width = maxRightWidth;
                layout.center =
                  screenWidth - layout.right.width - layout.left.width - space;
              }
            }
          }

          layout.center =
            screenWidth - layout.left.width - layout.right.width - space;
        }
      } else {
        if (side === "left") {
          let tempLeft = layoutState.left.width + deltaX;
          layout.left.width = tempLeft;

          if (layout.left.width < hardLeftWidth) {
            if (layout.left.width < layoutState.left.width) {
              if (layout.left.width < layoutState.left.width - 50) {
                layout.left.width = minLeftWidth;
                layout.left.isClose = true;
              } else {
                layout.left.width = hardLeftWidth;
              }
            }

            if (layout.left.width > layoutState.left.width) {
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

          layout.center = screenWidth + layout.right.width - layout.left.width;
        }
      }

      setLayoutState(layout);
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

  if (!isLayout) return null;

  return (
    <div
      style={{
        overflow: listenFirst.modalListenFirst.isOpen ? "hidden" : "",
        minWidth: 800,
      }}
    >
      <div className="relative h-screen w-full">
        <div
          className={`grid 
               grid-rows-[auto_1fr_auto]
          bg-base h-screen`}
        >
          <div className="w-full bg-black">
            <AppHeader />
          </div>

          <div
            className={`relative grid h-full bg-black text-white gap-[4px] min-h-[448px] ${
              layoutState.right.width === minRightWidth ? "pl-2" : " px-2"
            }`}
            style={{
              gridTemplateColumns: `${layoutState.left.width}px ${widthDrag}px ${layoutState.center}px ${widthDrag}px ${layoutState.right.width}px`,
            }}
          >
            <div
              className="bg-base min-h-0 w-full overflow-hidden rounded-lg"
              ref={leftRef}
            >
              <Left leftWidth={layoutState.left.width} fatherRef={leftRef} />
            </div>

            <div
              className="w-[3px] bg-transparent hover:bg-hover cursor-grab"
              onMouseDown={(e) => handleDrag(e, "left")}
            />

            <div
              className="rounded-lg bg-base min-h-0 overflow-hidden"
              ref={centerRef}
            >
              <div className="w-full text-white h-full">
                <ScrollBar fatherRef={centerRef}>{children} </ScrollBar>
              </div>
            </div>

            <div
              className={`${
                screenWidth > 900 ? "visible" : "invisible"
              } w-[3px] bg-transparent hover:bg-hover cursor-grab`}
              onMouseDown={(e) => handleDrag(e, "right")}
            />

            <div
              className={`${
                layoutState.right.width <= 50 ? "rounded-l" : "rounded-b-lg"
              } overflow-hidden bg-base min-h-0 flex flex-col relative`}
              ref={rightRef}
            >
              <Right
                fatherRef={rightRef}
                rightWidth={layoutState.right.width}
              />
            </div>
          </div>

          <div className="w-full">
            <AppFooter />
          </div>
        </div>
      </div>
      <Notification />
      <ModalListenFirst />
    </div>
  );
}
