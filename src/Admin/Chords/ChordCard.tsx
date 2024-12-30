import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ChartModel } from "../../DataModels/ChartModel";
import { ChordModel, difficultyLevel } from "../../DataModels/ChordModel";
import ChordCarousel from "./ChordCarousel";
import { useThemeContext } from "../../Contexts/ThemeContext";

type ChordCardType = {
  charts: ChartModel[];
  currentChords: ChordModel[];

  fetchChord: (id: number) => Promise<void>;
  setToDelete: (chart: ChordModel) => void;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenChordEdit: (header: string) => void;
};
const ChordCard: React.FC<ChordCardType> = ({
  charts,
  currentChords,
  fetchChord,
  setToDelete,
  setOpenConfirm,
  setOpenChordEdit,
}) => {
  const { theme } = useThemeContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 flex-grow gap-4 ">
      {currentChords.map((chord, index) => {
        const filteredCharts = charts.filter(
          (chart) => chart.chordId === chord.id
        );
        return (
          <div key={index} className="card">
            {filteredCharts.length > 0 ? (
              <figure className="h-[15em] ">
                <ChordCarousel charts={filteredCharts} chord={chord} />
              </figure>
            ) : (
              <figure className="h-[15em] ">
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
            <div className="card-actions flex justify-center mt-[1rem]">
              <Link to={`${chord.id}`} className="btn btn-sm btn-info me-2">
                <FiList />
              </Link>

              <button
                className="btn btn-sm btn-primary me-2 "
                onClick={() => {
                  setOpenChordEdit("Edit");
                  fetchChord(chord.id);
                }}
              >
                <FiEdit />
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setOpenConfirm(true);
                  setToDelete(chord);
                }}
              >
                <FiTrash2 />
              </button>
            </div>
            <div className="card-body">
              <h5 className="card-title">{chord.chordName}</h5>
              <p>
                Difficulty:{" "}
                <span className="text-neutral">
                  {difficultyLevel[chord.difficulty ?? 0]}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChordCard;
