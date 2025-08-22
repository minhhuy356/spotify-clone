"use client";

import { useResponsiveBreakpoint } from "@/hooks/useResponsiveBreakpoint";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppSelector } from "@/lib/hook";
import {
  IRecentlyItem,
  listening_historys_service,
} from "@/service/listening-historys.service";
import { HtmlHTMLAttributes, useEffect, useState } from "react";
import RecentlyAlbumCard from "./recently.album.card";
import RecentlyArtistCard from "./recently.artist.card";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  recently: IRecentlyItem[];
  setRecently: React.Dispatch<React.SetStateAction<IRecentlyItem[]>>;
}

const Recently = ({ recently, setRecently }: IProps) => {
  const session = useAppSelector(selectSession);

  const { ref: wrapperRef, breakpoint } = useResponsiveBreakpoint();

  const getRecently = async () => {
    if (!session) return;
    const data = await listening_historys_service.getRecently(
      session.access_token
    );
    if (data) {
      setRecently(data);
    }
  };

  useEffect(() => {
    getRecently();
  }, [session]);

  if (!session) return null;

  return (
    <div className="flex flex-col gap-4 py px-4" ref={wrapperRef}>
      {/* Recently grid */}
      <div
        className={`grid gap-2 w-full ${
          breakpoint.below650
            ? "grid-cols-2 grid-rows-4"
            : "grid-cols-4 grid-rows-2"
        }`}
      >
        {recently.map((item) => {
          if (item.type === "album") {
            return (
              <RecentlyAlbumCard
                key={item.data._id}
                album={item.data}
                session={session}
                breakpoint={breakpoint}
              />
            );
          }
          if (item.type === "artist") {
            return (
              <RecentlyArtistCard
                key={item.data._id}
                artist={item.data}
                session={session}
                breakpoint={breakpoint}
              />
            );
          }
          return null; // track sẽ làm sau nếu cần
        })}
      </div>
    </div>
  );
};

export default Recently;
