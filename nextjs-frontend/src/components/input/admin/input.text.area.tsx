import { useEffect, useRef, useState } from "react";
import "../style.input.text.css";

interface IInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  title: string;
  value?: string;
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

const ResizableTextField = (props: IInputProps) => {
  const { title, onChange, value = "", ...rest } = props;
  const [inputValue, setInputValue] = useState<string>(value);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue, e); // Cung cấp luôn event nếu cần
  };

  return (
    <div className="relative w-full group h-full">
      <textarea
        className="z-0 text-xs resize-none min-h-[48px] min-w-[200px] max-w-full max-h-full w-full h-full p-2 focus:border focus:border-white-06 outline-none text-white-06 rounded-lg bg-60 focus:bg-50"
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      <label
        className={`${
          isFocused ? " opacity-100" : "  opacity-0"
        } -top-2 z-[10] text-white-06 text-xs absolute left-4 transition-all duration-300  rosHlzYfiO0UfpmOhP4I `}
      >
        {title}
      </label>
    </div>
  );
};

export default ResizableTextField;
