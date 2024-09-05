import React, { useEffect } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BookHeader from "../SharedSections/BookHeader";
import { SongBookCreateModel } from "../../../../DataModels/SongBookModel";
import BookProgressbar from "../BookProgressbar";
import { createPage } from "../../../SharedClassNames/createPage";
import { useThemeContext } from "../../../../Contexts/ThemeContext";

const Book01BasicInfo: React.FC = () => {
  const {
    register,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<SongBookCreateModel>();

  const valid = !errors.title && !errors.subTitle && !errors.language;

  const goToStep2 = async () => {
    const isValid = await trigger(["title", "subTitle", "language"]);
    if (isValid) {
      navigate("/admin/songbooks/create/step2");
    }
  };

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Luganda",
    "Kiswahili",
    "Kinyarwanda",
    "Runyankole",
  ];

  const navigate = useNavigate();
  const { theme } = useThemeContext();

  return (
    <div className={createPage.container}>
      <div className={createPage.progressbar}>
        <BookProgressbar />
      </div>
      <div className={createPage.innerContainer(theme)}>
        <div className={createPage.header}></div>
        <BookHeader />
        <div className={createPage.form}>
          <label htmlFor="title" className={createPage.labelRequired}>
            <strong>Title</strong>
          </label>
          <div className={createPage.inputContainer}>
            <input
              type="text"
              className={createPage.input}
              {...register("title", {
                required: "title is required",
              })}
            />
            {errors.title && (
              <p className={createPage.errorText}>{errors.title.message}</p>
            )}
          </div>
        </div>

        <div className={createPage.form}>
          <label htmlFor="subTitle" className={createPage.label}>
            <strong>Subtitle</strong>
          </label>
          <div className={createPage.inputContainer}>
            <input
              type="text"
              className={createPage.input}
              {...register("subTitle")}
            />
            {errors.subTitle && (
              <p className="text-danger text-sm">{errors.subTitle.message}</p>
            )}
          </div>
        </div>

        <div className={createPage.form}>
          <label htmlFor="language" className={createPage.label}>
            <strong>Language</strong>
          </label>
          <div className={createPage.selectInnerContainer}>
            <select
              className={createPage.selectElement}
              {...register("language")}
            >
              {languages.map((lang, index) => (
                <option key={index} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            {errors.language && (
              <p className={createPage.errorText}>{errors.language.message}</p>
            )}
          </div>
        </div>

        <div className={createPage.buttonContainer}>
          <button
            className={createPage.saveButton}
            onClick={goToStep2}
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

export default Book01BasicInfo;
