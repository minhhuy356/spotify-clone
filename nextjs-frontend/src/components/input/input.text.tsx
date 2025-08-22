import React, { useRef, useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import "./style.input.text.css";

interface IProp {
  title: string;
  value?: string; // Giá trị có thể null, mặc định là ""
  onChange?: (value: string) => void;
  placeHolder?: string;
}

const InputTextField: React.FC<IProp> = ({
  title,
  value = "",
  onChange,
  placeHolder,
}) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Theo dõi khi prop `value` thay đổi từ bên ngoài
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    handleChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full group bg-inherit h-full">
      <fieldset
        className={` absolute top-0 left-0 w-full min-h-[48px] h-full  rounded-[0.3rem] transition-all ${
          isFocused
            ? "border-white-04 border bg-50"
            : "bg-60 border-0 border-transparent"
        } `}
      >
        <label
          className={`rosHlzYfiO0UfpmOhP4I  absolute left-3 px-1 transition-all duration-300 text-xs ${
            isFocused
              ? "  text-white-08 opacity-100 z-[10] "
              : " text-white-06  group-hover:text-white opacity-0"
          } -top-[8px]  font-bold`}
        >
          {title}
        </label>
      </fieldset>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={`${placeHolder ? placeHolder : ""}`}
        className="w-full py-3 px-3 bg-transparent relative z-10 focus:outline-none text-xs"
      />

      {/* {inputValue && (
        <ClearIcon
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-50 cursor-pointer z-20"
        />
      )} */}
    </div>
  );
};

export default InputTextField;
