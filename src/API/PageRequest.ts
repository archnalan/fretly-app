import { PageCreateModel } from "../DataModels/PageModel";
import API from "./API";

const apiEndpoints = {
  fetchAllPages: "admin/api_pages",
  fetchPageById: (id: number) => `admin/api_pages/${id}`,
  createPage: "admin/api_pages/create",
  updatePage: (id: number) => `admin/api_pages/edit/${id}`,
  deletePage: (id: number) => `admin/api_pages/${id}`,
};

const fetchAllPages = () => API.get(apiEndpoints.fetchAllPages);
const fetchPageById = (id: number) => API.get(apiEndpoints.fetchPageById(id));
const createPage = (pageData:  PageCreateModel) =>
  API.post(apiEndpoints.createPage, pageData);
const updatePage = (id: number, pageData:  PageCreateModel) =>
  API.put(apiEndpoints.updatePage(id), pageData);
const deletePage = (id: number) => API.delete(apiEndpoints.deletePage(id));

export default {
  fetchAllPages,
  fetchPageById,
  createPage,
  updatePage,
  deletePage,
};
