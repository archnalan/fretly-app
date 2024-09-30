import React, { useEffect, useState } from "react";
import { LuChevronFirst, LuChevronLast, LuMoreVertical } from "react-icons/lu";
import { BiSolidDashboard } from "react-icons/bi";
import { useSidebarContext } from "../../Contexts/SidebarContext";
import {
  PassPhoto,
  T_dark,
  T_day,
  logo_dark,
  logo_light,
} from "../../assets/NavAssets";
import { useThemeContext } from "../../Contexts/ThemeContext";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { ImMenu3, ImMenu4 } from "react-icons/im";
import { getValidatedTheme } from "../../DataModels/ThemeModel";

type sideProps = {
  children: React.ReactNode;
  activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
};

const Sidebar: React.FC<sideProps> = ({
  children,
  activeItem,
  setActiveItem,
}) => {
  const { expanded, setExpanded } = useSidebarContext();
  const { theme, setTheme } = useThemeContext();
  const navigate = useNavigate();
  const { setActive } = useSidebarContext();

  useEffect(() => {
    //activate based on the url
    const path = location.pathname.split("/")[2];

    if (path === "dashboard") {
      setActiveItem("dashboard");
      setActive(true);
    }
  }, [location]);

  const toggleTheme = () => {
    const currentTheme = getValidatedTheme();
    const newTheme = currentTheme === "autumn" ? "dark" : "autumn";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const dashboardClass = classNames(
    "p-4 pb-2 flex justify-between items-center",
    {
      "bg-neutral text-primary": activeItem === "dashboard" && theme === "dark",
      "bg-gray-300 text-primary":
        activeItem === "dashboard" && theme !== "dark",
      "hover:bg-neutral text-gray-400":
        activeItem !== "dashboard" && theme === "dark",
      "hover:bg-gray-200 text-gray-600":
        activeItem !== "dashboard" && theme !== "dark",
    }
  );

  const lineClass = classNames({
    "border-t-2 border-neutral-800": theme === "dark",
  });

  return (
    <aside className="h-full z-50 w-full bg-base-100">
      <nav className="h-full flex flex-col relative   shadow-sm">
        <div className={dashboardClass}>
          {/* <div
            className={`flex items-center ${
              expanded ? "w-full" : "w-0"
            } transition-width duration-300 cursor-pointer overflow-hidden`}
            onClick={() => {
              setActiveItem("dashboard");
              setActive(true);
              navigate("/admin/dashboard");
            }}
          >
            <BiSolidDashboard size={30} className="mr-3" />
            <div className="px-2 py-2 font-medium rounded transition-colors duration-300 group">
              <h5>Dashboard</h5>
            </div>
          </div> */}
          <div
            className={`flex items-center ${
              expanded ? "w-full" : "w-0"
            } transition-width duration-300 cursor-pointer overflow-hidden`}
          >
            <div className="">
              <img
                src={theme === "dark" ? logo_dark : logo_light}
                alt="logo"
                className="w-36 cursor-context-menu"
              />
            </div>
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="btn btn-light p-1.5 px-3 rounded-mid"
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>
        <hr className={lineClass} />

        <ul className="flex-grow list-none">{children}</ul>

        <div
          className={`border-t  flex p-3 bg-base-100 ${
            theme === "dark" ? "border-t-neutral" : ""
          } `}
        >
          <div
            className={`hidden md:flex dropdown dropdown-right dropdown-top ${
              theme === "dark" ? "text-neutral-300" : "text-dark"
            }`}
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={PassPhoto} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow border"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li className="hidden md:flex mr-4" onClick={toggleTheme}>
                <a className="justify-between">
                  Theme
                  <img
                    src={theme === "dark" ? T_day : T_dark}
                    alt="toggle theme"
                    className="w-5 cursor-pointer"
                  />
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
          <div
            className={`${
              expanded ? "w-full ml-4" : "w-0"
            } transition-width duration-300 overflow-hidden`}
          >
            <div className="flex items-center truncate">
              <div className="flex flex-col">
                <h4 className="font-semibold">Nalan</h4>
                <span className="text-gray-500 text-sm">
                  archnalan@gmail.com
                </span>
              </div>
              {/* <LuMoreVertical size={30} /> */}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
