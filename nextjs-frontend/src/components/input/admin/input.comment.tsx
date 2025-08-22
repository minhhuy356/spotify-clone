import React, { useEffect, useRef, useState } from "react";
import { MdOutlineInsertEmoticon } from "react-icons/md";

interface IProp {
  value?: string; // Có thể truyền vào giá trị ban đầu, nếu không thì mặc định là ""
  onChange?: (value: string) => void;
}

const InputCommentCustom: React.FC<IProp> = ({ value = "", onChange }) => {
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

  const handleCancel = () => {
    setInputValue("");
    setIsFocused(false);
  };

  return (
    <>
      {/* Input */}

      <div className="flex flex-col w-full gap-4">
        <div className="relative w-full">
          <input
            className="outline-none h-12 w-full px-4 text-lg border-b-2 border-gray-300 duration-500 transition-all"
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />

          {/* underline animation */}
          <div
            className={`absolute left-1/2 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 transform -translate-x-1/2 ${
              isFocused ? "w-full" : ""
            }`}
          ></div>
        </div>

        <div className={`${isFocused ? "flex" : "hidden"} justify-between `}>
          <div>
            <MdOutlineInsertEmoticon size={25} />
          </div>
          <div className="flex gap-4 text-[14px]/[36px] font-medium">
            <div>
              <button
                className="rounded-3xl px-4 bg-white hover:bg-slate-200"
                onClick={() => handleCancel()}
              >
                Hủy
              </button>
            </div>

            <div>
              <button
                className={`rounded-3xl  px-4  ${
                  inputValue
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 opacity-50 "
                }`}
                disabled={!inputValue}
              >
                Bình luận
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InputCommentCustom;
