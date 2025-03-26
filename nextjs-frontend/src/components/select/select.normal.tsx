import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface IProp {
  title: string;
  data: OptionType[];
  value?: OptionType | null; // ✅ Add value prop
  onChange?: (selected: OptionType | null) => void;
}

export interface OptionType {
  value: string;
  label: string;
}

const SelectNormal: React.FC<IProp> = ({ title, data, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: OptionType) => {
    onChange?.(option); // ✅ Only use onChange, no need to update state
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="border-white-06 h-[48px] gap-2 border rounded p-3 flex justify-between items-center cursor-pointer group hover:border-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white-06 group-hover:text-white">
          {value ? value.label : <div>{title}</div>} {/* ✅ Use value prop */}
        </span>
        <span className="text-white-06">
          <MdKeyboardArrowDown />
        </span>
      </div>

      {isOpen && (
        <ul className="absolute w-full bg-base border mt-1 shadow-lg rounded-md max-h-48 overflow-y-auto z-10">
          {data.length > 0 ? (
            data.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className="p-3 cursor-pointer hover:bg-hover"
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="p-3 text-white-06 text-center">Không có dữ liệu</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectNormal;
