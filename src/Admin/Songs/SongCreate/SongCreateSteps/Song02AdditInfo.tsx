import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SongHeader from "./SongHeader";
import { SongCreateModel } from "../../../../DataModels/SongModel";
import YearRangePicker from "../../../AdminHelper/YearRangePicker";
import { createPage } from "../../../SharedClassNames/createPage";
import { useThemeContext } from "../../../../Contexts/ThemeContext";
import SongProgressbar from "../../SongProgressbar";
import CategoryRequest from "../../../../API/CategoryRequest";
import {
  CategoryModel,
  CategorySchema,
} from "../../../../DataModels/CategoryModel";

const Song02AdditInfo: React.FC = () => {
  const {
    register,
    watch,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<SongCreateModel>();

  const [categories, setCategories] = useState<CategoryModel[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await CategoryRequest.fetchAllCategories();

      const validatedCategories = CategorySchema.array().safeParse(
        response.data.$values
      );
      if (!validatedCategories.success) {
        console.error(
          "🚀 ~ fetchCategories ~ validatedCategories.error:",
          validatedCategories.error
        );
        return;
      }
      setCategories(validatedCategories.data);
    };
    fetchCategories();
  }, []);

  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const categoryId = watch("categoryId");

  const valid =
    !errors.writtenDateRange && !errors.categoryId && !errors.history;

  const goToStep3 = async () => {
    const isValid = await trigger([
      "writtenDateRange",
      "categoryId",
      "history",
    ]);
    if (isValid) {
      navigate("/admin/songs/create/step3");
    }
  };

  return (
    <div className={createPage.container}>
      <div className={createPage.progressbar}>
        <SongProgressbar />
      </div>
      <div className={createPage.innerContainer(theme)}>
        <div className={createPage.header}>
          <SongHeader />
        </div>
        <div className={createPage.form}>
          <label htmlFor="category" className={createPage.labelRequired}>
            <strong>Category</strong>
          </label>
          <div className="w-3/4 mb-2">
            <div className={createPage.selectContainer}>
              <select
                {...register("categoryId", {
                  setValueAs: (v: string) => (v === "" ? null : Number(v)),
                })}
                onChange={(e) => {
                  setValue("categoryId", Number(e.target.value));
                  setValue(
                    "categoryName",
                    categories.find((cat) => cat.id === Number(e.target.value))
                      ?.name
                  );
                  trigger("categoryId");
                }}
                value={categoryId || ""}
                name="category"
                id="category-select"
                className={createPage.selectElement}
              >
                <option value="" disabled>
                  Pick a Category
                </option>
                {categories &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            {errors.categoryId && (
              <p className={createPage.errorText}>
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        <div className={createPage.form}>
          <label htmlFor="writtenDateRange" className={createPage.label}>
            <strong>Written Dates</strong>
          </label>
          <div className="">
            <Controller
              name="writtenDateRange"
              control={control}
              render={({ field }) => (
                <YearRangePicker
                  yearStart={
                    field.value ? parseInt(field.value.split("-")[0], 10) : null
                  }
                  yearEnd={
                    field.value ? parseInt(field.value.split("-")[1], 10) : null
                  }
                  onChange={(range) => {
                    if (range) {
                      field.onChange(`${range[0]}-${range[1]}`);
                    } else {
                      field.onChange(null);
                    }
                  }}
                />
              )}
            />
            {errors.writtenDateRange && (
              <p className={createPage.errorText}>
                {errors.writtenDateRange.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 mb-5 relative">
          <textarea
            id="floatingTextarea2"
            className={createPage.textareaFloat}
            placeholder=" "
            {...register("history")}
          ></textarea>
          <label htmlFor="floatingTextarea2" className={createPage.labelFloat}>
            History
          </label>
          {errors.history && (
            <p className={createPage.errorText}>{errors.history.message}</p>
          )}
        </div>

        <div className={createPage.buttonContainer}>
          <button
            className={createPage.backButton}
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className={createPage.saveButton}
            disabled={!valid}
            onClick={goToStep3}
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default Song02AdditInfo;
