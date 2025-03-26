import { hardLeftWidth } from "@/app/layout";
import { FaArrowRight } from "react-icons/fa";
import ChooseLibrary from "./left.chose-library";
import SearchSortLibrary from "./left.search-sort";

interface IProps {
  leftWidth: number;
  headerRef?: React.RefObject<HTMLDivElement | null>;
}

const LeftHeader = ({ headerRef, leftWidth }: IProps) => {
  return (
    <div className="py-4 px-2 flex flex-col gap-4 ">
      <div
        className=" flex top-0 z-10 bg-base overflow-hidden text-white-06 justify-between items-center mb-2"
        ref={headerRef}
      >
        <div className="flex gap-1 w-full relative">
          <div
            className={`w-fit rounded-full text-black border-solid border-black cursor-pointer flex ${
              leftWidth < hardLeftWidth ? "flex-1 justify-center" : "me-3"
            } `}
          >
            <svg
              data-encore-id="icon"
              role="img"
              aria-hidden="true"
              className="fill-[rgb(179,179,179,1)] w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"></path>
            </svg>
          </div>
          <div className={`${leftWidth < hardLeftWidth ? "hidden" : "flex"}`}>
            <span className="font-semibold ">Thư viện</span>
          </div>
        </div>

        <div className={`${leftWidth < hardLeftWidth ? "hidden" : ""}`}>
          <FaArrowRight />
        </div>
      </div>
      {!(leftWidth < hardLeftWidth) && (
        <>
          <ChooseLibrary />
          <SearchSortLibrary />
        </>
      )}
    </div>
  );
};

export default LeftHeader;
