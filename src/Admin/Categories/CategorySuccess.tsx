import React from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { SuccessPopup } from "../SharedClassNames/successPopup";

type popUPMessage = {
  categoryName: string;
  setOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};
const CategoryCreated: React.FC<popUPMessage> = ({
  categoryName,
  setOpenSuccess,
}) => {
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  return (
    <div className={SuccessPopup.overlay}>
      <div className={SuccessPopup.container(theme)}>
        <div className={SuccessPopup.header}>
          <div></div>
          <button
            className={SuccessPopup.closeButton}
            onClick={() => {
              setOpenSuccess(false);
              navigate("/admin/categories");
            }}
          >
            <span className={SuccessPopup.closeIcon}>&times;</span>
          </button>
        </div>
        <p className={SuccessPopup.message}>
          Category <strong>{categoryName}</strong> has been created
          successfully!
        </p>
        <div className={SuccessPopup.buttonContainer}>
          <button
            className={SuccessPopup.okButton}
            onClick={() => {
              navigate("/admin/categories");
              () => setOpenSuccess(false);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreated;
