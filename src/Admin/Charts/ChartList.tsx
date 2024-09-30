import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { SiAudiomack } from "react-icons/si";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { ChartModel, ChartSchema } from "../../DataModels/ChartModel";
import ChartRequest from "../../API/ChartRequest";
import Pagination from "../../Helper/Pagination";
import ChartDelete from "./ChartDelete";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { listPage } from "../SharedClassNames/ListPage";

const ChartList: React.FC = () => {
  const [charts, setCharts] = useState<ChartModel[]>([]);
  const [filteredCharts, setfilteredCharts] = useState<ChartModel[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [toDelete, setToDelete] = useState<ChartModel | undefined>(undefined);
  const [newList, setNewList] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [chartsPerPage] = useState(4);
  const location = useLocation();
  const { theme } = useThemeContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    const FetchData = async () => {
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
        if (validateCharts.data || newList) {
          setCharts(validateCharts.data);
          setfilteredCharts(validateCharts.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    FetchData();
  }, [newList]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (charts) {
        const searchResult = charts.filter(
          (chart) =>
            String(chart.fretPosition).includes(normalizedQuery) ||
            chart.filePath.toLowerCase().includes(searchQuery) ||
            chart.positionDescription?.toLowerCase().includes(searchQuery) ||
            chart.chartAudioFilePath?.toLowerCase().includes(searchQuery)
        );
        setfilteredCharts(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredCharts(charts);
    }
  };

  const handleDelete = (name: string, id: number) => {
    const deleteData = async () => {
      try {
        const response = ChartRequest.deleteChordChart(id);
        console.log("delete chart", response);

        setNewList(name);
        /* window.location.reload(); */
      } catch (error) {
        console.error("Error deleting chart", error);
      }
    };
    deleteData();
  };

  const handleRefInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPageIndex(selectedPage);
  };

  const pageCount = Math.ceil(filteredCharts.length / chartsPerPage);
  const offset = currentPageIndex * chartsPerPage;
  const currentCharts = filteredCharts.slice(offset, offset + chartsPerPage);

  return (
    <>
      <div className={listPage.container}>
        <div className={listPage.innerContainer(theme)}>
          <h1 className={listPage.header}>List of Chord Charts</h1>
          {successMessage && (
            <div className={listPage.successAlert} role="alert">
              {successMessage}
            </div>
          )}
          <div className={listPage.contentContainer}>
            <div className={listPage.searchContainer}>
              <div className={listPage.searchInputContainer}>
                <input
                  ref={inputRef}
                  type="text"
                  className={listPage.searchInput}
                  placeholder="Search a chord chart..."
                  onChange={handleSearch}
                />
                <button
                  className={listPage.searchButton}
                  onClick={handleRefInput}
                >
                  <IoSearchOutline size={20} />
                </button>
              </div>
              <Link
                to="/admin/chordcharts/create"
                className={listPage.createLinkContainer}
              >
                <label
                  htmlFor="#createlink"
                  className={listPage.createLinkLabel}
                >
                  Add Chart
                </label>
                <button id="createlink" className={listPage.createButton}>
                  <RiStickyNoteAddFill />
                </button>
              </Link>
            </div>
          </div>

          <div className="w-3/4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-[2rem] ">
            {currentCharts.map((chart, index) => (
              <div className="card" key={index}>
                <figure>
                  <img
                    src={chart.filePath}
                    alt={chart.filePath}
                    className="w-full img-thumbnail bg-base-100"
                    style={{
                      backgroundColor: `${theme === "dark" ? "#ddd" : ""}`,
                      maxHeight: "15em",
                      maxWidth: "10em",
                      borderRadius: "0.5em",
                    }}
                  />
                </figure>
                <div className="card-actions justify-center mt-[1rem]">
                  <Link
                    to={`${chart.id}`}
                    className="btn btn-sm btn-success me-2"
                  >
                    <FiList />
                  </Link>
                  <Link
                    to={`edit/${chart.id}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    <FiEdit />
                  </Link>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => {
                      setToDelete(chart);
                      setOpenConfirm(true);
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Fret: {chart.fretPosition}</h5>
                  <p className="card-text">
                    {chart.positionDescription &&
                    chart.positionDescription.length > 25
                      ? `${chart.positionDescription.slice(0, 45)}...`
                      : chart.positionDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {currentCharts.length == 0 && (
            <pre className={listPage.spinnerPreview}>
              <span className={listPage.spinnerSpan}></span>
            </pre>
          )}
          <div className={listPage.paginationContainer}>
            <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
        </div>
        {openConfirm && toDelete && (
          <ChartDelete
            title={toDelete.filePath}
            categoryId={toDelete.id}
            setOpenConfirm={setOpenConfirm}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
};

export default ChartList;
