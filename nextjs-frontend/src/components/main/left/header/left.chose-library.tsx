import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SearchSortLibrary from "./left.search-sort";

const ChooseLibrary = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setStartScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Cập nhật trạng thái nút cuộn
  useEffect(() => {
    const updateArrowVisibility = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        console.log(scrollLeft <= 0);
        setAtStart(scrollLeft <= 0);
        setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
      }
    };

    updateArrowVisibility();
    sliderRef.current?.addEventListener("scroll", updateArrowVisibility);
    window.addEventListener("resize", updateArrowVisibility);

    return () => {
      sliderRef.current?.removeEventListener("scroll", updateArrowVisibility);
      window.removeEventListener("resize", updateArrowVisibility);
    };
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full  cursor-grab ">
      {/* Nút cuộn trái */}

      <button
        className={`  ${
          !atStart
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } transition-all duration-300 absolute left-[-1px] top-1/2 -translate-y-1/2 bg-40 text-white p-2 rounded-full shadow-md z-[1000] cursor-pointer`}
        onClick={scrollLeft}
      >
        <IoIosArrowBack />
      </button>

      {/* Container cuộn ngang */}
      <div
        ref={sliderRef}
        className="overflow-x-hidden rounded-full flex gap-2 items-center scrollbar-hide "
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div className="py-1 px-3 bg-40 text-white rounded-full cursor-pointer whitespace-nowrap">
          <span>Danh sách phát</span>
        </div>
        <div className="py-1 px-3 bg-40 text-white rounded-full cursor-pointer whitespace-nowrap">
          <span>Nghệ sĩ</span>
        </div>
        <div className="py-1 px-3 bg-40 text-white rounded-full cursor-pointer whitespace-nowrap">
          <span>Album</span>
        </div>{" "}
        {!atStart && (
          <div
            className={`absolute left-0 w-[66px] h-full bg-gradient-to-r from-black to-transparent rounded-full`}
          ></div>
        )}{" "}
        {!atEnd && (
          <div
            className={`absolute right-0 w-[66px] h-full bg-gradient-to-l from-black to-transparent rounded-full`}
          ></div>
        )}
      </div>

      {/* Nút cuộn phải */}

      <button
        className={`${
          !atEnd
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } transition-all duration-300 absolute right-[-1px] top-1/2 -translate-y-1/2 bg-40 text-white p-2 rounded-full shadow-md z-[1000] overflow-hidden cursor-pointer`}
        onClick={scrollRight}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default ChooseLibrary;
