"use client";
import AppHeader from "@/components/header/app.header";
import * as React from "react";
import "./style.css";
import ScrollBar from "@/components/scroll/scroll";
import Menu from "@/components/menu/menu.admin";
import { CiMusicNote1 } from "react-icons/ci";
import { HiOutlineUpload } from "react-icons/hi";
import { BsPeople } from "react-icons/bs";

import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface ILayout {
  left: IPosition;
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
  const router = useRouter();

  const leftRef = React.useRef<HTMLDivElement>(null);
  const centerRef = React.useRef<HTMLDivElement>(null);

  const [leftWidth, setLeftWidth] = React.useState<number>(280);
  const [centerWidth, setCenterWidth] = React.useState<number | null>(null);
  const [screenWidth, setScreenWidth] = React.useState<number>(0);

  const hardCenterWidth = 500;

  // React.useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setScreenWidth(window.innerWidth);

  //     const handleResize = () => setScreenWidth(window.innerWidth);
  //     window.addEventListener("resize", handleResize);

  //     return () => window.removeEventListener("resize", handleResize);
  //   }
  // }, []);

  React.useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 900) {
        console.log(screenWidth - leftWidth - hardCenterWidth);
        const space = screenWidth - leftWidth - hardCenterWidth;
        if (space > 0) {
          setCenterWidth(
            hardCenterWidth + (screenWidth - leftWidth - hardCenterWidth)
          );
        } else {
          setCenterWidth(hardCenterWidth);
        }
      } else {
        setCenterWidth(null);
      }
    };

    window.addEventListener("resize", updateWidth);
    updateWidth(); // Gọi ngay lần đầu tiên khi component mount

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  React.useEffect(() => {
    console.log(centerRef);
  }, [centerRef]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="relative h-screen w-full">
        <div
          className={`grid ${
            screenWidth < 900
              ? "grid-rows-[auto_minmax(488px,1fr)_auto]"
              : "grid-rows-[auto_1fr_auto]"
          } bg-base h-screen `}
        >
          <div className="w-full bg-black">
            <AppHeader />
          </div>

          {/* Content */}
          <div
            className={`grid h-full bg-black text-white gap-[4px] min-h-[488px] px-2 `}
            style={{
              gridTemplateColumns: `${leftWidth}px ${
                centerWidth ? `${centerWidth}px` : "auto"
              }`,
            }}
          >
            <div
              className=" bg-base min-h-0 w-full overflow-hidden rounded-lg"
              ref={leftRef}
            >
              <ScrollBar fatherRef={leftRef}>
                <Menu
                  items={[
                    {
                      key: "track",
                      icon: <CiMusicNote1 size={20} />,
                      label: "Bài nhạc",
                      children: [
                        {
                          key: "upload",
                          icon: <HiOutlineUpload size={20} />,
                          label: <span>Tạo mới</span>,
                          onClick: () => router.push(`/admin/track/upload`),
                        },
                      ],
                    },
                    {
                      key: "artist",
                      icon: <BsPeople size={20} />,
                      label: "Ca sĩ",
                      children: [
                        {
                          key: "upload",
                          icon: <HiOutlineUpload size={20} />,
                          label: <span>Tạo mới</span>,
                          onClick: () => router.push(`/admin/artist/upload`),
                        },
                      ],
                    },
                  ]}
                />
              </ScrollBar>
            </div>

            {/* Center */}
            <div
              className="rounded-lg bg-base min-h-0 overflow-hidden "
              ref={centerRef}
            >
              {" "}
              <ScrollBar fatherRef={centerRef}>
                <div
                  className={`flex justify-center  w-full ${
                    screenWidth < 1200 ? " h-auto" : "h-full"
                  } text-white p-4 `}
                >
                  {children}
                </div>
              </ScrollBar>
            </div>

            {/* Thanh kéo giữa Center & Right */}
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
