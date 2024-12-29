import React, { useState } from "react";
import { SubmitHandler, UseFormReturn, useFormContext } from "react-hook-form";
import BookHeader from "../SharedSections/BookHeader";
import { useNavigate } from "react-router-dom";
import { detailsPage } from "../../../SharedClassNames/detailsPage";
import { useThemeContext } from "../../../../Contexts/ThemeContext";
import { createPage } from "../../../SharedClassNames/createPage";
import BookProgressbar from "../BookProgressbar";
import { SongBookCreateModel } from "../../../../DataModels/SongBookModel";
import { getCurrentTimeString } from "../../../AdminHelper/CurrentTime";
import BookCollectionSuccess from "../../BookCollectionSuccess";
import BookRequest from "../../../../API/BookRequest";
import axios from "axios";

type reviewProps = {
  methods: UseFormReturn<SongBookCreateModel>;
};
const Book05Review: React.FC<reviewProps> = ({ methods }) => {
  const {
    watch,
    formState: { isSubmitting, isValid, errors },
    setError,
  } = useFormContext<SongBookCreateModel>();
  const formData = watch();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMessage, setsuccessMessage] = useState("created");
  const handleSend = () => {
    formData.addedTime = getCurrentTimeString();
    if (!isValid) {
      console.log("🚀 ~ handleSend ~ isValid:", isValid);
      console.log("error", errors.root?.message);
      console.log("error", errors.addedBy?.message);
      console.log("error", errors.addedTime?.message);
      console.log("error", errors.author?.message);
      console.log("error", errors.description?.message);
      console.log("error", errors.edition?.message);
      console.log("error", errors.isbn?.message);
      console.log("error", errors.language?.message);
      console.log("error", errors.publicationDate?.message);
      console.log("error", errors.publisher?.message);
      console.log("error", errors.slug?.message);
      console.log("error", errors.subTitle?.message);
    }
    onSubmit(formData);
  };
  const onSubmit: SubmitHandler<SongBookCreateModel> = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    try {
      let response: any;

      if (data.id) {
        console.log("Edited response");
        response = await BookRequest.editSongBook(data.id, data);
      } else {
        console.log("create Response");
        response = await BookRequest.createSongBook(data);
      }

      console.log("🚀 ~ sendCollectionData ~ response:", response);

      if (response.status === 201) {
        setOpenSuccess(true);
        setsuccessMessage("created");
      }
      if (response.status === 200) {
        setOpenSuccess(true);
        setsuccessMessage("edited");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverMessage = error.response.data;
        setError("root", { message: serverMessage });
      } else {
        setError("root", {
          message: `Collection ${data.title} not created. Try Again!`,
        });
      }
    }
  };

  const navigate = useNavigate();
  const { theme } = useThemeContext();
  return (
    <div className={createPage.container}>
      <div className={createPage.progressbar}>
        <BookProgressbar />
      </div>
      <div className={createPage.innerContainer(theme)}>
        <div className={createPage.header}>
          <BookHeader />
        </div>

        <div className={detailsPage.detailRow}>
          <label htmlFor="title" className={createPage.label}>
            <strong>Title</strong>
          </label>
          <div className={detailsPage.displayContainer}>{formData.title}</div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <label htmlFor="subTitle" className={createPage.label}>
            <strong>Subtitle</strong>
          </label>
          <div className={detailsPage.displayContainer}>
            {formData.subTitle}
          </div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <label htmlFor="publisher" className={createPage.label}>
            <strong>Publisher:</strong>
          </label>
          <div className={detailsPage.displayContainer}>
            {formData.publisher}
          </div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <label htmlFor="isbn" className={createPage.label}>
            <strong>ISBN:</strong>
          </label>
          <div className={detailsPage.displayContainer}>{formData.isbn}</div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <label htmlFor="edition" className={createPage.label}>
            <strong>Edition:</strong>
          </label>
          <div className={detailsPage.displayContainer}>{formData.edition}</div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <label htmlFor="songNumber" className={createPage.label}>
            <strong>Language:</strong>
          </label>
          <div className={detailsPage.displayContainer}>
            {formData.language}
          </div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <label htmlFor="author" className={createPage.label}>
            <strong>Author:</strong>
          </label>
          <div className={detailsPage.displayContainer}>{formData.author}</div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <label htmlFor="WrittenDate" className={createPage.label}>
            <strong>Publication Date:</strong>
          </label>
          <div className={detailsPage.displayContainer}>
            {formData.publicationDate}
          </div>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <label htmlFor="description" className={createPage.label}>
            <strong>Description:</strong>
          </label>
          <div className={detailsPage.displayContainer}>
            {formData.description}
          </div>
        </div>
        <hr className={detailsPage.line(theme)} />

        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
        <div className={detailsPage.buttonContainer}>
          <button
            className={detailsPage.cancelButton}
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            className={detailsPage.backButton}
            disabled={isSubmitting}
            onClick={() => navigate("/admin/songbooks")}
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
      </div>
      <div className="mt-12"></div>
      {openSuccess && (
        <BookCollectionSuccess
          collectionTitle={formData.title}
          collectionMessage={successMessage}
          setOpenSuccess={setOpenSuccess}
        />
      )}
    </div>
  );
};

export default Book05Review;
