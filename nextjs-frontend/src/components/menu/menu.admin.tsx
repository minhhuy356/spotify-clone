"use client";
import { useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface MenuItem {
  key: string;
  icon?: ReactNode;
  label: string | ReactNode;
  children?: MenuItem[];
  onClick?: () => void;
}

interface MenuProps {
  items: MenuItem[];
}

interface SelectedKey {
  parent: string | null;
  child?: string | null;
}

const Menu: React.FC<MenuProps> = ({ items = [] }) => {
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<SelectedKey>({
    parent: null,
    child: null,
  });
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const parentKey = pathSegments[1] || null;
    const childKey = pathSegments[2] || null;

    setSelectedKey({ parent: parentKey, child: childKey });

    if (parentKey) {
      setOpenKeys((prev) => {
        const newSet = new Set(prev);
        if (parentKey) newSet.add(parentKey);
        return newSet;
      });
    }
  }, [pathname]);

  return (
    <div className="py-4">
      <div className="flex flex-col px-2">
        {items.map((menuItem) => {
          const isOpen = openKeys.has(menuItem.key);
          const isParentSelected = selectedKey.parent === menuItem.key;

          return (
            <div key={menuItem.key}>
              <div
                className={`flex justify-between items-center cursor-pointer py-3 px-4 rounded-sm mb-1 ${
                  isParentSelected && !menuItem.children
                    ? "bg-selected"
                    : "hover:bg-hover"
                }`}
                onClick={() => {
                  setOpenKeys((prev) => {
                    const newSet = new Set(prev);
                    if (isOpen) {
                      newSet.delete(menuItem.key); // Đóng nếu nó đang mở
                    } else {
                      newSet.add(menuItem.key); // Mở nhưng không đóng các menu cha khác
                    }
                    return newSet;
                  });

                  if (!menuItem.children) {
                    setSelectedKey({ parent: menuItem.key, child: null });
                    menuItem.onClick && menuItem.onClick();
                  }
                }}
              >
                <div className="flex gap-4 items-center opacity-90">
                  {menuItem.icon && <span>{menuItem.icon}</span>}
                  <div>{menuItem.label}</div>
                </div>
                {menuItem.children && (
                  <motion.span
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <IoIosArrowDown />
                  </motion.span>
                )}
              </div>

              {menuItem.children && (
                <div
                  className={`pl-4 overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 scale-y-100" : "max-h-0 scale-y-50"
                  }`}
                >
                  {menuItem.children.map((subItem, index) => {
                    const isSelected =
                      isParentSelected && selectedKey.child === subItem.key;

                    return (
                      <div
                        key={subItem.key}
                        className={`flex justify-between items-center py-3 px-4 cursor-pointer group rounded-sm ${
                          isSelected ? "bg-selected" : "hover:bg-hover"
                        } ${
                          index + 1 === menuItem.children?.length ? "mb-1" : ""
                        }`}
                        onClick={() => {
                          setSelectedKey({
                            parent: menuItem.key,
                            child: subItem.key,
                          });

                          subItem.onClick && subItem.onClick();
                        }}
                      >
                        <div className="flex gap-4 items-center">
                          {subItem.icon && <span>{subItem.icon}</span>}
                          <div>{subItem.label}</div>
                        </div>
                        <div className="group-hover:block hidden">
                          <MdOutlineKeyboardArrowRight size={20} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
