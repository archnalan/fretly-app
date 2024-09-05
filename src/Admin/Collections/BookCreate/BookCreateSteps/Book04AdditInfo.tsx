import React from "react";
import { useFormContext } from "react-hook-form";
import BookHeader from "../SharedSections/BookHeader";
import { DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { SongBookCreateModel } from "../../../../DataModels/SongBookModel";
import { createPage } from "../../../SharedClassNames/createPage";
import BookProgressbar from "../BookProgressbar";
import { useThemeContext } from "../../../../Contexts/ThemeContext";

const Book04AdditInfo: React.FC = () => {
  const {
    register,
    watch,
    trigger,
    setValue,
    formState: { errors, isValid },
  } = useFormContext<SongBookCreateModel>();

  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const valid = !errors.author && !errors.description;

  const goToStep5 = async () => {
    const isValid = await trigger(["author", "description"]);
    if (isValid) {
      navigate("/admin/songbooks/create/step5");
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
          <label htmlFor="hymnAuthor" className={createPage.label}>
            <strong>Author</strong>
          </label>
          <div className={createPage.inputContainer}>
            <input
              type="text"
              className={createPage.input}
              {...register("author")}
            />
            {errors.author && (
              <p className="text-danger text-sm">{errors.author.message}</p>
            )}
          </div>
        </div>

        <div className={createPage.form}>
          <label htmlFor="description" className={createPage.label}>
            <strong>Description</strong>
          </label>
          <div className={createPage.inputContainer}>
            <textarea
              className="input input-bordered h-20 w-full form-control overflow-scroll "
              {...register("description")}
            ></textarea>
            {errors.description && (
              <p className={createPage.errorText}>
                {errors.description.message}
              </p>
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
            disabled={!valid}
            onClick={goToStep5}
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default Book04AdditInfo;
