import React, { useEffect, useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import BookHeader from "../SharedSections/BookHeader";
import {
  BookCreateSchema,
  SongBookCreateModel,
  SongBookModel,
  SongBookSchema,
} from "../../../../DataModels/SongBookModel";
import BookProgressbar from "../BookProgressbar";
import { createPage } from "../../../SharedClassNames/createPage";
import { useThemeContext } from "../../../../Contexts/ThemeContext";
import { idSchema } from "../../../../DataModels/ValidatedID";
import BookRequest from "../../../../API/BookRequest";
import moment from "moment";

const Book01BasicInfo: React.FC = () => {
  const {
    register,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext<SongBookCreateModel>();

  const [bookEditData, setBookEditData] = useState<
    SongBookCreateModel | undefined
  >(undefined);
  const { id } = useParams();
  useEffect(() => {
    console.log("Id", id);
    if (id) {
      const getBook = async () => {
        try {
          const validatedId = idSchema.parse(id);
          const response = await BookRequest.fetchSpecificSongBook(validatedId);

          const bookResult = BookCreateSchema.safeParse(response.data);
          if (!bookResult.success) {
            console.error("🚀 ~ getSong ~ songResult.error:", bookResult.error);
            return;
          }
          setBookEditData(bookResult.data);
          /* populate the fields */
          Object.entries(bookResult.data).forEach(([key, value]) => {
            if (key === "publicationDate") {
              setValue(
                key as keyof SongBookCreateModel,
                moment(value).format("YYYY-MM-DD")
              );
            } else {
              setValue(key as keyof SongBookCreateModel, value);
            }
          });
        } catch (error) {
          console.error("Error fetching song", error);
        }
      };
      getBook();
    }
  }, [id]);

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
            onClick={() => navigate(-1)}
            className={createPage.backButton}
          >
            Back
          </button>

          <button
            className={createPage.saveButton}
            onClick={goToStep2}
            disabled={!valid}
          >
            Next
          </button>
        </div>

        {/*  <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      </div>
    </div>
  );
};

export default Book01BasicInfo;
