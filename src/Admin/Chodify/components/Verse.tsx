import React, { useEffect, useRef, useState } from "react";
import LyricLine from "./LyricLine";
import { useVerseContext } from "../../../Contexts/VerseContext";
import { LineModel } from "../../../DataModels/LineModel";
import LineEdit from "./LineEdit";

interface VerseProps {
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const Verse: React.FC<VerseProps> = ({ setInputDisabled, handleSave }) => {
  const { lines, setLines } = useVerseContext();
  const [lineToEdit, setLineToEdit] = useState<LineModel | null>(null);

  const editInput = useRef<HTMLInputElement>(null);

  const handleEdit = (line: LineModel) => {
    setLineToEdit(line);
  };

  const handleEditOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (lineToEdit) {
      setLineToEdit({ ...lineToEdit, lineLyrics: e.target.value });
    }
  };

  const handleEditChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (lineToEdit) {
      const newLines = lines.map((line) =>
        line.lyricLineOrder === lineToEdit.lyricLineOrder ? lineToEdit : line
      );
      setLines(newLines);
      setLineToEdit(null);
    }
  };

  const handleEditCancel = () => {
    setLineToEdit(null);
  };

  useEffect(() => {
    if (lineToEdit) {
      editInput.current?.focus();
    }
  }, [lineToEdit]);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ lines:", lines);
  }, [lines]);

  //From LyricLine component
  const addInput = (lnIndex: number) => {
    const LinesToModify = [...lines];

    const newLineIndex = lnIndex + 1;

    LinesToModify.splice(newLineIndex, 0, {
      lyricLineOrder: newLineIndex,
      verseId: lineToEdit?.verseId || 1,
      lineLyrics: "",
    }); // Insert a new empty line at the correct position

    //update the subsequent lines
    for (let i = newLineIndex; i < LinesToModify.length; i++) {
      LinesToModify[i].lyricLineOrder = i + 1;
    }
    const newLines = LinesToModify; // Now the list is new
    setLines(newLines);
    setLineToEdit(newLines[newLineIndex]); // Set the new line to edit mode
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {lines.map((line, index) => (
          <div className="mb-2" key={index}>
            {lineToEdit && lineToEdit.lyricLineOrder === line.lyricLineOrder ? (
              <LineEdit
                lineToEdit={lineToEdit}
                handleEditCancel={handleEditCancel}
                handleEditChanges={handleEditChanges}
                handleEditOnChange={handleEditOnChange}
              />
            ) : (
              <LyricLine
                key={index}
                lineIndex={index}
                line={line}
                lines={lines}
                setLines={setLines}
                editLine={() => handleEdit(line)}
                addInput={() => addInput(index)}
              />
            )}
          </div>
        ))}
      </div>
      {lines.length !== 0 && (
        <div className="flex justify-end space-x-2 mt-[3rem]">
          <button
            className="bg-success text-white rounded px-4 py-2"
            onClick={handleSave}
            disabled={lineToEdit !== null}
          >
            Save
          </button>
          <button
            className="bg-error text-white rounded px-4 py-2"
            onClick={() => {
              setLines([]);
              setInputDisabled(false);
            }}
            disabled={lineToEdit !== null}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default Verse;
