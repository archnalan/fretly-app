import React, { useEffect, useState } from "react";
import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { Link } from "react-router-dom";
import { ChartModel } from "../../DataModels/ChartModel";
import { ChordModel } from "../../DataModels/ChordModel";

type ChordCardType = {
  charts: ChartModel[];
  currentChords: ChordModel[];

  fetchChord: (id: number) => Promise<void>;
  setToDelete: (chart: ChordModel) => void;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenChordEdit: React.Dispatch<React.SetStateAction<boolean>>;
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
    <div className="container flex 1/4">
      <div className="grid grid-cols-4 gap-4">
        {currentChords.map((chord, index) => {
          const filteredCharts = charts.filter(
            (chart) => chart.chordId === chord.id
          );
          return (
            <div className="flex flex-col mb-4" key={index}>
              <div className="card ">
                <div id={`slide-${index}`} className="carousel w-full">
                  <div className="carousel relative w-full">
                    {charts
                      .filter((chart) => chart.chordId === chord.id)
                      .map((chart, chartIndex) => (
                        <div
                          key={chart.id}
                          className={`carousel-item ${
                            chartIndex === 0 ? "active" : ""
                          } w-full`}
                        >
                          <img
                            src={chart.filePath}
                            alt={chord.chordName}
                            className="block w-full"
                          />
                          <h6 className="block text-center text-secondary ">
                            Fret {chart.fretPosition}
                          </h6>
                        </div>
                      ))}
                  </div>
                  {filteredCharts.length > 0 && (
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href={`#slide-${index}`}
                        className="btn btn-circle"
                        data-bs-slide="prev"
                      >
                        <MdOutlineNavigateBefore size={24} />
                      </a>
                      <a
                        href={`#slide-${index}`}
                        className="btn btn-circle"
                        data-bs-slide="next"
                      >
                        <MdOutlineNavigateNext size={24} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="card-body">
                  <h5 className="card-title">Chord {chord.chordName}</h5>
                </div>
                <div className="card-footer d-flex justify-content-center">
                  <Link to={`${chord.id}`} className="btn btn-sm btn-info me-2">
                    <FiList />
                  </Link>

                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => {
                      setOpenChordEdit(true);
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChordCard;
