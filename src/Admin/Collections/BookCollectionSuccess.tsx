import React from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { SuccessPopup } from "../SharedClassNames/successPopup";

type popUPMessage = {
  collectionTitle: string;
  collectionMessage: string;
  setOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};
const BookCollectionSuccess: React.FC<popUPMessage> = ({
  collectionTitle,
  collectionMessage,
  setOpenSuccess,
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
              setOpenSuccess(false);
              navigate("/admin/songbooks");
            }}
          >
            <span className={SuccessPopup.closeIcon}>&times;</span>
          </button>
        </div>
        <p className={SuccessPopup.message}>
          Music Collection <strong>{collectionTitle}</strong> has been{" "}
          {collectionMessage}{" "}
          successfully!
        </p>
        <div className={SuccessPopup.buttonContainer}>
          <button
            className={SuccessPopup.okButton}
            onClick={() => {
              navigate("/admin/songbooks");
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

export default BookCollectionSuccess;
