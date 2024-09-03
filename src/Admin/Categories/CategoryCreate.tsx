import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { CategoryModel, CategorySchema } from "../../DataModels/CategoryModel";
import CategoryRequest from "../../API/CategoryRequest";
import { createPage } from "../SharedClassNames/createPage";
import { useThemeContext } from "../../Contexts/ThemeContext";
import CategorySuccess from "./CategorySuccess";

const CategoryCreate: React.FC = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryModel>({
    resolver: zodResolver(CategorySchema),
    mode: "all",
    defaultValues: {
      id: 0,
      sorting: 100,
    },
  });

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const { theme } = useThemeContext();

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
        setCategories(categoryResult.data);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    getCategories();
  }, []);

  const onSubmit = async (data: CategoryModel) => {
    console.log("🚀 ~ sendCategoryData ~ hymnCategory:", data);
    try {
      const response = await CategoryRequest.createCategory(data);

      console.log("🚀 ~ sendCategoryData ~ response:", response);

      if (response.status === 201) {
        setOpenSuccess(true);
      }
    } catch (error) {
      console.error("Error Sending Data", error);
    }
  };

  return (
    <div className={createPage.container}>
      <div className={createPage.innerContainer(theme)}>
        <h1 className={createPage.header}>Create a Category</h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={createPage.form}>
              <label htmlFor="title" className={createPage.label}>
                <strong>Name</strong>
              </label>
              <div className={createPage.inputContainer}>
                <input
                  type="text"
                  className={createPage.input}
                  {...register("name")}
                />
                {errors.name && (
                  <p className={createPage.errorText}>{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className={createPage.selectContainer}>
              <label htmlFor="hymnTitle" className={createPage.label}>
                <strong>Category</strong>
              </label>
              <div className={createPage.selectInnerContainer}>
                <select
                  {...register("parentCategoryId", {
                    setValueAs: (v: string) => (v === "" ? null : Number(v)),
                  })}
                  id="category-select"
                  className={createPage.selectElement}
                >
                  <option value="" disabled selected>
                    No Parent Category
                  </option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {errors.parentCategoryId && (
                  <p className="text-danger text-sm">
                    {errors.parentCategoryId.message}
                  </p>
                )}
              </div>
            </div>

            {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            <div className={createPage.buttonContainer}>
              <Link to="/admin/categories">
                <button className={createPage.backButton}>Cancel</button>
              </Link>
              <button
                type="submit"
                className={createPage.saveButton}
                disabled={isSubmitting}
              >
                Save
              </button>
            </div>
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
