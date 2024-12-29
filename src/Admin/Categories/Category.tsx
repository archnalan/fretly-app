import React, { useEffect, useState } from "react";
import { RiMoreFill, RiStickyNoteAddFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiList, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import Pagination from "../../Helper/Pagination";
import { CategoryModel, CategorySchema } from "../../DataModels/CategoryModel";
import CategoryRequest from "../../API/CategoryRequest";
import { MessageSchema } from "../../DataModels/SuccessMessage";
import CategoryDelete from "./CategoryDelete";
import { listPage } from "../SharedClassNames/ListPage";
import { Theme, useThemeContext } from "../../Contexts/ThemeContext";
import "./alertDiv.css";
import ErrorMessage from "../AdminHelper/ErrorMessage";

const Category: React.FC = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [newList, setNewList] = useState("");
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [toDelete, setToDelete] = useState<CategoryModel[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryModel[]>(
    []
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [categoriesPerPage] = useState(6);
  const skeletonArray = Array.from({ length: categoriesPerPage });
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeContext();

  const [filteredCategories, setfilteredCategories] = useState<CategoryModel[]>(
    []
  );

  const tableHead = [
    { th: "ID", className: "col-Id" },
    { th: "Name", className: "col-name" },
    { th: "Category-slug", className: "col-category-slug" },
    { th: "Sorting", className: "col-sorting" },
    { th: "Actions", className: "col-actions" },
  ];
  const tableSkeletons = [...tableHead, { th: "check" }];

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
  useEffect(() => {
    // Fetch theme from local storage
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      // Apply the stored theme
      document.documentElement.setAttribute("data-theme", storedTheme);
      setTheme(storedTheme as Theme);
    } else {
      // Set initial theme based on system preference or default
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = prefersDarkMode ? "dark" : "autumn";
      document.documentElement.setAttribute("data-theme", initialTheme);
      setTheme(initialTheme);
    }
  }, [theme]);
  const handleDelete = (name: string, id: number) => {
    const deleteCategory = async () => {
      try {
        const response = await CategoryRequest.deleteCategory(id);

        console.log("🚀 ~ deleteCategory ~ response:", response);

        setNewList(name);
        setSelectedCategories([]);
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

  const handleSelectPage = (page: CategoryModel, isChecked: boolean) => {
    setSelectedCategories((prevSelectedCategories) =>
      isChecked
        ? [...prevSelectedCategories, page]
        : prevSelectedCategories.filter((p) => p.id !== page.id)
    );
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
        {errorDelete && <ErrorMessage errorMessage={errorDelete} />}

        <h1 className={listPage.header}>categories</h1>
        {successMessage && (
          <div className={listPage.toastContainer}>
            <div className={listPage.toastDiv}>
              <span>{successMessage}</span>
            </div>
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
                <IoSearchOutline size={20} />
              </button>
            </div>
            <Link
              to="/admin/categories/create"
              className={listPage.createLinkContainer}
            >
              <label htmlFor="#createlink" className={listPage.createLinkLabel}>
                Add Category
              </label>
              <button id="createlink" className={listPage.createButton}>
                <RiStickyNoteAddFill />
              </button>
            </Link>
          </div>
        </div>
        <div className={listPage.tableContainer}>
          <table className={listPage.table(theme)}>
            <thead className={listPage.tableHead}>
              <tr>
                <th>
                  {selectedCategories.length > 0 && (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        setToDelete(selectedCategories);
                        setOpenConfirm(true);
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </th>
                {tableHead.map((header, index) => (
                  <th key={index} className={header.className}>
                    {header.th}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="table-group-divider">
              {currentCategories.length === 0
                ? skeletonArray.map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableSkeletons.map((_, colIndex) => (
                        <td key={colIndex} className="items-center">
                          <div className="skeleton w-full h-[2rem]  px-[0.5rem] border-none my-[0.5rem] "></div>
                        </td>
                      ))}
                    </tr>
                  ))
                : currentCategories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedCategories.some(
                              (p) => p.id === category.id
                            )}
                            onChange={(e) =>
                              handleSelectPage(category, e.target.checked)
                            }
                          />
                        </label>
                      </td>
                      <td>{String(category.id).padStart(3, "0")}</td>
                      <td>{category.name}</td>
                      <td>{category.categorySlug}</td>
                      <td>{category.sorting}</td>
                      <td>
                        <div className={listPage.dropdownContainer}>
                          <button
                            tabIndex={0}
                            className={listPage.dropdownActionButton}
                          >
                            <RiMoreFill size={24} />
                          </button>
                          <ul
                            tabIndex={1}
                            className={listPage.dropdownListContainter}
                          >
                            <li className="w-full">
                              <Link
                                to={`${category.id}`}
                                className={listPage.detailsButton}
                              >
                                <FiList className="mr-2" /> Details
                              </Link>
                            </li>
                            <li className="w-full">
                              <Link
                                to={`edit/${category.id}`}
                                className={listPage.editButton}
                              >
                                <FiEdit className="mr-2" /> Edit
                              </Link>
                            </li>
                            <li className="w-full">
                              <button
                                className={listPage.deleteButton}
                                onClick={() => {
                                  setToDelete([...toDelete, category]);
                                  setOpenConfirm(true);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {currentCategories.length == 0 && (
            <pre className={listPage.spinnerPreview}>
              <span className={listPage.spinnerSpan}></span>
            </pre>
          )}
        </div>

        <div className={listPage.paginationContainer}>
          <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
        {openConfirm && toDelete && (
          <CategoryDelete
            todelete={toDelete}
            setOpenConfirm={setOpenConfirm}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Category;
