import React from "react";
import { ChordModel } from "../../DataModels/ChordModel";
import { confirmDelete } from "../SharedClassNames/ConfirmDelete";
import { useThemeContext } from "../../Contexts/ThemeContext";

type popUPMessage = {
  toDelete: ChordModel;
  handleDelete: (chord: ChordModel) => void;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};
const ChordDelete: React.FC<popUPMessage> = ({
  toDelete,
  handleDelete,
  setOpenConfirm,
}) => {
  const { theme } = useThemeContext();
  return (
    <div className={confirmDelete.overlay}>
      <div className={confirmDelete.container(theme)}>
        <div className={confirmDelete.header}>
          <div></div>
          <button
            className={confirmDelete.closeButton}
            onClick={() => setOpenConfirm(false)}
          >
            <span className="text-2xl font-semibold">&times;</span>
          </button>
        </div>
        <p className={confirmDelete.message}>
          Do you want to delete the chord <strong>{toDelete.chordName}</strong>?
        </p>
        <div className={confirmDelete.buttonContainer}>
          <button
            className={confirmDelete.noButton}
            onClick={() => setOpenConfirm(false)}
          >
            No
          </button>
          <button
            className={confirmDelete.yesButton}
            onClick={() => {
              handleDelete(toDelete);
              setOpenConfirm(false);
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChordDelete;
