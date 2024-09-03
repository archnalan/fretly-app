import { CategoryModel } from "../DataModels/CategoryModel";
import API from "./API";

const apiEndpoints = {  
  fetchAllCategories: 'admin/api_categories',
  fetchSpecificCategory: (id: number) => `admin/api_categories/${id}`,
  createCategory: 'admin/api_categories/create',
  deleteCategory: (id: number) => `admin/api_categories/${id}`,
  editCategory: (id: number) => `admin/api_categories/edit/${id}`,
};

const fetchAllCategories = () => API.get(apiEndpoints.fetchAllCategories);
const fetchSpecificCategory = (id: number) => API.get(apiEndpoints.fetchSpecificCategory(id));
const createCategory = (CategoryData: CategoryModel) => API.post(apiEndpoints.createCategory, CategoryData);
const deleteCategory = (id: number) => API.delete(apiEndpoints.deleteCategory(id));
const editCategory = (id: number, CategoryData: CategoryModel) => API.put(apiEndpoints.editCategory(id), CategoryData);

export default {  
  fetchAllCategories,
  fetchSpecificCategory,
  createCategory,
  deleteCategory,
  editCategory,
};
