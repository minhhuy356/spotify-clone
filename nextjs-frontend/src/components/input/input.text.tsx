import React, { useRef, useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";

interface IProp {
  title: string;
  value?: string; // Giá trị có thể null, mặc định là ""
  onChange?: (value: string) => void;
}

const InputTextField: React.FC<IProp> = ({ title, value = "", onChange }) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [isFocused, setIsFocused] = useState<boolean>(false);
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
    <div className="relative w-full group bg-inherit">
      <fieldset
        className={`border-white-06 group-hover:border-white absolute top-0 left-0 w-full h-[48px] border rounded-md transition-all bg-inherit ${
          isFocused
            ? "border-white ring-2 ring-white"
            : "border-input-boder-color"
        }`}
      >
        <legend
          className={`absolute left-3 px-1 transition-all bg-inherit ${
            isFocused || inputValue
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
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full py-3 px-3 bg-transparent relative z-10 focus:outline-none"
      />

      {inputValue && (
        <ClearIcon
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-50 cursor-pointer z-20"
        />
      )}
    </div>
  );
};

export default InputTextField;
