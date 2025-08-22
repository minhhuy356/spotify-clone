import React, { HtmlHTMLAttributes, useState } from "react";
import { TFilterAlbum } from "../../page";
import { useAppSelector } from "@/lib/hook";
import { selectScrollCenter } from "@/lib/features/scroll-center/scroll-center.slice";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  typeFilter: TFilterAlbum;
  setTypeFilter: React.Dispatch<React.SetStateAction<TFilterAlbum>>;
}

const FilterRecentlyAlbum = ({ typeFilter, setTypeFilter }: IProps) => {
  const scrollCenter = useAppSelector(selectScrollCenter);

  return (
    <div
      className={`${
        scrollCenter.scroll > 0 && "bg-base"
      } py-4 text-sm flex gap-2 sticky top-0 px-4 z-100`}
    >
      <div
        onClick={() => setTypeFilter("all")}
        className={`${
          typeFilter === "all"
            ? "bg-white hover:bg-[#e7e7e7] text-black"
            : "bg-white-007 hover:bg-white-01"
        } px-4 py-2  w-fit rounded-full cursor-pointer`}
      >
        <p>Tất cả</p>
      </div>
      <div
        onClick={() => setTypeFilter("music")}
        className={`${
          typeFilter === "music"
            ? "bg-white hover:bg-[#e7e7e7] text-black"
            : "bg-white-007 hover:bg-white-01"
        } px-4 py-2 w-fit rounded-full cursor-pointer`}
      >
        <p>Nhạc</p>
      </div>
      <div
        onClick={() => setTypeFilter("postcast")}
        className={`${
          typeFilter === "postcast"
            ? "bg-white hover:bg-[#e7e7e7] text-black"
            : "bg-white-007 hover:bg-white-01"
        } px-4 py-2 w-fit rounded-full cursor-pointer`}
      >
        <p>Postcast</p>
      </div>
    </div>
  );
};

export default FilterRecentlyAlbum;
