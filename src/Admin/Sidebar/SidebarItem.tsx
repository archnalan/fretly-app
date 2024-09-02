import React from "react";
import { useSidebarContext } from "../../Contexts/SidebarContext";
import { useThemeContext } from "../../Contexts/ThemeContext";

type ItemProps = {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
};

const SidebarItem: React.FC<ItemProps> = ({ icon, text, active, alert }) => {
  const { expanded } = useSidebarContext();
  const { theme } = useThemeContext();

  return (
    <li
      className={`relative flex items-center px-2 py-2 font-medium rounded cursor-pointer transition-colors duration-300 group z-[2] ${
        active
          ? `${
              theme === "dark"
                ? "bg-neutral text-primary"
                : "bg-gray-300 text-primary"
            }`
          : `${
              theme === "dark"
                ? "hover:bg-neutral text-gray-400"
                : "hover:bg-gray-200 text-gray-600"
            }`
      }`}
    >
      {icon}
      <span
        className={`flex items-center justify-between overflow-hidden transition-width duration-200 ${
          expanded ? "w-full ml-4" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded-full bg-primary ${
            expanded ? "" : "top-2 "
          }`}
        />
      )}
      {!expanded && (
        <div
          className={`
          absolute left-3/4 rounded-md px-2 py-1 ml-6
          bg-base-100 text-primary text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
