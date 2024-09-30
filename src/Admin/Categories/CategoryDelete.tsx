import React from "react";
import { confirmDelete } from "../SharedClassNames/ConfirmDelete";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { CategoryModel } from "../../DataModels/CategoryModel";

type popUPMessage = {
  todelete: CategoryModel[];
  handleDelete: (name: string, id: number) => void;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};
const CategoryDelete: React.FC<popUPMessage> = ({
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
            Do you want to delete the categor
            {todelete.length > 1 ? "ies " : "y "}
          </span>
          <strong>
            {todelete.length === 1 ? (
              <span>{todelete[0].name}</span>
            ) : (
              todelete.map((category, index) => (
                <span key={category.id}>
                  {category.name}
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
              todelete.map((category) =>
                handleDelete(category.name, category.id)
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

export default CategoryDelete;
