import React from "react";
import { confirmDelete } from "../SharedClassNames/ConfirmDelete";
import { useThemeContext } from "../../Contexts/ThemeContext";

type popUPMessage = {
  title: string;
  bookId: number;
  handleDelete: (name: string, id: number) => void;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};
const BookDelete: React.FC<popUPMessage> = ({
  title,
  bookId,
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
          Do you want to delete the book <strong>{title}</strong>?
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
              handleDelete(title, bookId);
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

export default BookDelete;
