import React, { useEffect, useRef } from "react";
import { LuArrowUpLeftSquare } from "react-icons/lu";
import { MdCancelPresentation } from "react-icons/md";
import { LineModel } from "../../../DataModels/LineModel";

interface LineEditProps {
  lineToEdit: LineModel;
  handleEditChanges: (e: React.FormEvent) => void;
  handleEditCancel: () => void;
  handleEditOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const LineEdit: React.FC<LineEditProps> = ({
  handleEditChanges,
  lineToEdit,
  handleEditCancel,
  handleEditOnChange,
}) => {
  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lineToEdit) {
      editInput.current?.focus();
    }
  }, [lineToEdit]);

  return (
    <div className="flex items-center">
      {/* <Chord /> */}
      <form
        onSubmit={handleEditChanges}
        className="flex flex-1 items-center space-x-2"
      >
        <input
          ref={editInput}
          value={lineToEdit.lineLyrics}
          onChange={handleEditOnChange}
          placeholder="Enter lyric line here..."
          className="w-full input input-bordered input-info bg-white bg-opacity-75 rounded p-2 me-[2rem]"
        />

        <div className="tooltip px-2" data-tip="submit">
          <button type="submit" className="text-success">
            <LuArrowUpLeftSquare size={20} />
          </button>
        </div>
        <div className="tooltip" data-tip="cancel">
          <button
            type="button"
            className="text-error cursor-pointer"
            onClick={handleEditCancel}
          >
            <MdCancelPresentation size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LineEdit;
