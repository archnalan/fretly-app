import { useState, useEffect, useRef } from "react";
import { ImMenu3 } from "react-icons/im";
import { ImMenu4 } from "react-icons/im";
import {
  PassPhoto,
  Search_dark,
  Search_light,
  T_dark,
  T_day,
  logo_dark,
  logo_light,
} from "../../assets/NavAssets";
import PageRequest from "../../API/PageRequest";
import { PageModel, PageSchema } from "../../DataModels/PageModel";
import { Theme, useThemeContext } from "../../Contexts/ThemeContext";
import { getValidatedTheme } from "../../DataModels/ThemeModel";

const Navbar = () => {
  const [pages, setPages] = useState<PageModel[]>([]);
  const [active, setActive] = useState("");
  const { theme, setTheme } = useThemeContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [toggle, setToggle] = useState(false);

  const toggleTheme = () => {
    const currentTheme = getValidatedTheme();
    const newTheme = currentTheme === "autumn" ? "dark" : "autumn";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
    //save new theme in local storage
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    // Fetch theme from local storage
    const storedTheme = getValidatedTheme();

    if (storedTheme) {
      // Apply the stored theme
      document.documentElement.setAttribute("data-theme", storedTheme);
      setTheme(storedTheme as Theme);
    } else {
      // Set initial theme based on system preference or default
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = prefersDarkMode ? "dark" : "autumn";
      document.documentElement.setAttribute("data-theme", initialTheme);
      setTheme(initialTheme);
    }

    const fetchPages = async () => {
      try {
        const response = await PageRequest.fetchAllPages();
        const pageResult = PageSchema.array().safeParse(response.data.$values);

        if (!pageResult.success) {
          console.error(
            "🚀 ~ fetchPages ~ pageResult.error:",
            pageResult.error
          );
        } else {
          setPages(pageResult.data.slice(0, 4)); // the first 4 pages from the db
        }
      } catch (error) {
        console.error("🚀 ~ fetchPages ~ error:", error);
      }
    };

    fetchPages();
  }, [setTheme]);

  const handleRefInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full h-fit flex items-center justify-between navbar bg-base-100 transition duration-500 z-[999] ">
      <div className="flex-1">
        <a href="/" className="btn btn-link text-xl">
          <img
            src={theme === "dark" ? logo_dark : logo_light}
            alt="logo"
            className="w-36 cursor-pointer"
          />
        </a>
      </div>
      <div className="mr-4">
        <ul className="hidden space-x-4 list-none md:flex flex-row gap-10  ">
          {pages.map((page) => (
            <li
              key={page.id}
              className={`${
                active === page.title
                  ? `${
                      theme === "dark" ? "text-neutral-content" : "text-neutral"
                    }`
                  : `${theme === "dark" ? "text-white" : "text-ghost"}`
              } hover:text-neutral-500 text-lg cursor-pointer`}
              onClick={() => {
                setActive(page.title);
                if (typeof window !== undefined) {
                  window.scrollTo(0, 0);
                }
              }}
            >
              <a href={`#${page.slug}`}>{page.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-fit flex items-center bg-neutral rounded-full px-4 py-2 h-11">
        <input
          ref={inputRef}
          type="text"
          placeholder="search"
          className="w-full bg-transparent border-0 outline-none text-white placeholder-white placeholder-opacity-50 max-w-xs"
        />
        <img
          src={theme === "dark" ? Search_dark : Search_light}
          alt="search icon"
          className="w-5 cursor-pointer"
          onClick={handleRefInput}
        />
      </div>
      <div className="hidden md:flex mr-4">
        <img
          onClick={toggleTheme}
          src={theme === "dark" ? T_day : T_dark}
          alt="toggle theme"
          className="w-12 cursor-pointer ml-6"
        />
      </div>
      <div className="hidden md:flex dropdown dropdown-end">
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
          className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
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
      <div className="md:hidden flex flex-1 justify-end items-center">
        {toggle ? (
          <ImMenu3 size={30} onClick={() => setToggle(!toggle)} />
        ) : (
          <ImMenu4 size={30} onClick={() => setToggle(!toggle)} />
        )}
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-5 shadow absolute top-10 right-0 mx-4 my-2 min-w-[140px] `}
        >
          <div className="mr-4">
            <ul className="list-none flex justify-end flex-col gap-4 ">
              {pages.map((page) => (
                <li
                  key={page.id}
                  className={`${
                    active === page.title
                      ? `${
                          theme === "dark"
                            ? "text-neutral-content"
                            : "text-neutral"
                        }`
                      : `${theme === "dark" ? "text-white" : "text-ghost"}`
                  } font-poppins text-[1rem]  text-lg cursor-pointer`}
                  onClick={() => {
                    setActive(page.title);
                    setToggle(!toggle);
                  }}
                >
                  <a href={`#${page.slug}`}>{page.title}</a>
                </li>
              ))}
            </ul>

            <div className="flex justify-start dropdown dropdown-left">
              <div className="flex items-center">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-7 rounded-full">
                    <img alt="Tailwind CSS Navbar component" src={PassPhoto} />
                  </div>
                </div>

                <a
                  className="cursor-pointer hover:text-neutral-content"
                  onClick={() => setToggle(!toggle)}
                >
                  Profile
                </a>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
