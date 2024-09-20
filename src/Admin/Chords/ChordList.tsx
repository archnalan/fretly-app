import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RiStickyNoteAddFill } from "react-icons/ri";
import Pagination from "../../Helper/Pagination";
import { IoSearchOutline } from "react-icons/io5";
import ChordCreate from "./ChordCreate";
import ChordCard from "./ChordCard";
import ChordEdit from "./ChordEdit";
import ChordDelete from "./ChordDelete";
import {
  ChordEditModel,
  ChordModel,
  ChordSchema,
} from "../../DataModels/ChordModel";
import { ChartModel, ChartSchema } from "../../DataModels/ChartModel";
import ChordRequest from "../../API/ChordRequest";
import ChartRequest from "../../API/ChartRequest";
import { listPage } from "../SharedClassNames/ListPage";
import { useThemeContext } from "../../Contexts/ThemeContext";

const Chord: React.FC = () => {
  const [chords, setChords] = useState<ChordModel[]>([]);
  const [charts, setCharts] = useState<ChartModel[]>([]);
  const [filteredChords, setfilteredChords] = useState<ChordModel[]>([]);
  const [openChordCreate, setOpenChordCreate] = useState(false);
  const [openChordEdit, setOpenChordEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedChord, setEditedChord] = useState<ChordModel>();
  const [createdName, setCreatedName] = useState("");
  const [createdChord, setCreatedChord] = useState<ChordModel>();
  const [chord, setChord] = useState<ChordEditModel>();
  const [toDelete, setToDelete] = useState<ChordModel>();
  const [errorDelete, setErrorDelete] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [chordsPerPage] = useState(4);
  const location = useLocation();
  const { theme } = useThemeContext();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    const FetchChords = async () => {
      try {
        const response = await ChordRequest.fetchChordsWithCharts();

        const validateChords = ChordSchema.array().safeParse(
          response.data.$values
        );
        if (!validateChords.success) {
          console.error(
            "🚀 ~ FetchData ~ validateChords.error:",
            validateChords.error.issues
          );
          return;
        }
        const chordData = validateChords.data;
        let chordDisplay = [...chordData];

        //Display chords that have been added or edited first
        if (editedName !== "" || createdName !== "") {
          const editedChord = chordData.find((c) => c.chordName === editedName);
          const createdChord = chordData.find(
            (c) => c.chordName === createdName
          );

          if (createdChord) {
            setCreatedChord(createdChord);
            console.log("🚀 ~ FetchChords ~ createdChord:", createdChord);
            chordDisplay.unshift(createdChord); //created chord at 1st pstn
          }
          if (editedChord) {
            setEditedChord(editedChord);
            console.log("🚀 ~ FetchChords ~ editedChord:", editedChord);
            chordDisplay.unshift(editedChord); //edited chord at 1st pstn
          }
        }
        setChords(chordDisplay);
        setfilteredChords(chordDisplay);
      } catch (error) {
        console.error(error);
      }
    };
    FetchChords();
  }, [editedName, createdName]);

  useEffect(() => {
    const FetchCharts = async () => {
      try {
        const response = await ChartRequest.fetchAllChordCharts();

        const validateCharts = ChartSchema.array().safeParse(
          response.data.$values
        );
        if (!validateCharts.success) {
          console.error(
            "🚀 ~ FetchData ~ validateCharts.success:",
            validateCharts.error.issues
          );
          return;
        }
        setCharts(validateCharts.data);
      } catch (error) {
        console.error(error);
      }
    };
    FetchCharts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (chords) {
        const searchResult = chords.filter(
          (chord) =>
            String(chord.id).includes(normalizedQuery) ||
            String(chord.difficulty).includes(normalizedQuery) ||
            chord.chordName.toLowerCase().includes(searchQuery) ||
            chord.chartAudioFilePath?.toLowerCase().includes(searchQuery)
        );
        setfilteredChords(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredChords(chords);
    }
  };

  const fetchChord = async (id: number) => {
    console.log("🚀 ~ fetchChord ~ id:", id);
    try {
      const response = await ChordRequest.fetchChordById(id);
      console.log("🚀 ~ fetchChord ~ response:", response);

      if (response.data) {
        setChord(response.data);
      }
    } catch (error) {
      console.error("🚀 ~ fetchChord ~ error:", error);
    }
  };

  const handleDelete = (chord: ChordModel) => {
    const DeleteData = async () => {
      try {
        const response = ChordRequest.deleteChord(chord.id);
        console.log("🚀 ~ DeleteData ~ response:", response);

        window.location.reload();
      } catch (error) {
        console.error("Error deleting chord", error);
        setOpenConfirm(false);
        setErrorDelete(`${chord.chordName} could not be deleted. Try Again!`);
      }
    };
    DeleteData();
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPageIndex(selectedPage);
  };

  const pageCount = Math.ceil(filteredChords.length / chordsPerPage);
  const offset = currentPageIndex * chordsPerPage;
  const currentChords = filteredChords.slice(offset, offset + chordsPerPage);

  return (
    <>
      <div className={listPage.container}>
        <div className={listPage.innerContainer(theme)}>
          <h1 className={listPage.header}>List of Chords</h1>
          {/* {successMessage && (
          <div className="w-75 alert alert-success text-wrap" role="alert">
            {successMessage}
          </div>
        )} */}
          {errorDelete && (
            <div className="w-3/4 alert alert-error text-wrap" role="alert">
              {errorDelete}
            </div>
          )}
          <div className={listPage.contentContainer}>
            <div className={listPage.searchContainer}>
              <div className={listPage.searchInputContainer}>
                <input
                  type="text"
                  className={listPage.searchInput}
                  style={{ height: "3rem" }}
                  placeholder="search a chord..."
                  onChange={handleSearch}
                />
                <button className={listPage.searchButton}>
                  <IoSearchOutline />
                </button>
              </div>
              <div className="flex items-center border rounded-r-md ps-2 pe-2 ">
                <label
                  htmlFor="#createlink"
                  className="btn btn-ghost hover:bg-transparent me-2"
                  onClick={() => setOpenChordCreate(true)}
                >
                  Add Chord
                </label>
                <button
                  id="createlink"
                  className={listPage.createButton}
                  onClick={() => setOpenChordCreate(true)}
                >
                  <RiStickyNoteAddFill />
                </button>
              </div>
            </div>

            <ChordCard
              charts={charts}
              fetchChord={fetchChord}
              currentChords={currentChords}
              setOpenChordEdit={setOpenChordEdit}
              setOpenConfirm={setOpenConfirm}
              setToDelete={setToDelete}
            />
            {currentChords.length == 0 && (
              <pre className={listPage.spinnerPreview}>
                <span className={listPage.spinnerSpan}></span>
              </pre>
            )}
          </div>
          <div className={listPage.paginationContainer}>
            <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
          </div>

          {openChordCreate && (
            <ChordCreate
              setCreatedName={setCreatedName}
              setOpenChordCreate={setOpenChordCreate}
            />
          )}
          {openChordEdit && chord && (
            <ChordEdit
              chordToEdit={chord}
              setEditedName={setEditedName}
              setOpenChordEdit={setOpenChordEdit}
            />
          )}
          {openConfirm && toDelete && (
            <ChordDelete
              toDelete={toDelete}
              setOpenConfirm={setOpenConfirm}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Chord;
