import React from "react";
import { useNavigate } from "react-router-dom";
import { SuccessPopup } from "../SharedClassNames/successPopup";
import { useThemeContext } from "../../Contexts/ThemeContext";

type popUPMessage = {
  categoryName: string;
  setOpenEditSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};
const CategoryEditSuccess: React.FC<popUPMessage> = ({
  categoryName,
  setOpenEditSuccess,
}) => {
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  return (
    <div className={SuccessPopup.overlay(theme)}>
      <div className={SuccessPopup.container(theme)}>
        <div className={SuccessPopup.header}>
          <div></div>
          <button
            className={SuccessPopup.closeButton}
            onClick={() => {
              setOpenEditSuccess(false);
              navigate("/admin/categories");
            }}
          >
            <span className={SuccessPopup.closeIcon}>&times;</span>
          </button>
        </div>
        <p className={SuccessPopup.message}>
          Category <strong>{categoryName}</strong> has been edited successfully!
        </p>
        <div className={SuccessPopup.buttonContainer}>
          <button
            className={SuccessPopup.okButton}
            onClick={() => {
              navigate("/admin/categories");
              () => setOpenEditSuccess(false);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditSuccess;
