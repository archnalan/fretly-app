import React, { useEffect, useState } from "react";
import { RiMoreFill, RiStickyNoteAddFill } from "react-icons/ri";
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
import ErrorMessage from "../AdminHelper/ErrorMessage";

const Song: React.FC = () => {
  const [songs, setSongs] = useState<SongWithCategory[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [toDelete, setToDelete] = useState<SongWithCategory[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<SongWithCategory[]>([]);
  const [newList, setNewList] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [songsPerPage] = useState(6);
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

  const handleSelectSong = (song: SongWithCategory, isChecked: boolean) => {
    setSelectedSongs((prevSelectedSongs) =>
      isChecked
        ? [...prevSelectedSongs, song]
        : prevSelectedSongs.filter((p) => p.id !== song.id)
    );
  };

  const handleDelete = (name: string, id: number) => {
    const deleteSong = async () => {
      try {
        const response = await SongRequest.deleteSong(id);

        console.log("🚀 ~ deleteSong ~ response:", response);

        setNewList(name);
        setSelectedSongs([]);
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
        <h1 className={listPage.header}>Songs</h1>
        {errorDelete && <ErrorMessage errorMessage={errorDelete} />}
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
                placeholder="search a Song..."
                onChange={handleSearch}
              />
              <button className={listPage.searchButton}>
                <IoSearchOutline size={20} />
              </button>
            </div>
            <Link to="create/step1" className={listPage.createLinkContainer}>
              <label htmlFor="#createlink" className={listPage.createLinkLabel}>
                Add Song
              </label>
              <button id="createlink" className={listPage.createButton}>
                <RiStickyNoteAddFill />
              </button>
            </Link>
          </div>
        </div>

        <div className={listPage.tableContainer}>
          <table className={listPage.table(theme)}>
            <thead className={listPage.tableHead}>
              <tr>
                <th>
                  {selectedSongs.length > 0 && (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        setToDelete(selectedSongs);
                        setOpenConfirm(true);
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </th>
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
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedSongs.some((p) => p.id === song.id)}
                        onChange={(e) =>
                          handleSelectSong(song, e.target.checked)
                        }
                      />
                    </label>
                  </td>
                  <td>{String(song.number).padStart(3, "0")}</td>
                  <td>{song.title}</td>
                  <td>{song.categoryName}</td>
                  <td>{song.writtenBy}</td>
                  <td>
                    <div className="dropdown dropdown-right ">
                      <button tabIndex={0} className="btn btn-ghost btn-circle">
                        <RiMoreFill size={24} />
                      </button>
                      <ul
                        tabIndex={1}
                        className="dropdown-content menu menu-compact bg-base-100 rounded-box w-52 shadow absolute right-0 mt-2 z-1 border"
                      >
                        <li className="w-full">
                          <Link
                            to={`${song.id}`}
                            className={listPage.detailsButton}
                          >
                            <FiList className="mr-2" /> Details
                          </Link>
                        </li>
                        <li className="w-full">
                          <Link
                            to={`edit/${song.id}`}
                            className={listPage.editButton}
                          >
                            <FiEdit className="mr-2" /> Edit
                          </Link>
                        </li>
                        <li className="w-full">
                          <button
                            className={listPage.deleteButton}
                            onClick={() => {
                              setToDelete([...toDelete, song]);
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
          {currentSongs.length == 0 && (
            <pre className={listPage.spinnerPreview}>
              <span className={listPage.spinnerSpan}></span>
            </pre>
          )}
        </div>
        <div className={listPage.paginationContainer}>
          <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
        {openConfirm && toDelete && (
          <SongDelete
            toDelete={toDelete}
            setOpenConfirm={setOpenConfirm}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Song;
