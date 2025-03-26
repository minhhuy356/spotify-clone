import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { GrSort } from "react-icons/gr";
import { HiMenu } from "react-icons/hi";
const SearchSortLibrary = () => {
  const [isSearch, SetIsSearch] = useState<boolean>(false);

  return (
    <div className="flex justify-between  items-center relative ml-2">
      <div className="flex flex-1">
        <div
          className="absolute size-8 top-0 flex items-center z-[100] text-white  p-1 hover:bg-40 rounded-full cursor-pointer justify-center "
          onClick={() => SetIsSearch(!isSearch)}
        >
          <CiSearch size={20} />
        </div>
        <input
          className={`${
            isSearch ? "w-[88%] bg-40 rounded" : "w-0"
          } absolute z-10 top-0 pl-10 py-1 overflow-hidden transition-all duration-500 outline-0 line-clamp-1`}
          placeholder="Tìm kiếm trong thư viện"
        ></input>
      </div>
      <div className="flex gap-1 items-center text-white-06 h-8">
        <span className={`${isSearch && "hidden"}`}>Gần đây</span>
        <HiMenu size={20} />
      </div>
    </div>
  );
};

export default SearchSortLibrary;
