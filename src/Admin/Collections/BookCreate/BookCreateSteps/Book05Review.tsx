import React from "react";
import { useFormContext } from "react-hook-form";
import BookHeader from "../SharedSections/BookHeader";
import { useNavigate } from "react-router-dom";
import { detailsPage } from "../../../SharedClassNames/detailsPage";
import { useThemeContext } from "../../../../Contexts/ThemeContext";
import { createPage } from "../../../SharedClassNames/createPage";
import BookProgressbar from "../BookProgressbar";
import { SongBookCreateModel } from "../../../../DataModels/SongBookModel";

type reviewProps = {
  onSubmit: () => void;
};
const Book05Review: React.FC<reviewProps> = ({ onSubmit }) => {
  const {
    watch,
    formState: { isSubmitting, isValid, errors },
  } = useFormContext<SongBookCreateModel>();
  const formData = watch();
  const handleSend = () => {
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
    onSubmit();
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
            type="submit"
            className={detailsPage.editButton}
            disabled={isSubmitting}
            onClick={handleSend}
          >
            Confirm
          </button>
        </div>
      </div>
      <div className="mt-12"></div>
    </div>
  );
};

export default Book05Review;
