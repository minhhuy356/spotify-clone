import React, { useState, useRef } from "react";
import { FaTrash } from "react-icons/fa";

export interface OptionType {
  index?: number;
  value: string;
  label: string;
}

type Type = "artist" | "none";

interface IProp {
  title: string;
  data: OptionType[];
  value: OptionType[]; // ✅ Nhận value từ component cha
  onChange?: (selected: OptionType[]) => void;
  type?: Type;
}

const SelectSearchable: React.FC<IProp> = ({
  title,
  data,
  value,
  onChange,
  type = "none",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (option: OptionType, index: number) => {
    if (type === "artist") {
      onChange?.([...value, { index: value.length, ...option }]); // ✅ Chỉ thêm nếu chưa quá 2 lần
    } else {
      if (!value?.some((item) => item.value === option.value)) {
        onChange?.([...value, option]); // ✅ Thêm option vào danh sách đã chọn
      }
    }

    setSearchTerm("");
    setIsFocused(false);
  };

  const handleRemove = (valueToRemove: string) => {
    const newSelectedItems = value.filter(
      (item) => item.value !== valueToRemove
    );
    onChange?.(newSelectedItems); // ✅ Cập nhật danh sách khi xóa
  };

  const filteredOptions = data.filter(
    (item) =>
      !value.find((selected) => selected.value === item.value) &&
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredData = data.filter((item) => {
    const count = value.filter(
      (selected) => selected.value === item.value
    ).length;
    return (
      count < 3 && item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const displayData = type === "artist" ? filteredData : filteredOptions;

  return (
    <div className="w-full flex flex-col  justify-end bg-inherit">
      <div className="relative w-full h-[48px] group bg-inherit">
        <fieldset
          className={`absolute top-0 left-0 w-full h-full border rounded transition-all bg-inherit ${
            isFocused
              ? "border-white ring-1 ring-white"
              : "group-hover:border-white border-white-06"
          }`}
        >
          <legend
            className={`absolute left-3 px-1 transition-all duration-200 bg-inherit ${
              isFocused || searchTerm
                ? "-top-3 text-xs text-white"
                : "top-3 text-white-06 text-sm group-hover:text-white"
            }`}
          >
            {title}
          </legend>
        </fieldset>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pt-3 pb-3 px-3 bg-transparent focus:outline-none relative"
        />

        {isFocused && (
          <div className="absolute w-full bg-base border-white border-solid border-[1px] rounded mt-1 max-h-40 overflow-y-auto z-1000">
            {displayData.length > 0 ? (
              displayData.map((option, index) => (
                <div
                  key={option.value}
                  onMouseDown={() => handleSelect(option, index)}
                  className="p-2 cursor-pointer hover:bg-hover last:border-none"
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-3 text-white-06 text-center">
                Không có dữ liệu
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hiển thị danh sách đã chọn */}
      <div
        className={`bg-base  w-full max-w-full overflow-y-auto flex flex-wrap gap-2 `}
      >
        {type === "none" && value.length > 0 && (
          <div className="flex gap-3 items-center py-3">
            {value.length > 0 && <span>Đã chọn {title.toLowerCase()}: </span>}
            {value.map((item) => {
              return (
                <div
                  key={item.value}
                  className="flex items-center p-2 rounded gap-2   "
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <button
                    onClick={() => handleRemove(item.value)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectSearchable;
