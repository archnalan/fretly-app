import { SongBookModel } from "../DataModels/SongBookModel";
import API from "./API";

const bookApiEndpoints = {
  fetchAllSongBooks: "admin/api_hymnbooks",
  fetchAllCategories: "admin/api_categories",
  fetchSpecificSongBook: (id: number) => `admin/api_hymnbooks/${id}`,
  fetchSpecificSongBookWithCategories: (id: number) =>
    `admin/api_hymnbooks/book_categories/${id}`,
  createSongBook: "admin/api_hymnbooks/create",
  deleteSongBook: (id: number) => `admin/api_hymnbooks/${id}`,
  editSongBook: (id: number) => `admin/api_hymnbooks/edit/${id}`,
};

const fetchAllSongBooks = () => API.get(bookApiEndpoints.fetchAllSongBooks);
const fetchAllCategories = () => API.get(bookApiEndpoints.fetchAllCategories);
const fetchSpecificSongBook = (id: number) =>
  API.get(bookApiEndpoints.fetchSpecificSongBook(id));
const fetchSpecificSongBookWithCategories = (id: number) =>
  API.get(bookApiEndpoints.fetchSpecificSongBookWithCategories(id));
const createSongBook = (SongBookData: SongBookModel) =>
  API.post(bookApiEndpoints.createSongBook, SongBookData);
const deleteSongBook = (id: number) =>
  API.delete(bookApiEndpoints.deleteSongBook(id));
const editSongBook = (id: number, SongBookData: SongBookModel) =>
  API.put(bookApiEndpoints.editSongBook(id), SongBookData);

const BookRequest = {
  fetchAllSongBooks,
  fetchAllCategories,
  fetchSpecificSongBook,
  fetchSpecificSongBookWithCategories,
  createSongBook,
  deleteSongBook,
  editSongBook,
};

export default BookRequest;
