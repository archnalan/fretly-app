import React, { useState } from "react";
import Navbar from "../User/Navbar/Navbar";
import Side from "./Sidebar/Side";
import { SidebarContext } from "../Contexts/SidebarContext";
import { Outlet } from "react-router-dom";
import classNames from "classnames";
import { useThemeContext } from "../Contexts/ThemeContext";

const AdminLayout: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [active, setActive] = useState<boolean>(false);
  const { theme } = useThemeContext();

  const lineClass = classNames({
    "border-t-2 border-neutral-600": theme === "dark",
  });

  return (
    <SidebarContext.Provider
      value={{ expanded, setExpanded, active, setActive }}
    >
      <div className="flex flex-col h-screen">
        {/* <div className="w-full z-100">
          <Navbar />
          <hr className={lineClass} />
        </div> */}
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`h-full transition-width duration-300 z-50 ${
              expanded ? "w-64" : "w-20"
            }`}
          >
            <Side />
          </div>
          <div className="flex-1 h-full overflow-y-auto z-0">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default AdminLayout;
