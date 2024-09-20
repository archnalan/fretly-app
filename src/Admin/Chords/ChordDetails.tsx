import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TbArrowBigLeft } from "react-icons/tb";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { detailsPage } from "../SharedClassNames/detailsPage";
import { IoMdArrowRoundBack } from "react-icons/io";
import ChartRequest from "../../API/ChartRequest";
import { ChartModel, ChartSchema } from "../../DataModels/ChartModel";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { ChordEditModel, ChordSchema } from "../../DataModels/ChordModel";
import { idSchema } from "../../DataModels/ValidatedID";
import ChordRequest from "../../API/ChordRequest";

const ChordDetails: React.FC = () => {
  const [chord, setChord] = useState<ChordEditModel>({
    id: 0,
    chordName: "",
    difficulty: 0,
    chartAudioFilePath: "",
    chartAudioUpload: null,
  });
  const [charts, setCharts] = useState<ChartModel[]>([]);
  const [audioPreview, setAudioPreview] = useState<string | undefined>(
    undefined
  );
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const GetChord = async () => {
      try {
        const validatedId = idSchema.parse(id);

        const response = await ChordRequest.fetchChordById(validatedId);

        const chordResult = ChordSchema.safeParse(response.data);

        if (!chordResult.success) {
          console.error(
            "🚀 ~ GetChord ~ chordResult.error",
            chordResult.error.issues
          );
          return;
        }
        console.log("🚀 ~ GetChord ~ the filePath", chordResult.data);
        setChord(chordResult.data);

        /* setChartPreview(chordResult.data.filePath);
        setAudioPreview(chordResult.data.chartAudioFilePath); */
      } catch (error) {
        console.error("Error:", error);
      }
    };
    GetChord();
  }, [id]);

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

  return (
    <div className={detailsPage.container}>
      <div className={detailsPage.innerContainer(theme)}>
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className={detailsPage.backHeaderButton}
          >
            <IoMdArrowRoundBack />
          </button>
          <h3 className={detailsPage.header}>
            <strong>Chord Details</strong>
          </h3>
        </div>

        <div className={detailsPage.detailRow}>
          <strong>Chord</strong>
          <span>{chord.chordName}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Version</strong>
          <span>{chord.difficulty}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className="flex flex-col justify-start mb-3">
          <strong className="mb-2">Charts</strong>

          <div id="carouselCharts" className="carousel slide">
            <div className="carousel-inner">
              {charts
                .filter((chart) => chart.chordId === chord.id)
                .map((chart, chartIndex) => (
                  <div
                    key={chart.id}
                    className={`carousel-item ${
                      chartIndex === 0 ? "active" : ""
                    }`}
                  >
                    <img
                      src={chart.filePath}
                      alt={chord.chordName}
                      className="block w-full card-img-top  img-thumbnail mb-2"
                      style={{
                        maxWidth: "25em",
                        maxHeight: "15em",
                        objectFit: "contain",
                      }}
                    />
                    <h6 className="d-block text-center text-secondary ">
                      Fret {chart.fretPosition}
                    </h6>
                  </div>
                ))}
            </div>
            {charts.filter((chart) => chart.chordId === chord.id).length >
              0 && (
              <div>
                <button
                  className="carousel-control-prev text-dark"
                  type="button"
                  data-bs-target="#carouselCharts"
                  data-bs-slide="prev"
                >
                  <MdOutlineNavigateBefore size={24} />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next text-dark"
                  type="button"
                  data-bs-target="#carouselCharts"
                  data-bs-slide="next"
                >
                  <MdOutlineNavigateNext size={24} />
                  <span className="visually-hidden">Next</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselCharts"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className="d-flex justify-content-end mb-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-danger me-2"
          >
            Back
          </button>
          <Link
            to={`/admin/chords/edit/${id}`}
            className="btn btn-outline-primary"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChordDetails;
