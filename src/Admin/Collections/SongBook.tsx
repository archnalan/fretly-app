import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RiMoreFill, RiStickyNoteAddFill } from "react-icons/ri";
import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SongBookModel, SongBookSchema } from "../../DataModels/SongBookModel";
import BookRequest from "../../API/BookRequest";
import { idSchema } from "../../DataModels/ValidatedID";
import Pagination from "../../Helper/Pagination";
import { listPage } from "../SharedClassNames/ListPage";
import { Theme, useThemeContext } from "../../Contexts/ThemeContext";
import BookDelete from "./BookDelete";

const SongBook: React.FC = () => {
  const [songBooks, setSongBooks] = useState<SongBookModel[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<SongBookModel[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<SongBookModel[]>([]);
  const [bookSearch, setBookSearch] = useState<SongBookModel[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [songsPerPage] = useState(6);
  const skeletonArray = Array.from({ length: songsPerPage });
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useThemeContext();

  const tableHead = [
    { th: "Title", className: "col-title" },
    { th: "Publisher", className: "col-publisher" },
    { th: "Author", className: "col-author" },
    { th: "Actions", className: "col-actions" },
  ];
  const tableSkeletons = [...tableHead, { th: "ID" }];

  useEffect(() => {
    const getSongBooks = async () => {
      try {
        const response = await BookRequest.fetchAllSongBooks();

        const validatedBooks = SongBookSchema.array().safeParse(
          response.data.$values
        );

        if (!validatedBooks.success) {
          console.error(
            "🚀 ~ getSongBooks ~ validatedBooks:",
            validatedBooks.error.issues
          );
          return;
        }

        setSongBooks(validatedBooks.data);
        setBookSearch(validatedBooks.data);
      } catch (error) {
        console.error("Error fetching Books: ", error);
      }
    };
    getSongBooks();
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      console.log(
        "🚀 ~ useEffect ~ location.state?.successMessage:",
        location.state?.successMessage
      );
      setSuccessMessage(location.state?.successMessage);
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
      location.state = { successMessage: "" };
      //clear the success state object
      navigate(location.pathname, { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleDelete = (book: string, id: number) => {
    const deleteSongBook = async (id: number) => {
      try {
        const validatedId = idSchema.parse(id.toString());
        const response = await BookRequest.deleteSongBook(validatedId);
        console.log("🚀 ~ deleteSongBook ~ response:", response);

        window.location.reload();
      } catch (error) {
        console.log("🚀 ~ deleteSongBook ~ error:", error);
      }
    };
    deleteSongBook(id);
  };

  const handleSelectPage = (book: SongBookModel, isChecked: boolean) => {
    setSelectedBooks((prevSelectedBooks) =>
      isChecked
        ? [...prevSelectedBooks, book]
        : prevSelectedBooks.filter((p) => p.id !== book.id)
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.toLowerCase();

    if (searchQuery !== "") {
      const results = songBooks.filter(
        (bk) =>
          bk.title.toLowerCase().includes(searchQuery) ||
          bk.publisher.toLowerCase().includes(searchQuery) ||
          bk.author?.toLowerCase().includes(searchQuery)
      );
      console.log("🚀 ~ handleSearch ~ results:", results);
      setBookSearch(results);
    } else {
      setBookSearch(songBooks);
    }
  };

  const handlePageChange = (selected: number) => {
    setCurrentPageIndex(selected);
  };
  const pageCount = Math.ceil(bookSearch.length / songsPerPage);
  const offset = currentPageIndex * songsPerPage;
  const currentBooks = bookSearch.slice(offset, offset + songsPerPage);

  return (
    <div className={listPage.container}>
      <div className={listPage.innerContainer(theme)}>
        {/* {errorDelete && <ErrorMessage errorMessage={errorDelete} />} */}
        <h1 className={listPage.header}>Music Collection</h1>
        {successMessage && (
          <div className={listPage.toastContainer}>
            <div className={listPage.toastDiv}>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        <div className={listPage.contentContainer}>
          <div className={listPage.searchContainer}>
            <div className={listPage.searchInputContainer}>
              <input
                type="text"
                className={listPage.searchInput}
                placeholder="find a collection..."
                onChange={handleSearch}
              />
              <button className={listPage.searchButton}>
                <IoSearchOutline size={20} />
              </button>
            </div>
            <Link
              to="/admin/songbooks/create/step1"
              className={listPage.createLinkContainer}
            >
              <label htmlFor="#createlink" className={listPage.createLinkLabel}>
                Add Collection
              </label>
              <button id="createlink" className={listPage.createButton}>
                <RiStickyNoteAddFill />
              </button>
            </Link>
          </div>
        </div>

        <div className={listPage.tableContainer}>
          <table
            className={listPage.table(theme)}
            style={{ borderRadius: "0" }}
          >
            <thead className={listPage.tableHead}>
              <tr>
                <th>
                  {selectedBooks.length > 0 && (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        setToDelete(selectedBooks);
                        setOpenConfirm(true);
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </th>
                {tableHead.map((header, index) => (
                  <th key={index} className={header.className}>
                    {header.th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentBooks.length === 0
                ? skeletonArray.map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableSkeletons.map((_, colIndex) => (
                        <td key={colIndex} className="items-center">
                          <div className={listPage.tableSkelton}></div>
                        </td>
                      ))}
                    </tr>
                  ))
                : currentBooks.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedBooks.some(
                              (p) => p.id === book.id
                            )}
                            onChange={(e) =>
                              handleSelectPage(book, e.target.checked)
                            }
                          />
                        </label>
                      </td>
                      <td>{book.title}</td>
                      <td>{book.publisher}</td>
                      <td>{book.author}</td>
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
                            className="dropdown-content menu menu-compact bg-base-100 rounded-box w-52 shadow absolute right-0 mt-2 z-1 border"
                          >
                            <li className="w-full">
                              <Link
                                to={`${book.id}`}
                                className={listPage.detailsButton}
                              >
                                <FiList className="mr-2" /> Details
                              </Link>
                            </li>
                            <li className="w-full">
                              <Link
                                to={`/admin/songbooks/create/step1/${book.id}`}
                                className={listPage.editButton}
                              >
                                <FiEdit className="mr-2" /> Edit
                              </Link>
                            </li>
                            <li className="w-full">
                              <button
                                className={listPage.deleteButton}
                                onClick={() => {
                                  setToDelete([...toDelete, book]);
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
          {/* {currentBooks.length == 0 && (
            <pre className="w-full h-full flex justify-center items-center">
              <span className="loading loading-spinner text-info loading-lg"></span>
            </pre>
          )} */}
        </div>

        <div className={listPage.paginationContainer}>
          <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
        {openConfirm && toDelete && (
          <BookDelete
            todelete={toDelete}
            setOpenConfirm={setOpenConfirm}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default SongBook;
