import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CategoryModel, CategorySchema } from "../../DataModels/CategoryModel";
import { idSchema } from "../../DataModels/ValidatedID";
import CategoryRequest from "../../API/CategoryRequest";
import { detailsPage } from "../SharedClassNames/detailsPage";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { IoMdArrowRoundBack } from "react-icons/io";

const CategoryDetails: React.FC = () => {
  const [category, setCategory] = useState<CategoryModel>({
    id: 0,
    name: "",
    categorySlug: "",
    parentCategoryId: null,
    sorting: 0,
  });

  const [categories, setCategories] = useState<CategoryModel[]>([]);
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
        if (songResult.success) {
          setCategory(songResult.data);
        } else {
          console.error("🚀 ~ ValidationError:", songResult.error);
        }
      } catch (error) {
        console.error("🚀 ~ getCategory ~ error:", error);
      }
    };
    getCategory();
  }, []);

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

  return (
    <div className={detailsPage.container}>
      <div className={detailsPage.innerContainer(theme)}>
        <div className={detailsPage.revertContainer}>
          <button
            onClick={() => navigate(-1)}
            className={detailsPage.revertButton}
          >
            <IoMdArrowRoundBack />
          </button>
          <h2 className={detailsPage.header}>Category Details</h2>
        </div>

        <div className={detailsPage.detailRow}>
          <strong>Name</strong>
          <span>{category.name}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Slug</strong>
          <span>{category.categorySlug}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>Sorting</strong>
          <span>{category.sorting}</span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.detailRow}>
          <strong>ParentCategory</strong>
          <span>
            {
              categories.find((cat) => cat.id === category.parentCategoryId)
                ?.name
            }
          </span>
        </div>
        <hr className={detailsPage.line(theme)} />

        <div className={detailsPage.buttonContainer}>
          <button
            onClick={() => navigate(-1)}
            className={detailsPage.backButton}
          >
            Back
          </button>
          <Link
            to={`/admin/categories/edit/${id}`}
            className={detailsPage.editButton}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
