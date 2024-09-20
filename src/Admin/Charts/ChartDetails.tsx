import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ChartModel, ChartSchema } from "../../DataModels/ChartModel";
import { idSchema } from "../../DataModels/ValidatedID";
import ChartRequest from "../../API/ChartRequest";
import ChordRequest from "../../API/ChordRequest";
import { ChordSchema } from "../../DataModels/ChordModel";
import { detailsPage } from "../SharedClassNames/detailsPage";
import { useThemeContext } from "../../Contexts/ThemeContext";

const ChartDetails: React.FC = () => {
  const [chart, setChart] = useState<ChartModel>({
    id: 0,
    filePath: "",
    chordId: null,
    fretPosition: 0,
    chartAudioFilePath: "",
    positionDescription: "",
  });
  const [chartPreview, setChartPreview] = useState("");
  const [chord, setChord] = useState("");
  const [audioPreview, setAudioPreview] = useState<string | undefined>(
    undefined
  );

  const { theme } = useThemeContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 ~ ChartDetails ~ chart:", chart);
  }, [chart]);

  const { id } = useParams();

  useEffect(() => {
    const GetChart = async () => {
      try {
        const validatedId = idSchema.parse(id);

        const response = await ChartRequest.fetchSpecificChordChart(
          validatedId
        );

        const chartResult = ChartSchema.safeParse(response.data);

        if (!chartResult.success) {
          console.error(
            "🚀 ~ GetChart ~ chartResult.error",
            chartResult.error.issues
          );
          return;
        }
        console.log("🚀 ~ GetChart ~ the filePath", chartResult.data);
        setChart(chartResult.data);

        setChartPreview(chartResult.data.filePath);
        setAudioPreview(chartResult.data.chartAudioFilePath);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    GetChart();
  }, [id]);

  useEffect(() => {
    if (chart && chart.chordId) {
      const GetChord = async () => {
        try {
          if (chart.chordId !== null) {
            const response = await ChordRequest.fetchChordById(chart.chordId);

            const chordResult = ChordSchema.safeParse(response.data);
            if (!chordResult.success) {
              console.error(
                "🚀 ~ GetChord ~ chordResult.error:",
                chordResult.error.issues
              );
              return;
            }
            setChord(chordResult.data.chordName);
          }
        } catch (error) {
          console.error("Error getting Chord", error);
        }
      };
      GetChord();
    }
  }, [chart]);

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
            <strong>Chord chart Details</strong>
          </h3>
        </div>

        <div className={detailsPage.detailRow}>
          <strong>Chord:</strong>
          <span className="mr-3">{chord}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Fret:</strong>
          <span className="mr-3">{chart.fretPosition}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>File:</strong>
          <img
            src={chartPreview}
            alt="chart preview"
            style={{
              maxWidth: "18em",
              maxHeight: "8em",
              objectFit: "contain",
              backgroundColor: `${theme === "dark" ? "white" : ""}`,
              borderRadius: "0.5rem",
              marginBottom: "0.5rem",
            }}
          />
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Audio:</strong>
          <audio
            controls
            style={{
              maxWidth: "100%",
              maxHeight: "5em",
              objectFit: "contain",
              marginBottom: "0.5rem",
            }}
            className="m3"
            src={audioPreview}
          >
            Your Browser does not support this audio
          </audio>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Description:</strong>
          <span className="mr-3">{chart.positionDescription}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.buttonContainer}>
          <button
            onClick={() => navigate(-1)}
            className={detailsPage.backButton}
          >
            Back
          </button>
          <Link
            to={`/admin/chordcharts/edit/${id}`}
            className={detailsPage.editButton}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChartDetails;
