import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { detailsPage } from "../SharedClassNames/detailsPage";
import { IoMdArrowRoundBack } from "react-icons/io";
import ChartRequest from "../../API/ChartRequest";
import { ChartModel, ChartSchema } from "../../DataModels/ChartModel";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { ChordEditModel, ChordSchema } from "../../DataModels/ChordModel";
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
          <strong>Version</strong>
          <span>{chord.difficulty}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className="flex flex-col justify-start mb-2">
          <strong className="mb-2">Charts</strong>
          <div className="h-96">
            <ChordCarousel charts={filteredCharts} chord={chord} />
          </div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className="mt-2 d-flex justify-content-end mb-3">
          <button
            onClick={() => navigate("/admin/chords")}
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
