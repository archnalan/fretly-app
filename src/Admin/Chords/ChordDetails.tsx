import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { detailsPage } from "../SharedClassNames/detailsPage";
import { IoMdArrowRoundBack } from "react-icons/io";
import ChartRequest from "../../API/ChartRequest";
import { ChartModel, ChartSchema } from "../../DataModels/ChartModel";
import { useThemeContext } from "../../Contexts/ThemeContext";
import {
  ChordEditModel,
  ChordSchema,
  difficultyLevel,
} from "../../DataModels/ChordModel";
import { idSchema } from "../../DataModels/ValidatedID";
import ChordRequest from "../../API/ChordRequest";
import ChordCarousel from "./ChordCarousel";

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

  const filteredCharts = charts.filter((chart) => chart.chordId === chord.id);

  return (
    <div className={detailsPage.container}>
      <div className={detailsPage.innerContainer(theme)}>
        <div className={detailsPage.revertContainer}>
          <button
            onClick={() => navigate(-1)}
            className={detailsPage.revertButton}
          >
            <IoMdArrowRoundBack />
          </button>
          <h3 className={detailsPage.header}>
            <span className="font-semibold">Chord Details</span>
          </h3>
        </div>

        <div className={detailsPage.detailRow}>
          <strong>Chord</strong>
          <span>{chord.chordName}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Difficulty</strong>
          <span className="font-semibold text-primary">
            {difficultyLevel[chord.difficulty ?? 0]}
          </span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong className="mb-2">Charts</strong>
          {filteredCharts.length > 0 ? (
            <figure className="w-full md:w-1/2 h-[15em] mb-2">
              <ChordCarousel charts={filteredCharts} chord={chord} />
            </figure>
          ) : (
            <figure className="h-[15em] mb-2">
              <img
                src="/src/assets/No-Image-Placeholder.svg.png"
                alt="No chord image to show"
                className="img-thumbnail bg-base-100"
                style={{
                  backgroundColor: `${theme === "dark" ? "#ddd" : ""}`,
                  maxHeight: "15em",
                  borderRadius: "0.5em",
                  objectFit: "contain",
                }}
              />
            </figure>
          )}
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.buttonContainer}>
          <button
            onClick={() => navigate("/admin/chords")}
            className={detailsPage.backButton}
          >
            Back
          </button>
          <Link
            to={`/admin/chords/edit/${id}`}
            className={detailsPage.editButton}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChordDetails;
