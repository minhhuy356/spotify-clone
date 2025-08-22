"use client";
import { IAlbum, ITrack } from "@/types/data";
import { useRef, useEffect, useState } from "react";

import SliderAlbumCard from "./slider.album.card";
import SliderTrackCard from "./slider.track.card";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

type TypeData = "playlist" | "track" | "album";

interface IProps {
  title?: string;
  header?: string;
  data: (ITrack | IAlbum)[];
  typeData: TypeData;
}

const Slider = ({ title, data, typeData, header }: IProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);

  useEffect(() => {
    if (itemRef.current) {
      const width = itemRef.current.offsetWidth;
      setItemWidth(width);
    }
  }, [data]); // Nếu data thay đổi thì đo lại

  const handleScroll = (direction: "left" | "right") => {
    if (!sliderRef.current || itemWidth === 0) return;
    const scrollAmount = direction === "left" ? -itemWidth * 5 : itemWidth * 5;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 20); // thay vì > 0

    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // trừ 1 để tránh float error
  };

  useEffect(() => {
    updateScrollButtons();
  }, [data, itemWidth]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      slider.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 pl-4 py-6 relative">
      {" "}
      <div className="flex flex-col">
        {" "}
        <h1 className=" text-xs text-white-06 font-bold ">{header}</h1>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
      </div>
      <div className="relative group/scroll">
        {/* Nút cuộn trái */}
        <button
          onClick={() => handleScroll("left")}
          className={`absolute z-10 left-0 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white 
                ${
                  canScrollLeft ? "group-hover/scroll:block" : "hidden"
                } hidden`}
        >
          <FaAngleLeft size={24} />
        </button>

        {/* Nút cuộn phải */}
        <button
          onClick={() => handleScroll("right")}
          className={`absolute z-10 right-0 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white 
                ${
                  canScrollRight ? "group-hover/scroll:block" : "hidden"
                } hidden`}
        >
          <FaAngleRight size={24} />
        </button>

        {/* Slider content */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth scrollbar-hide px-1"
          style={{
            scrollSnapType: "x mandatory",
          }}
        >
          {data.map((item, index) => {
            const key =
              typeData === "album"
                ? (item as IAlbum)._id
                : (item as ITrack)._id;

            return (
              <div
                key={key}
                ref={index === 0 ? itemRef : undefined}
                style={{ scrollSnapAlign: "start" }}
              >
                {typeData === "album" ? (
                  <SliderAlbumCard album={item as IAlbum} />
                ) : (
                  <SliderTrackCard track={item as ITrack} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Slider;
