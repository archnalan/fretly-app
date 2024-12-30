import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ChartModel } from "../../DataModels/ChartModel";
import { ChordModel } from "../../DataModels/ChordModel";
import ChordCarousel from "./ChordCarousel";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 flex-grow gap-4 ">
      {currentChords.map((chord, index) => {
        const filteredCharts = charts.filter(
          (chart) => chart.chordId === chord.id
        );
        return (
          <div key={index} className="card">
            <figure className="h-[15em] ">
              <ChordCarousel charts={filteredCharts} chord={chord} />
            </figure>
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
              <p>Chord Difficulty: {chord.difficulty}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChordCard;
