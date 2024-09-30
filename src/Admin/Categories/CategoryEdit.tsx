import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryModel, CategorySchema } from "../../DataModels/CategoryModel";
import { idSchema } from "../../DataModels/ValidatedID";
import CategoryRequest from "../../API/CategoryRequest";
import CategoryEditSuccess from "./CategoryEditSuccess";
import { editPage } from "../SharedClassNames/editPage";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { IoMdArrowRoundBack } from "react-icons/io";

const CategoryEdit: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryModel>({
    mode: "all",
    resolver: zodResolver(CategorySchema),
  });

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryModel | undefined>(
    undefined
  );
  const [openEditSuccess, setOpenEditSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const validatedId = idSchema.parse(id);
        const response = await CategoryRequest.fetchSpecificCategory(
          validatedId
        );

        const songResult = CategorySchema.safeParse(response.data);
        if (!songResult.success) {
          console.error("🚀 ~ getSong ~ songResult.error:", songResult.error);
          return;
        }
        setCategoryData(songResult.data);
      } catch (error) {
        console.error("Error fetching song", error);
      }
    };
    getCategory();
  }, [id]);

  useEffect(() => {
    if (categoryData) {
      /* Setting the default form values*/
      setValue("id", categoryData.id);
      setValue("name", categoryData.name);
      setValue("sorting", categoryData.sorting);
      setValue("parentCategoryId", categoryData.parentCategoryId);
      setValue("categorySlug", categoryData.categorySlug);
    }
  }, [categoryData]);

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
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      const validatedId = idSchema.parse(id);
      const validatedCategory = CategorySchema.safeParse(data);
      console.log("🚀 ~ onSubmit ~ validatedCategory:", validatedCategory);

      if (validatedCategory.success) {
        const response = await CategoryRequest.editCategory(
          validatedId,
          validatedCategory.data
        );
        console.log("🚀 ~ editSong ~  response:", response);
        if (response.status === 200) {
          setOpenEditSuccess(true);
        }
      }
    } catch (error) {
      console.error("Error Saving Song", error);
    }
  };

  return (
    <div className={editPage.container}>
      <div className={editPage.innerContainer(theme)}>
        <div className={editPage.revertContainer}>
          <button
            onClick={() => navigate(-1)}
            className={editPage.revertButton}
          >
            <IoMdArrowRoundBack />
          </button>
          <h2 className={editPage.header}>Edit Category</h2>
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={editPage.form}>
              <label htmlFor="title" className={editPage.label}>
                <strong>Name</strong>
              </label>
              <div className={editPage.inputContainer}>
                <input
                  type="text"
                  className={editPage.input}
                  {...register("name")}
                />
                {errors.name && (
                  <p className={editPage.errorText}>{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className={editPage.selectContainer}>
              <label htmlFor="hymnTitle" className={editPage.label}>
                <strong>Parent Category</strong>
              </label>
              <div className={editPage.selectInnerContainer}>
                <select
                  {...register("parentCategoryId", {
                    setValueAs: (v: string) => (v === "" ? null : Number(v)),
                  })}
                  onChange={(e) => {
                    setValue("parentCategoryId", Number(e.target.value));
                  }}
                  id="category-select"
                  className={editPage.selectElement}
                >
                  <option value="">No Parent Category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {errors.parentCategoryId && (
                  <p className={editPage.errorText}>
                    {errors.parentCategoryId.message}
                  </p>
                )}
              </div>
            </div>

            {/*  <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            <div className={editPage.buttonContainer}>
              <Link to="/admin/categories">
                <button className={editPage.backButton}>Cancel</button>
              </Link>
              <button
                type="submit"
                className={editPage.saveButton}
                disabled={isSubmitting}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      {openEditSuccess && (
        <CategoryEditSuccess
          setOpenEditSuccess={setOpenEditSuccess}
          categoryName={watch().name}
        />
      )}
    </div>
  );
};

export default CategoryEdit;
