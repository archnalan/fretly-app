import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import BookHeader from "../SharedSections/BookHeader";
import { DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { SongBookCreateModel } from "../../../../DataModels/SongBookModel";
import BookProgressbar from "../BookProgressbar";
import { createPage } from "../../../SharedClassNames/createPage";
import { useThemeContext } from "../../../../Contexts/ThemeContext";

const Book03PubInfo: React.FC = () => {
  const {
    register,
    watch,
    trigger,
    control,
    setValue,
    formState: { errors, isValid },
  } = useFormContext<SongBookCreateModel>();

  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const valid = !errors.publisher && !errors.publicationDate;

  const goToStep4 = async () => {
    const isValid = await trigger(["publisher", "publicationDate"]);
    if (isValid) {
      navigate("/admin/songbooks/create/step4");
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
          <label htmlFor="publisher" className={createPage.label}>
            <strong>Publisher</strong>
          </label>
          <div className={createPage.inputContainer}>
            <input
              type="text"
              className={createPage.input}
              {...register("publisher")}
            />
            {errors.publisher && (
              <p className={createPage.errorText}>{errors.publisher.message}</p>
            )}
          </div>
        </div>

        <div className={createPage.form}>
          <label htmlFor="hymnWrittenDate" className={createPage.labelRequired}>
            <strong>Publication Date:</strong>
          </label>
          <div className={createPage.inputContainer}>
            <Controller
              name="publicationDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  picker="month"
                  format="MMMM YYYY"
                  onChange={(date) => {
                    const yearString = date?.year().toString();
                    const monthString = (date?.month() + 1)
                      .toString()
                      .padStart(2, "0");
                    const formattedDate = `${yearString}-${monthString}-01T00:00:00`;
                    field.onChange(formattedDate);
                  }}
                  className={createPage.input}
                />
              )}
            />
            {errors.publicationDate && (
              <p className={createPage.errorText}>
                {errors.publicationDate.message}
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
            onClick={goToStep4}
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default Book03PubInfo;
