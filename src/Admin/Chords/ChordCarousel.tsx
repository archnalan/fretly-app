import React from "react";
import { ChartModel } from "../../DataModels/ChartModel";
import { ChordEditModel } from "../../DataModels/ChordModel";
import { useThemeContext } from "../../Contexts/ThemeContext";

type chordCarousel = {
  chord: ChordEditModel;
  charts: ChartModel[];
};
const ChordCarousel: React.FC<chordCarousel> = ({ chord, charts }) => {
  const { theme } = useThemeContext();
  return (
    <div className="carousel rounded-box h-full">
      {charts.map((chart, chartIndex, filteredCharts) => {
        // Calculate the next and previous indices
        const prevIndex =
          chartIndex === 0 ? filteredCharts.length - 1 : chartIndex - 1;
        const nextIndex =
          chartIndex === filteredCharts.length - 1 ? 0 : chartIndex + 1;

        return (
          <div
            key={chartIndex}
            id={chart.id.toString()}
            className="carousel-item relative w-full justify-center"
          >
            <img
              src={chart.filePath}
              alt={chord.chordName}
              className="img-thumbnail bg-base-100"
              style={{
                backgroundColor: `${theme === "dark" ? "#ddd" : ""}`,
                borderRadius: "0.5em",
              }}
            />
            <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a
                href={`#${filteredCharts[prevIndex].id}`}
                className="btn btn-circle"
              >
                ❮
              </a>
              <a
                href={`#${filteredCharts[nextIndex].id}`}
                className="btn btn-circle"
              >
                ❯
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChordCarousel;
