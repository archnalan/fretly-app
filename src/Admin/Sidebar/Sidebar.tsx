import React from "react";
import { LuChevronFirst, LuChevronLast, LuMoreVertical } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { useSidebarContext } from "../../Contexts/SidebarContext";
import { PassPhoto } from "../../assets/NavAssets";
import { useThemeContext } from "../../Contexts/ThemeContext";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

type sideProps = {
  children: React.ReactNode;
};

const Sidebar: React.FC<sideProps> = ({ children }) => {
  const { expanded, setExpanded } = useSidebarContext();
  const { active, setActive } = useSidebarContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  const dashboardClass = classNames(
    "p-4 pb-2 flex justify-between items-center",
    {
      "bg-neutral text-primary": active && theme === "dark",
      "bg-gray-300 text-primary": active && theme !== "dark",
      "hover:bg-neutral text-gray-400": !active && theme === "dark",
      "hover:bg-gray-200 text-gray-600": !active && theme !== "dark",
    }
  );

  const lineClass = classNames({
    "border-t-2 border-neutral-800": theme === "dark",
  });

  return (
    <aside className="h-full z-50 w-full bg-base-100">
      <nav className="h-full flex flex-col relative   shadow-sm">
        <div
          className={dashboardClass}
          onClick={() => {
            setActive(true);
            navigate("/admin/dashboard");
          }}
        >
          <div
            className={`flex items-center ${
              expanded ? "w-full" : "w-0"
            } transition-width duration-300 cursor-pointer overflow-hidden`}
          >
            <RxDashboard size={30} className="mr-3" />
            <div className="px-2 py-2 font-medium rounded transition-colors duration-300 group">
              <h5>Dashboard</h5>
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
          <img
            src={PassPhoto}
            alt="profile"
            className="rounded-full"
            style={{ width: "40px", height: "40px" }}
          />
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
              <div className="">
                <LuMoreVertical size={30} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
