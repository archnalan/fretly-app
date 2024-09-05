import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { CategoryModel, CategorySchema } from "../../DataModels/CategoryModel";
import CategoryRequest from "../../API/CategoryRequest";
import { createPage } from "../SharedClassNames/createPage";
import { useThemeContext } from "../../Contexts/ThemeContext";
import CategorySuccess from "./CategorySuccess";
import axios from "axios";

const CategoryCreate: React.FC = () => {
  const {
    register,
    watch,
    trigger,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CategoryModel>({
    resolver: zodResolver(CategorySchema),
    mode: "all",
    defaultValues: {
      id: 0,
      sorting: 100,
    },
  });

  /* const [categories, setCategories] = useState<CategoryModel[]>([]); */
  const [parentCategories, setParentCategories] = useState<CategoryModel[]>([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const { theme } = useThemeContext();
  const categoryId = watch("parentCategoryId");

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await CategoryRequest.fetchAllCategories();

        const categoryResult = CategorySchema.array().safeParse(
          response.data.$values
        );
        if (!categoryResult.success) {
          console.error(
            "🚀 ~ getCategories ~ categoryResult.error:",
            categoryResult.error
          );
          return;
        }
        const categories = categoryResult.data;
        if (categories) {
          /* setCategories(categories); */

          const parentCategories = categories.filter(
            (cat) => cat.parentCategoryId === null
          );

          setParentCategories(parentCategories);
        }
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    getCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors.root) {
      setError("root", {});
    }
    setValue("name", e.target.value);
    trigger("name"); //get realtime feedback
  };

  const onSubmit = async (data: CategoryModel) => {
    console.log("🚀 ~ sendCategoryData ~ hymnCategory:", data);
    try {
      const response = await CategoryRequest.createCategory(data);

      console.log("🚀 ~ sendCategoryData ~ response:", response);

      if (response.status === 201) {
        setOpenSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverMessage = error.response.data;
        setError("root", { message: serverMessage });
      } else {
        setError("root", {
          message: `Category ${data.name} not created. Try Again!`,
        });
      }
    }
  };

  return (
    <div className={createPage.containerSmall}>
      <div className={createPage.innerContainer(theme)}>
        <h1 className={createPage.header}>Create a Category</h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={createPage.form}>
              <label htmlFor="name" className={createPage.labelRequired}>
                <strong>Name</strong>
              </label>
              <div className={createPage.inputContainer}>
                <input
                  type="text"
                  className={createPage.input}
                  name="name"
                  onChange={handleCategoryChange}
                />
                {errors.name && (
                  <p className={createPage.errorText}>{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className={createPage.selectContainer}>
              <label htmlFor="category" className={createPage.label}>
                <strong>Category</strong>
              </label>
              <div className={createPage.selectInnerContainer}>
                <select
                  {...register("parentCategoryId", {
                    setValueAs: (v: string) => (v === "" ? null : Number(v)),
                  })}
                  id="category-select"
                  className={createPage.selectElement}
                  value={categoryId || ""}
                >
                  <option value="">No Parent Category</option>
                  {parentCategories &&
                    parentCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {errors.parentCategoryId && (
                  <p className={createPage.errorText}>
                    {errors.parentCategoryId.message}
                  </p>
                )}
              </div>
            </div>

            <pre>{JSON.stringify(watch(), null, 2)}</pre>
            <div className={createPage.buttonContainer}>
              <Link to="/admin/categories">
                <button className={createPage.backButton}>Cancel</button>
              </Link>
              <button
                type="submit"
                className={createPage.saveButton}
                disabled={isSubmitting || !isValid}
              >
                Save
              </button>
            </div>
            {errors.root && (
              <p className={createPage.errorText}>{errors.root.message}</p>
            )}
          </form>
        </div>
      </div>
      {openSuccess && (
        <CategorySuccess
          categoryName={watch().name}
          setOpenSuccess={setOpenSuccess}
        />
      )}
    </div>
  );
};

export default CategoryCreate;
