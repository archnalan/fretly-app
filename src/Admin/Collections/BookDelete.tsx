import React from "react";
import { confirmDelete } from "../SharedClassNames/ConfirmDelete";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { SongBookModel } from "../../DataModels/SongBookModel";

type popUPMessage = {
  todelete: SongBookModel[];
  handleDelete: (name: string, id: number) => void;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};
const BookDelete: React.FC<popUPMessage> = ({
  todelete,
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
            Do you want to delete the collection
            {todelete.length > 1 ? "s " : " "}
          </span>
          <strong>
            {todelete.length === 1 ? (
              <span>{todelete[0].title}</span>
            ) : (
              todelete.map((book, index) => (
                <span key={`${book.title} ${book.description}`}>
                  {book.title}
                  {index < todelete.length - 2 ? ", " : ""}
                  {index === todelete.length - 2 ? " and " : ""}
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
              todelete.map((book) => handleDelete(book.title, book.id));
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
