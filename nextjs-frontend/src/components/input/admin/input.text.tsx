import React, { useRef, useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import "../style.input.text.css";

interface IProp {
  title: string;
  value?: string; // Giá trị có thể null, mặc định là ""
  onChange?: (value: string) => void;
  placeHolder?: string;
}

const InputTextFieldForAdmin: React.FC<IProp> = ({
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
    <div className="relative w-full group bg-inherit h-full cursor-pointer">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full py-3 px-3 bg-transparent relative z-10 focus:outline-none border  rounded hover:border-white focus:border-white ${
          value ? "border-white" : "border-white-06"
        }`}
      />
      <div
        className={`${
          isFocused || value ? "-top-[8px] text-xs z-10" : "top-[12px]"
        } absolute left-3 fo bg-inherit  px-1 transition-all duration-150 text-white-06 group-hover:text-white`}
      >
        {" "}
        {title}
      </div>
    </div>
  );
};

export default InputTextFieldForAdmin;
