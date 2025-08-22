import { ClearIcon } from "@mui/x-date-pickers";
import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
interface IProp {
  value?: string; // Có thể truyền vào giá trị ban đầu, nếu không thì mặc định là ""
  onChange?: (value: string) => void;
}

const SearchCustom: React.FC<IProp> = ({ value = "", onChange }) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    onChange?.(newValue); // Gọi onChange từ props nếu có
  };

  // Hàm xóa nội dung input và giữ focus
  const handleClear = () => {
    handleChange(""); // Gọi handleChange để xóa và cập nhật state
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="relative w-full group bg-base rounded-3xl group ">
        {/* Input */}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-3 px-14 bg-transparent relative z-10 rounded-3xl border border-transparent focus:border-white transition-all duration-300 outline-none"
        />

        {/* Icon */}
        <div className="text-white absolute top-1/2 left-4 transform -translate-y-1/2 opacity-50 cursor-pointer z-20 group-focus-within:opacity-100 transition-all duration-300">
          <CiSearch size={25} />
        </div>

        {/* Clear Icon chỉ hiển thị khi input có nội dung */}
        {inputValue && (
          <ClearIcon
            onMouseDown={(e: any) => e.preventDefault()} // Ngăn không để mất focus khi click
            onClick={handleClear}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-50 cursor-pointer z-20"
          />
        )}
      </div>
    </>
  );
};

export default SearchCustom;
