import React from "react";
import { useFormContext } from "react-hook-form";
import BookHeader from "../SharedSections/BookHeader";
import { useNavigate } from "react-router-dom";
import { SongBookCreateModel } from "../../../../DataModels/SongBookModel";
import { createPage } from "../../../SharedClassNames/createPage";
import BookProgressbar from "../BookProgressbar";
import { useThemeContext } from "../../../../Contexts/ThemeContext";

const Book02DetailsInfo: React.FC = () => {
  const {
    register,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useFormContext<SongBookCreateModel>();

  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const valid = !errors.edition && !errors.isbn;

  const goToStep3 = async () => {
    const isValid = await trigger(["edition", "isbn"]);
    if (isValid) {
      navigate("/admin/songbooks/create/step3");
    }
  };

  return (
    <div className={createPage.container}>
      <div className={createPage.progressbar}>
        <BookProgressbar />
      </div>
      <div className={createPage.innerContainer(theme)}>
        <div className={createPage.header}>
          <BookHeader />
        </div>
        <div className={createPage.form}>
          <label htmlFor="edition" className={createPage.label}>
            <strong>Edition</strong>
          </label>
          <div className={createPage.inputContainer}>
            <input
              type="text"
              className={createPage.input}
              {...register("edition")}
            />
            {errors.edition && (
              <p className={createPage.errorText}>{errors.edition.message}</p>
            )}
          </div>
        </div>

        <div className={createPage.form}>
          <label htmlFor="isbn" className={createPage.labelRequired}>
            <strong>ISBN</strong>
          </label>
          <div className={createPage.inputContainer}>
            <input
              type="number"
              className={createPage.input}
              {...register("isbn")}
            />
            {errors.isbn && (
              <p className={createPage.errorText}>{errors.isbn.message}</p>
            )}
          </div>
        </div>

        <div className={createPage.buttonContainer}>
          <button
            className={createPage.backButton}
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            type="button"
            className={createPage.saveButton}
            onClick={goToStep3}
            disabled={!valid}
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default Book02DetailsInfo;
