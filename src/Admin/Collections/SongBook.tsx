import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SongBookModel, SongBookSchema } from "../../DataModels/SongBookModel";
import BookRequest from "../../API/BookRequest";
import { idSchema } from "../../DataModels/ValidatedID";
import Pagination from "../../Helper/Pagination";
import { listPage } from "../SharedClassNames/ListPage";
import { useThemeContext } from "../../Contexts/ThemeContext";
import BookDelete from "./BookDelete";

const SongBook: React.FC = () => {
  const [songBooks, setSongBooks] = useState<SongBookModel[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<SongBookModel | undefined>(
    undefined
  );
  const [bookSearch, setBookSearch] = useState<SongBookModel[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [songsPerPage] = useState(6);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeContext();

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
      //clear the success state object
      navigate(location.pathname, { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (book: string, id: number) => {
    const confirm = window.confirm(
      `Would you like to delete Song book ${book}`
    );
    if (confirm) {
      deleteSongBook(id);
    }
  };
  const deleteSongBook = async (id: number) => {
    try {
      const validatedId = idSchema.parse(id);
      const response = await BookRequest.deleteSongBook(validatedId);
      console.log("🚀 ~ deleteSongBook ~ response:", response);

      window.location.reload();
    } catch (error) {
      console.log("🚀 ~ deleteSongBook ~ error:", error);
    }
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
        <h1 className={listPage.header}>Music Collection</h1>
        {successMessage && (
          <div className={listPage.successAlert} role="alert">
            {successMessage}
          </div>
        )}
        <div className={listPage.contentContainer}>
          <div className={listPage.searchContainer}>
            <div className={listPage.searchInputContainer}>
              <input
                type="text"
                className={listPage.searchInput}
                placeholder="Find a collection..."
                onChange={handleSearch}
              />
              <button className={listPage.searchButton}>
                <IoSearchOutline />
              </button>
            </div>
            <Link
              to="/admin/songbooks/create/step1"
              className={listPage.createButton}
            >
              <RiStickyNoteAddFill />
            </Link>
          </div>
          <div className={listPage.tableContainer}>
            <table className={listPage.table}>
              <thead className={listPage.tableHeader(theme)}>
                <tr>
                  <td className="col-number">Title</td>
                  <td className="col-title">Publisher</td>
                  <td className="col-author">Author</td>
                  <td className="col-actions">Actions</td>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.publisher}</td>
                    <td>{book.author}</td>
                    <td>
                      <Link
                        to={`${book.id}`}
                        className={listPage.detailsButton}
                      >
                        <FiList />
                      </Link>
                      <Link
                        to={`edit/${book.id}`}
                        className={listPage.editButton}
                      >
                        <FiEdit />
                      </Link>

                      <button
                        className={listPage.deleteButton}
                        onClick={() => {
                          setToDelete(book);
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
            {currentBooks.length == 0 && (
              <pre className="w-full h-full flex justify-center items-center">
                <span className="loading loading-spinner text-info loading-lg"></span>
              </pre>
            )}
          </div>
        </div>
        <div className={listPage.paginationContainer}>
          <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
        {openConfirm && toDelete && (
          <BookDelete
            title={toDelete.title}
            bookId={toDelete.id}
            setOpenConfirm={setOpenConfirm}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default SongBook;
