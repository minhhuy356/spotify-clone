import { useEffect, useRef, useState } from "react";

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
    <div className="relative w-full group bg-inherit">
      <textarea
        className="min-h-[48px] min-w-[200px] max-w-full max-h-full w-full h-[96px] p-2 border border-white-06 hover:border-white text-white-06 rounded-lg resize bg-base"
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      <div
        className={`${
          isFocused || value
            ? "-top-2 text-xs text-white px-1"
            : "top-3 text-white-06"
        } absolute left-4 transition-all duration-100 bg-inherit`}
      >
        <span>{title}</span>
      </div>
    </div>
  );
};

export default ResizableTextField;
