import React, { useEffect, useState } from "react";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiList, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import {
  SongWithCategory,
  SongWithCategorySchema,
} from "../../DataModels/SongModel";
import SongRequest from "../../API/SongRequest";
import { MessageSchema } from "../../DataModels/SuccessMessage";
import { listPage } from "../SharedClassNames/ListPage";
import Pagination from "../../Helper/Pagination";
import SongDelete from "./SongDelete";
import { useThemeContext } from "../../Contexts/ThemeContext";

const Song: React.FC = () => {
  const [songs, setSongs] = useState<SongWithCategory[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [toDelete, setToDelete] = useState<SongWithCategory | undefined>(
    undefined
  );
  const [newList, setNewList] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [songsPerPage] = useState(7);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const [filteredSongs, setfilteredSongs] = useState<SongWithCategory[]>([]);

  useEffect(() => {
    const getSongs = async () => {
      const response = await SongRequest.fetchAllSongs();

      const validatedSong = SongWithCategorySchema.array().safeParse(
        response.data.$values
      );
      if (!validatedSong.success) {
        console.error(
          "🚀 ~ getSongs ~ validatedSong.error:",
          validatedSong.error.issues
        );
        return;
      }
      if (validatedSong.success || newList) {
        setSongs(validatedSong.data);
        setfilteredSongs(validatedSong.data);
      }
    };
    getSongs();
  }, [newList]);

  useEffect(() => {
    if (location.state?.successMessage) {
      const successMessage = MessageSchema.parse(location.state.successMessage);
      console.log(
        "🚀 ~ useEffect ~ location.state?.successMessage:",
        successMessage
      );
      setSuccessMessage(successMessage);
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
      //clear the success state object
      navigate(location.pathname, { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (songs) {
        const searchResult = songs.filter(
          (song) =>
            String(song.number).includes(searchQuery) ||
            String(song.number).includes(normalizedQuery) ||
            song.title.toLowerCase().includes(searchQuery) ||
            song.categoryName?.toLowerCase().includes(searchQuery) ||
            song.writtenBy?.toLowerCase().includes(searchQuery)
        );
        setfilteredSongs(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredSongs(songs);
    }
  };

  const handleDelete = (name: string, id: number) => {
    const deleteSong = async () => {
      try {
        const response = await SongRequest.deleteSong(id);

        console.log("🚀 ~ deleteSong ~ response:", response);

        setNewList(name);
        /*  window.location.reload(); */
      } catch (error) {
        console.error("Error deleting Song", error);
        setOpenConfirm(false);
        setErrorDelete(`${name} could not be deleted. Try Again!`);
      }
    };
    deleteSong();
  };
  const handlePageChange = (selected: number) => {
    setCurrentPageIndex(selected);
  };
  const pageCount = Math.ceil(filteredSongs.length / songsPerPage);
  const offset = currentPageIndex * songsPerPage;
  const currentSongs = filteredSongs.slice(offset, offset + songsPerPage);

  return (
    <div className={listPage.container}>
      <div className={listPage.innerContainer(theme)}>
        <h1 className={listPage.header}>List of Songs</h1>
        {successMessage && (
          <div className={listPage.successAlert} role="alert">
            {successMessage}
          </div>
        )}
        {errorDelete && (
          <div className={listPage.errorAlert} role="alert">
            {errorDelete}
          </div>
        )}
        <div className={listPage.contentContainer}>
          <div className={listPage.searchContainer}>
            <div className={listPage.searchInputContainer}>
              <input
                type="text"
                className={listPage.searchInput}
                placeholder="search a Song..."
                onChange={handleSearch}
              />
              <button className={listPage.searchButton}>
                <IoSearchOutline />
              </button>
            </div>
            <Link to="/songs/basicinfo" className={listPage.createButton}>
              <RiStickyNoteAddFill />
            </Link>
          </div>
          <div className={listPage.tableContainer}>
            <table className={listPage.table}>
              <thead>
                <tr>
                  <td className="col-number">Number</td>
                  <td className="col-title">Title</td>
                  <td className="col-category">Category</td>
                  <td className="col-author">Author</td>
                  <td className="col-actions">Actions</td>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentSongs.map((song) => (
                  <tr key={song.id}>
                    <td>{String(song.number).padStart(3, "0")}</td>
                    <td>{song.title}</td>
                    <td>{song.categoryName}</td>
                    <td>{song.writtenBy}</td>
                    <td>
                      <Link
                        to={`${song.id}`}
                        className={listPage.detailsButton}
                      >
                        <FiList />
                      </Link>
                      <Link
                        to={`edit/${song.id}`}
                        className={listPage.editButton}
                      >
                        <FiEdit />
                      </Link>
                      <button
                        className={listPage.deleteButton}
                        onClick={() => {
                          setToDelete(song);
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
        <div className={listPage.paginationContainer}>
          <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
        {openConfirm && toDelete && (
          <SongDelete
            title={toDelete.title}
            songId={toDelete.id}
            setOpenConfirm={setOpenConfirm}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Song;
