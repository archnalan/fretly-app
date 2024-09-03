import React, { useEffect, useState } from "react";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiList, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import Pagination from "../../Helper/Pagination";
import { CategoryModel, CategorySchema } from "../../DataModels/CategoryModel";
import CategoryRequest from "../../API/CategoryRequest";
import { MessageSchema } from "../../DataModels/SuccessMessage";
import CategoryDelete from "./CategoryDelete";
import { listPage } from "../SharedClassNames/ListPage";
import { useThemeContext } from "../../Contexts/ThemeContext";
import "./alertDiv.css";

const Category: React.FC = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [newList, setNewList] = useState("");
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [toDelete, setToDelete] = useState<CategoryModel | undefined>(
    undefined
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [categoriesPerPage] = useState(7);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const [filteredCategories, setfilteredCategories] = useState<CategoryModel[]>(
    []
  );

  useEffect(() => {
    const getCategories = async () => {
      const response = await CategoryRequest.fetchAllCategories();

      const validatedCategory = CategorySchema.array().safeParse(
        response.data.$values
      );
      if (!validatedCategory.success) {
        console.error(
          "🚀 ~ getCategories ~ validatedCategory.error:",
          validatedCategory.error.issues
        );
        return;
      }
      if (validatedCategory.success || newList) {
        setCategories(validatedCategory.data);
        setfilteredCategories(validatedCategory.data);
      }
    };
    getCategories();
  }, [newList]);

  useEffect(() => {
    if (location.state?.successMessage) {
      const successMessage = MessageSchema.parse(location.state.successMessage);
      console.log(
        "🚀 ~ useEffect ~ location.state?.successMessage:",
        successMessage
      );
      setSuccessMessage(successMessage);
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
      //clear the success state object
      navigate(location.pathname, { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (categories) {
        const searchResult = categories.filter(
          (category) =>
            String(category.parentCategoryId).includes(searchQuery) ||
            String(category.sorting).includes(normalizedQuery) ||
            category.name.toLowerCase().includes(searchQuery)
        );
        setfilteredCategories(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredCategories(categories);
    }
  };

  const handleDelete = (name: string, id: number) => {
    const deleteCategory = async () => {
      try {
        const response = await CategoryRequest.deleteCategory(id);

        console.log("🚀 ~ deleteCategory ~ response:", response);

        setNewList(name);
        /*  window.location.reload(); */
      } catch (error) {
        console.error("Error deleting Category", error);
        setOpenConfirm(false);
        setErrorDelete(`${name} could not be deleted. Try Again!`);

        // Set a timeout to clear the error message after 3 seconds
        setTimeout(() => {
          setErrorDelete("");
        }, 3000);
      }
    };
    deleteCategory();
  };

  const handlePageChange = (selected: number) => {
    setCurrentPageIndex(selected);
  };
  const pageCount = Math.ceil(filteredCategories.length / categoriesPerPage);
  const offset = currentPageIndex * categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    offset,
    offset + categoriesPerPage
  );

  return (
    <div className={listPage.container}>
      <div className={listPage.innerContainer(theme)}>
        <h1 className={listPage.header}>List of categories</h1>
        {successMessage && (
          <div className={listPage.successAlert} role="alert">
            {successMessage}
          </div>
        )}
        {errorDelete && (
          <div
            className={listPage.errorAlert}
            style={{
              animation: errorDelete
                ? "slideOut 0.2s ease 2.8s forwards"
                : "none",
            }}
            role="alert"
          >
            {errorDelete}
          </div>
        )}
        <div className={listPage.contentContainer}>
          <div className={listPage.searchContainer}>
            <div className={listPage.searchInputContainer}>
              <input
                type="text"
                className={listPage.searchInput}
                placeholder="search a category..."
                onChange={handleSearch}
              />
              <button className={listPage.searchButton}>
                <IoSearchOutline />
              </button>
            </div>
            <Link
              to="/admin/categories/create"
              className={listPage.createButton}
            >
              <RiStickyNoteAddFill />
            </Link>
          </div>
          <div className={listPage.tableContainer}>
            <table className={listPage.table}>
              <thead className={listPage.tableHeader(theme)}>
                <tr>
                  <td className="col-number">ID</td>
                  <td className="col-title">Name</td>
                  <td className="col-category">Category-slug</td>
                  <td className="col-author">Sorting</td>
                  <td className="col-actions">Actions</td>
                </tr>
              </thead>

              <tbody className="table-group-divider">
                {currentCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{String(category.id).padStart(3, "0")}</td>
                    <td>{category.name}</td>
                    <td>{category.categorySlug}</td>
                    <td>{category.sorting}</td>
                    <td>
                      <Link
                        to={`${category.id}`}
                        className={listPage.detailsButton}
                      >
                        <FiList />
                      </Link>
                      <Link
                        to={`edit/${category.id}`}
                        className={listPage.editButton}
                      >
                        <FiEdit />
                      </Link>
                      <button
                        className={listPage.deleteButton}
                        onClick={() => {
                          setToDelete(category);
                          setOpenConfirm(true);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={listPage.paginationContainer}>
          <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
        {openConfirm && toDelete && (
          <CategoryDelete
            title={toDelete.name}
            categoryId={toDelete.id}
            setOpenConfirm={setOpenConfirm}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Category;
