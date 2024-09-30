import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SongHeader from "./SongHeader";
import SongCreated from "../SongCreated";
import { SongCreateModel } from "../../../../DataModels/SongModel";
import { createPage } from "../../../SharedClassNames/createPage";
import { useThemeContext } from "../../../../Contexts/ThemeContext";
import { detailsPage } from "../../../SharedClassNames/detailsPage";
import SongProgressbar from "../../SongProgressbar";

type popupModal = {
  isSongCreated: boolean;
  setIsSongCreated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Song03InfoReview: React.FC<popupModal> = ({
  isSongCreated,
  setIsSongCreated,
}) => {
  const {
    watch,
    trigger,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useFormContext<SongCreateModel>();
  const formData = watch();

  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const handleGoBack = () => {
    setError("root", {});
    Promise.resolve().then(() => {
      navigate(-1);
    });
  };

  useEffect(() => {
    if (errors.root) {
      setError("root", { message: errors.root.message });
    } else {
      clearErrors("root");
    }
  }, [errors.root]);

  return (
    <>
      <div className={createPage.container}>
        <div className={createPage.progressbar}>
          <SongProgressbar />
        </div>
        <div className={createPage.innerContainer(theme)}>
          <div className={createPage.header}>
            <SongHeader />
          </div>
          <div className={detailsPage.detailRow}>
            <label htmlFor="title" className={createPage.label}>
              <strong>Number</strong>
            </label>
            <div className={detailsPage.displayContainer}>
              {formData.number}
            </div>
          </div>
          <hr className={detailsPage.line(theme)} />

          <div className={detailsPage.detailRow}>
            <label htmlFor="subTitle" className={createPage.label}>
              <strong>Title</strong>
            </label>
            <div className={detailsPage.displayContainer}>{formData.title}</div>
          </div>
          <hr className={detailsPage.line(theme)} />

          <div className={detailsPage.detailRow}>
            <label htmlFor="publisher" className={createPage.label}>
              <strong>Category</strong>
            </label>
            <div className={detailsPage.displayContainer}>
              {formData.categoryId}
            </div>
          </div>
          <hr className={detailsPage.line(theme)} />

          <div className={detailsPage.detailRow}>
            <label htmlFor="edition" className={createPage.label}>
              <strong>Author</strong>
            </label>
            <div className={detailsPage.displayContainer}>
              {formData.writtenBy}
            </div>
          </div>
          <hr className={detailsPage.line(theme)} />

          <div className={detailsPage.detailRow}>
            <label htmlFor="isbn" className={createPage.label}>
              <strong>Written Date Range</strong>
            </label>
            <div className={detailsPage.displayContainer}>
              {formData.writtenDateRange}
            </div>
          </div>
          <hr className={detailsPage.line(theme)} />

          <div className={detailsPage.detailRow}>
            <label htmlFor="hymnNumber" className={createPage.label}>
              <strong>History</strong>
            </label>
            <div className={detailsPage.displayContainer}>
              {formData.history}
            </div>
          </div>
          <hr className={detailsPage.line(theme)} />

          {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
          <div className="mb-2">
            <div className={detailsPage.buttonContainer}>
              <button
                className={detailsPage.cancelButton}
                onClick={handleGoBack}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                className={detailsPage.backButton}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={detailsPage.editButton}
                disabled={isSubmitting}
              >
                Confirm
              </button>
            </div>
            <div className="mb-2">
              {errors.root && (
                <p className={createPage.errorText}>{errors.root.message}</p>
              )}
            </div>
          </div>
        </div>
        {isSongCreated && <SongCreated setIsSongCreated={setIsSongCreated} />}
      </div>
    </>
  );
};

export default Song03InfoReview;
