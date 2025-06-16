import { hardLeftWidth } from "@/app/layout";
import { FaArrowRight } from "react-icons/fa";
import ChooseLibrary from "./left.chose-library";
import SearchSortLibrary from "./left.search-sort";
import { ChooseLibraryBy } from "../left.main";
import { IoIosAdd } from "react-icons/io";
import DialogCreateFolder from "@/components/dialog/dialog.create-folder";
import { setOpenDialogCreateFolder } from "@/lib/features/local/local.slice";
import { useAppDispatch } from "@/lib/hook";
import { useRef, useState } from "react";

interface IProps {
  leftWidth: number;
  headerRef?: React.RefObject<HTMLDivElement | null>;
  chooseLibraryBy: ChooseLibraryBy;
  setChooseLibraryBy: (value: ChooseLibraryBy) => void;
}

const LeftHeader = ({
  headerRef,
  leftWidth,
  chooseLibraryBy,
  setChooseLibraryBy,
}: IProps) => {
  const dispatch = useAppDispatch();
  const [isDislogCreateFolderOpen, setIsDislogCreateFolderOpen] =
    useState<boolean>(false); // Trạng thái menu
  const buttonCreateFolderRef = useRef<HTMLDivElement | null>(null);

  const handleOpenDialogCreateFolder = (event: React.MouseEvent) => {
    const position = {
      x: event.clientX,
      y: event.clientY,
    };
    setIsDislogCreateFolderOpen(!isDislogCreateFolderOpen);
    dispatch(
      setOpenDialogCreateFolder({
        isOpenDialogCreateFolder: !isDislogCreateFolderOpen,
        position,
      })
    );
  };

  return (
    <div className="py-4 px-4 flex flex-col gap-4 " ref={headerRef}>
      <div className=" flex top-0 z-10 bg-base overflow-hidden text-white-06 justify-between items-center mb-2">
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

        <div
          className={`${
            leftWidth < hardLeftWidth ? "hidden" : ""
          } flex items-center gap-4 `}
          onClick={(e) => handleOpenDialogCreateFolder(e)}
        >
          <div
            className=" gap-[4px]  flex items-center xl:px-4 xl:py-2  p-2  bg-40 rounded-full cursor-pointer "
            ref={buttonCreateFolderRef}
            onClick={() => setIsDislogCreateFolderOpen(true)}
          >
            <IoIosAdd
              size={20}
              className={`scale-150 ${
                isDislogCreateFolderOpen
                  ? "rotate-45 text-green-500"
                  : "rotate-0"
              } transition-all duration-300`}
            />
            <span className="text-white xl:block hidden">Tạo </span>
          </div>
          {/* <FaArrowRight size={20} /> */}
        </div>
      </div>
      {!(leftWidth < hardLeftWidth) && (
        <>
          <ChooseLibrary
            chooseLibraryBy={chooseLibraryBy}
            setChooseLibraryBy={setChooseLibraryBy}
          />
          <SearchSortLibrary />
        </>
      )}

      <DialogCreateFolder
        anchorRef={buttonCreateFolderRef}
        isOpen={isDislogCreateFolderOpen}
        setIsOpen={setIsDislogCreateFolderOpen}
      />
    </div>
  );
};

export default LeftHeader;
