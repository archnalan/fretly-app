import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import SongHeader from "./SongHeader";
import {
  SongCreateModel,
  SongCreateSchema,
  SongSchema,
} from "../../../../DataModels/SongModel";
import { createPage } from "../../../SharedClassNames/createPage";
import { useThemeContext } from "../../../../Contexts/ThemeContext";
import SongProgressbar from "../../SongProgressbar";
import { idSchema } from "../../../../DataModels/ValidatedID";
import SongRequest from "../../../../API/SongRequest";

const Song01BasicInfo: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<SongCreateModel>();
  const [headerText, setHeaderText] = useState("Create");
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    setValue("number", num);
    trigger("number");
  };
  const [songEditData, setSongEditData] = useState<SongCreateModel | undefined>(
    undefined
  );
  const { id } = useParams();
  useEffect(() => {
    console.log("Id", id);
    if (id) {
      const getSong = async () => {
        try {
          const validatedId = idSchema.parse(id);
          const response = await SongRequest.fetchSpecificSong(validatedId);

          const songResult = SongSchema.safeParse(response.data);
          if (!songResult.success) {
            console.error("🚀 ~ getSong ~ songResult.error:", songResult.error);
            return;
          }
          setSongEditData(songResult.data);
          setHeaderText("Edit");
          /* populate the fields */
          Object.entries(songResult.data).forEach(([key, value]) => {
            setValue(key as keyof SongCreateModel, value);
          });
        } catch (error) {
          console.error("Error fetching song", error);
        }
      };
      getSong();
    }
  }, [id]);

  const valid = !errors.number && !errors.title && !errors.writtenBy;

  const goToStep2 = async () => {
    const isValid = await trigger(["number", "title", "writtenBy"]);
    if (isValid) {
      navigate("/admin/songs/create/step2");
    }
  };

  return (
    <div className={createPage.container}>
      <div className={createPage.progressbar}>
        <SongProgressbar />
      </div>
      <div className={createPage.innerContainer(theme)}>
        <div className={createPage.header}>
          <SongHeader headText={headerText} />
        </div>
        <div className={createPage.form}>
          <label htmlFor="number" className={createPage.labelRequired}>
            <strong>Number</strong>
          </label>
          <div className={createPage.inputContainer}>
            <input
              onBlur={() => {
                trigger("number");
              }}
              onChange={handleNumChange}
              value={watch("number")}
              type="number"
              className={createPage.input}
              min="1"
              step="1"
            />
            {errors.number && (
              <p className={createPage.errorText}>{errors.number.message}</p>
            )}
          </div>
        </div>

        <div className={createPage.form}>
          <label htmlFor="title" className={createPage.labelRequired}>
            <strong>Title</strong>
          </label>
          <div className={createPage.inputContainer}>
            <input
              type="text"
              className={createPage.input}
              {...register("title")}
            />
            {errors.title && (
              <p className={createPage.errorText}>{errors.title.message}</p>
            )}
          </div>
        </div>

        <div className={createPage.form}>
          <label htmlFor="author" className={createPage.label}>
            <strong>Author</strong>
          </label>
          <div className={createPage.inputContainer}>
            <input
              type="text"
              className={createPage.input}
              {...register("writtenBy")}
            />
            {errors.writtenBy && (
              <p className={createPage.errorText}>{errors.writtenBy.message}</p>
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
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      </div>
    </div>
  );
};

export default Song01BasicInfo;
