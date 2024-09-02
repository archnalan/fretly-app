import React, { useEffect, useRef, useState } from "react";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { FiList, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { Link, Outlet } from "react-router-dom";
/* import Pagination from "../../Helper/Pagination"; */
import { PageModel, PageSchema } from "../../DataModels/PageModel";
import PageRequest from "../../API/PageRequest";
import PageDelete from "./PageDelete";
import { Theme, useThemeContext } from "../../Contexts/ThemeContext";
import Pagination from "../../Helper/Pagination";

const Page: React.FC = () => {
  const [pages, setPages] = useState<PageModel[]>([]);
  const { theme, setTheme } = useThemeContext();
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [toDelete, setToDelete] = useState<PageModel | undefined>(undefined);
  const [newList, setNewList] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pagesPerPage] = useState(7);

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

  const handlePageChange = (selected: number) => {
    setCurrentPageIndex(selected);
  };
  const pageCount = Math.ceil(filteredPages.length / pagesPerPage);
  const offset = currentPageIndex * pagesPerPage;
  const currentPages = filteredPages.slice(offset, offset + pagesPerPage);

  return (
    <>
      <div className="w-full h-full overflow-y-scroll bg-base-200 relative ">
        <div
          className={`${
            theme === "dark" ? "text-neutral-300" : "text-dark"
          } flex flex-col justify-start items-center bg-base-200 h-full`}
        >
          <h2 className="m-3 text-3xl mt-5">List of Pages</h2>
          {errorDelete && (
            <div className="w-3/4 alert alert-error text-wrap" role="alert">
              {errorDelete}
            </div>
          )}
          <div className="w-3/4 rounded bg-base-100 shadow p-3">
            <div className="flex justify-between mb-3">
              <div className="flex w-1/2 justify-start items-center relative me-5">
                <input
                  ref={inputRef}
                  type="text"
                  className="h-3/4 input input-bordered w-full pl-10 rounded-md"
                  placeholder="find a page..."
                  onChange={handleSearch}
                />
                <button
                  className="btn btn-link absolute border-none"
                  onClick={handleSearchInput}
                >
                  <IoSearchOutline />
                </button>
              </div>
              <Link to="/admin/pages/create" className="btn btn-neutral">
                <RiStickyNoteAddFill />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead
                  className={`${
                    theme === "dark" ? "text-neutral-300" : ""
                  } text-xl`}
                >
                  <tr>
                    <th className="col-number">ID</th>
                    <th className="col-title">Title</th>
                    <th className="col-category">Content</th>
                    <th className="col-author">Sorting</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPages.map((page) => (
                    <tr key={page.id}>
                      <td>{String(page.id).padStart(3, "0")}</td>
                      <td>{page.title}</td>
                      <td>{page.content}</td>
                      <td>{page.sorting}</td>
                      <td>
                        <Link
                          to={`${page.id}`}
                          className="btn btn-info btn-sm me-2 "
                        >
                          <FiList />
                        </Link>
                        <Link
                          to={`edit/${page.id}`}
                          className="btn btn-primary btn-sm me-2"
                        >
                          <FiEdit />
                        </Link>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => {
                            setToDelete(page);
                            setOpenConfirm(true);
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center fixed bottom-5 bg-base-150 shadow-md rounded-xl border">
            <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
          {openConfirm && toDelete && (
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
