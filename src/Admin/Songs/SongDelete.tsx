import React from "react";
import { confirmDelete } from "../SharedClassNames/ConfirmDelete";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { SongWithCategory } from "../../DataModels/SongModel";

type popUPMessage = {
  toDelete: SongWithCategory[];
  handleDelete: (name: string, id: number) => void;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};
const SongDelete: React.FC<popUPMessage> = ({
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
            className={confirmDelete.closeIcon}
            onClick={() => setOpenConfirm(false)}
          >
            &times;
          </button>
        </div>
        <p className={confirmDelete.message}>
          <span>
            Do you want to delete the song
            {toDelete.length > 1 ? "s " : " "}
          </span>
          <strong>
            {toDelete.length === 1 ? (
              <span>{toDelete[0].title}</span>
            ) : (
              toDelete.map((page, index) => (
                <span key={page.id}>
                  {page.title}
                  {index < toDelete.length - 2 ? ", " : ""}
                  {index === toDelete.length - 2 ? " and " : ""}
                </span>
              ))
            )}
          </strong>
          ?
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
              toDelete.map((category) =>
                handleDelete(category.title, category.id)
              );
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

export default SongDelete;
