import React from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { SuccessPopup } from "../../SharedClassNames/successPopup";
import { useThemeContext } from "../../../Contexts/ThemeContext";
import { SongBookCreateModel } from "../../../DataModels/SongBookModel";

type popUPMessage = {
  setIsSongCreated: React.Dispatch<React.SetStateAction<boolean>>;
};
const SongCreated: React.FC<popUPMessage> = ({ setIsSongCreated }) => {
  const { watch, reset } = useFormContext<SongBookCreateModel>();
  const songData = watch();
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
              setIsSongCreated(false);
              navigate("/admin/songs");
            }}
          >
            <span className={SuccessPopup.closeIcon}>&times;</span>
          </button>
        </div>
        <p className={SuccessPopup.message}>
          Song <strong>{songData.title}</strong> has been created successfully!
        </p>
        <div>
          <button
            className={SuccessPopup.okButton}
            onClick={() => {
              reset();
              navigate("/admin/songs");
              () => setIsSongCreated(false);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCreated;
