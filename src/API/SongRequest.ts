import { SongCreateModel, SongModel } from "../DataModels/SongModel";
import API from "./API";

const apiEndpoints = {
  fetchSongs: 'admin/api_hymns',
  fetchAllSongs: 'admin/api_hymns/categories',  
  fetchSpecificSong: (id: number) => `admin/api_hymns/category/${id}`,
  createSong: 'admin/api_hymns/create',
  deleteSong: (id: number) => `admin/api_hymns/${id}`,
  editSong: (id: number) => `admin/api_hymns/edit/${id}`,
};

const fetchSongs = () => API.get(apiEndpoints.fetchSongs);
const fetchAllSongs = () => API.get(apiEndpoints.fetchAllSongs);
const fetchSpecificSong = (id: number) => API.get(apiEndpoints.fetchSpecificSong(id));
const createSong = (SongData: SongCreateModel) => API.post(apiEndpoints.createSong, SongData);
const deleteSong = (id: number) => API.delete(apiEndpoints.deleteSong(id));
const editSong = (id: number, SongData: SongModel) => API.put(apiEndpoints.editSong(id), SongData);

const SongRequest = {
  fetchSongs,
  fetchAllSongs,  
  fetchSpecificSong,
  createSong,
  deleteSong,
  editSong,
};

export default SongRequest