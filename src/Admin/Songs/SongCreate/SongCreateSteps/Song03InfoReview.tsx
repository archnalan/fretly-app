import React, { useEffect, useState } from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SongHeader from "./SongHeader";
import SongCreated from "../SongCreated";
import { SongCreateModel } from "../../../../DataModels/SongModel";
import { createPage } from "../../../SharedClassNames/createPage";
import { useThemeContext } from "../../../../Contexts/ThemeContext";
import { detailsPage } from "../../../SharedClassNames/detailsPage";
import SongProgressbar from "../../SongProgressbar";
import SongRequest from "../../../../API/SongRequest";
import axios from "axios";

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
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<SongCreateModel>();
  const formData = watch();

  const [headerText, setHeaderText] = useState("Create");
  const [successMessage, setSuccessMessage] = useState("created");
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const handleGoBack = () => {
    setError("root", {});
    Promise.resolve().then(() => {
      navigate(-1);
    });
  };

  useEffect(() => {
    if (formData.id) {
      setHeaderText("Edit");
    }
  }, [formData]);

  const handleSend = () => {
    if (!isValid) {
      console.log("🚀 ~ handleSend ~ isValid:", isValid);
      console.log("error", errors.root?.message);
      console.log("error", errors.addedBy?.message);
      console.log("error", errors.title?.message);
      console.log("error", errors.slug?.message);
      console.log("error", errors.categoryName?.message);
      console.log("error", errors.writtenBy?.message);
      console.log("error", errors.history?.message);
      console.log("error", errors.id?.message);
      console.log("error", errors.number?.message);
      console.log("error", errors.categoryId?.message);
      console.log("error", errors.writtenDateRange?.message);
    }
    onSubmit(formData);
  };

  const onSubmit: SubmitHandler<SongCreateModel> = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      let response: any;
      if (data.id) {
        response = await SongRequest.editSong(data.id, data);
      } else {
        response = await SongRequest.createSong(data);
      }
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<HymnCreateModel>= ~ response:",
        response.status
      );
      if (response && response.status === 201) {
        setIsSongCreated(true);
        setSuccessMessage("created");
      }
      if (response && response.status === 200) {
        setIsSongCreated(true);
        setSuccessMessage("edited");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError("root", {
          message: error.response.data || "An Error occured at the server",
        });
      } else {
        setError("root", {
          message: "An Unexpected Error occured. Please Try Again!",
        });
      }
    }
  };

  return (
    <>
      <div className={createPage.container}>
        <div className={createPage.progressbar}>
          <SongProgressbar />
        </div>
        <div className={createPage.innerContainer(theme)}>
          <div className={createPage.header}>
            <SongHeader headText={headerText} />
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
                onClick={() => navigate("/admin/songs")}
              >
                Cancel
              </button>
              <button
                type="button"
                className={detailsPage.editButton}
                disabled={isSubmitting}
                onClick={handleSend}
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
        {isSongCreated && (
          <SongCreated
            setIsSongCreated={setIsSongCreated}
            successType={successMessage}
          />
        )}
      </div>
    </>
  );
};

export default Song03InfoReview;
