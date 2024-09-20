import React, { useEffect, useRef, useState } from "react";
import { RiMoreFill, RiStickyNoteAddFill } from "react-icons/ri";
import { FiList, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { Link, Outlet } from "react-router-dom";
/* import Pagination from "../../Helper/Pagination"; */
import { PageModel, PageSchema } from "../../DataModels/PageModel";
import PageRequest from "../../API/PageRequest";
import PageDelete from "./PageDelete";
import { Theme, useThemeContext } from "../../Contexts/ThemeContext";
import Pagination from "../../Helper/Pagination";
import PageCards from "./pageCards";

const Page: React.FC = () => {
  const [pages, setPages] = useState<PageModel[]>([]);
  const { theme, setTheme } = useThemeContext();
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [toDelete, setToDelete] = useState<PageModel[]>([]);
  const [newList, setNewList] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pagesPerPage] = useState(5);
  const [selectedPages, setSelectedPages] = useState<PageModel[]>([]);

  const [filteredPages, setfilteredPages] = useState<PageModel[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getPages = async () => {
      try {
        const response = await PageRequest.fetchAllPages();

        const validatedSong = PageSchema.array().safeParse(
          response.data.$values
        );
        if (!validatedSong.success) {
          console.error("validation Error", validatedSong.error.issues);
          return;
        }
        if (validatedSong.success || newList) {
          setPages(validatedSong.data);
          setfilteredPages(validatedSong.data);
        }
      } catch (error) {
        console.error("🚀 ~ getPages ~ validatedSong.error:", error);
      }
    };
    getPages();
  }, [newList]);

  useEffect(() => {
    // Fetch theme from local storage
    const storedTheme = localStorage.getItem("theme");

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
  }, [theme]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (pages) {
        const searchResult = pages.filter(
          (page) =>
            String(page.id).includes(searchQuery) ||
            String(page.sorting).includes(normalizedQuery) ||
            page.title.toLowerCase().includes(searchQuery) ||
            page.slug?.toLowerCase().includes(searchQuery) ||
            page.content.toLowerCase().includes(searchQuery)
        );
        setfilteredPages(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredPages(pages);
    }
  };

  const handleDelete = (name: string, id: number) => {
    const deletePage = async () => {
      try {
        const response = await PageRequest.deletePage(id);

        console.log("🚀 ~ deletePage ~ response:", response);

        setNewList(name);
        /* window.location.reload(); */
      } catch (error) {
        console.error("Error deleting Page", error);
        setOpenConfirm(false);
        setErrorDelete(`${name} could not be deleted. Try Again!`);
      }
    };
    deletePage();
  };

  const handleSearchInput = () => {
    inputRef.current?.focus();
  };

  const handleSelectPage = (page: PageModel, isChecked: boolean) => {
    setSelectedPages((prevSelectedPages) =>
      isChecked
        ? [...prevSelectedPages, page]
        : prevSelectedPages.filter((p) => p.id !== page.id)
    );
  };

  const handlePageChange = (selected: number) => {
    setCurrentPageIndex(selected);
  };
  const pageCount = Math.ceil(filteredPages.length / pagesPerPage);
  const offset = currentPageIndex * pagesPerPage;
  const currentPages = filteredPages.slice(offset, offset + pagesPerPage);

  return (
    <>
      <div className="w-full h-full overflow-y-scroll relative ">
        <div
          className={`${
            theme === "dark" ? "text-neutral-300" : "text-dark"
          } flex flex-col justify-start items-center bg-base-100 h-full`}
        >
          <h2 className="m-3 text-3xl mt-5">List of Pages</h2>
          {errorDelete && (
            <div
              className="w-3/4 alert alert-error text-wraptransition-transform duration-500 transform translate-y-0"
              role="alert"
              style={{ transition: "transform 0.5s" }}
            >
              {errorDelete}
            </div>
          )}
          <div className="w-3/4 rounded-xl bg-base-100 shadow-md p-3 mb-2">
            <div className="flex justify-between ">
              <div className="flex w-1/2 justify-start items-center relative me-5">
                <input
                  ref={inputRef}
                  type="text"
                  className="h-full input input-bordered w-full pl-10 rounded-md"
                  placeholder="find a page..."
                  onChange={handleSearch}
                />
                <button
                  className="btn btn-link absolute border-none"
                  onClick={handleSearchInput}
                >
                  <IoSearchOutline size={20} />
                </button>
              </div>
              <Link to="/admin/pages/create" className="btn btn-neutral">
                <RiStickyNoteAddFill />
              </Link>
            </div>
          </div>
          <div className="w-3/4 px-5 ">
            {/* <PageCards
              setOpenConfirm={setOpenConfirm}
              pageList={currentPages}
              setToDelete={setToDelete}
            /> */}
          </div>

          <div className="w-3/4 ">
            <table className="table w-full">
              <thead
                className={`${
                  theme === "dark" ? "text-neutral-300" : ""
                } text-xl`}
              >
                <tr>
                  <th>
                    {selectedPages.length > 0 && (
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => {
                          setToDelete(selectedPages);
                          setOpenConfirm(true);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </th>
                  {/* <th className="col-number">ID</th> */}
                  <th className="col-title">Title</th>
                  <th className="col-category">Content</th>
                  <th className="col-author">Sorting</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPages.map((page) => (
                  <tr key={page.id} className="items-center">
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={selectedPages.some((p) => p.id === page.id)}
                          onChange={(e) =>
                            handleSelectPage(page, e.target.checked)
                          }
                        />
                      </label>
                    </td>
                    {/* <td>{String(page.id).padStart(3, "0")}</td> */}
                    <td>{page.title}</td>
                    <td>{page.content}</td>
                    <td>{page.sorting}</td>
                    <td>
                      <div className="dropdown dropdown-right ">
                        <button
                          tabIndex={0}
                          className="btn btn-ghost btn-circle"
                        >
                          <RiMoreFill size={24} />
                        </button>
                        <ul
                          tabIndex={1}
                          className="dropdown-content menu menu-compact bg-base-100 rounded-box w-52 shadow absolute right-0 mt-2 z-1"
                        >
                          <li className="w-full">
                            <Link
                              to={`${page.id}`}
                              className="me-2 flex items-center"
                            >
                              <FiList className="mr-2" /> Details
                            </Link>
                          </li>
                          <li className="w-full">
                            <Link
                              to={`edit/${page.id}`}
                              className="me-2 flex items-center justify-start"
                            >
                              <FiEdit className="mr-2" /> Edit
                            </Link>
                          </li>
                          <li className="w-full">
                            <button
                              className="btn btn-error btn-sm bg-opacity-75 flex items-center justify-start"
                              onClick={() => {
                                setToDelete([...toDelete, page]);
                                setOpenConfirm(true);
                              }}
                            >
                              <FiTrash2 className="mr-2" /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentPages.length == 0 && (
              <pre className="w-full h-full flex justify-center items-center">
                <span className="loading loading-spinner text-info loading-lg"></span>
              </pre>
            )}
          </div>
          <div className="flex justify-center fixed bottom-5 bg-base-150 shadow-md rounded-xl border">
            <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
          {openConfirm && toDelete.length > 0 && (
            <PageDelete
              todelete={toDelete}
              setOpenConfirm={setOpenConfirm}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
