import React, { useState, useEffect } from "react";
import Lyrics from "./Lyrics";
import { FiDelete, FiEdit, FiTrash } from "react-icons/fi";

const LyricLines = () => {
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);
  const [focusedLine, setFocusedLine] = useState<number | null>(null);

  const addLine = (lineNumber: number) => {
    const newLineNumber = Math.max(...lineNumbers) + 1;
    setLineNumbers((prev) => {
      const index = prev.indexOf(lineNumber);
      const newLineNumbers = [
        ...prev.slice(0, index + 1),
        newLineNumber,
        ...prev.slice(index + 1),
      ];
      return newLineNumbers;
    });

    setFocusedLine(newLineNumber);
  };

  const handleLineDelete = (lineNumber: number) => {
    const newLineNumbers = lineNumbers.filter((num) => num !== lineNumber);
    setLineNumbers(newLineNumbers);
  };

  return (
    <div className="w-full flex flex-col align-center justify-center ">
      <div className="w-full flex flex-col align-center justify-center ">
        <p className="text-gray-600 text-sm p-[0.5rem_0.15rem_0.35rem]">
          Press Enter to add new lyric segment. Each segment can be assigned a
          chord.
        </p>
      </div>
      <div className="w-full">
        {lineNumbers.map((lineNumber, index) => (
          <div
            key={lineNumber}
            className="relative mb-[3rem]"
            id={`line-${lineNumber}`}
          >
            <Lyrics
              lineNumbering={index + 1}
              focused={focusedLine === lineNumber}
              onFocusLine={() => setFocusedLine(lineNumber)}
            />
            {focusedLine === lineNumber && (
              <div className="absolute bottom-[-2rem] right-7">
                <button
                  className="btn btn-sm rounded-t-none rounded-r-none text-primary border-info border-t-0 border-r-0"
                  onClick={() => addLine(lineNumber)}
                >
                  <FiEdit /> New
                </button>
                <button
                  className="btn btn-sm rounded-t-none rounded-l-none text-error border-info border-t-0 "
                  onClick={() => handleLineDelete(lineNumber)}
                >
                  <FiTrash /> Rem
                </button>
              </div>
            )}
            <button
              className="btn btn-sm btn-ghost absolute top-1 right-1 rounded-full text-error"
              onClick={() => handleLineDelete(lineNumber)}
              disabled={lineNumbers.length === 1}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LyricLines;
