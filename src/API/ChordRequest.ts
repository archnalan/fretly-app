import {ChordCreateModel, ChordModel} from "../DataModels/ChordModel"
import API from "./API";

const apiEndpoints = {
  fetchAllChords: 'admin/api_chords',
  fetchChordById: (id: number) => `admin/api_chords/${id}`,
  fetchChordByName: (name: string) => `admin/api_chords/${name}`,
  fetchChordsWithCharts: 'admin/api_chords/chords',
  createChord: 'admin/api_chords/create',
  createWithChart: 'admin/api_chords/create_with_chart',
  createWithCharts: 'admin/api_chords/create_with_charts',
  createManyChords: 'admin/api_chords/create_many',
  createManyChordsWithCharts: 'admin/api_chords/create_many_with_charts',
  editChord: (id: number) => `admin/api_chords/edit/${id}`,
  editManyChords: 'admin/api_chords/edit_many',
  editManyChordsWithCharts: 'admin/api_chords/edit_many_with_charts',
  deleteChord: (id: number) => `admin/api_chords/${id}`,
  deleteManyChords: 'admin/api_chords/by_ids',
};

const fetchAllChords = () => API.get(apiEndpoints.fetchAllChords);
const fetchChordById = (id: number) => API.get(apiEndpoints.fetchChordById(id));
const fetchChordByName = (name: string) => API.get(apiEndpoints.fetchChordByName(name));
const fetchChordsWithCharts = () => API.get(apiEndpoints.fetchChordsWithCharts);
const createChord = (chordData: ChordCreateModel) => API.post(apiEndpoints.createChord, chordData);
const createWithChart = (chordData: ChordModel) => API.post(apiEndpoints.createWithChart, chordData);
const createWithCharts = (chordData: ChordModel) => API.post(apiEndpoints.createWithCharts, chordData);
const createManyChords = (chordsData: ChordModel[]) => API.post(apiEndpoints.createManyChords, chordsData);
const createManyChordsWithCharts = (chordsData: ChordModel[]) => API.post(apiEndpoints.createManyChordsWithCharts, chordsData);
const editChord = (id: number, chordData: ChordModel) => API.put(apiEndpoints.editChord(id), chordData);
const editManyChords = (chordsData: ChordModel[]) => API.put(apiEndpoints.editManyChords, chordsData);
const editManyChordsWithCharts = (chordsData: ChordModel[]) => API.put(apiEndpoints.editManyChordsWithCharts, chordsData);
const deleteChord = (id: number) => API.delete(apiEndpoints.deleteChord(id));
const deleteManyChords = (ids: number[]) => API.post(apiEndpoints.deleteManyChords, { ids });

export default {
  fetchAllChords,
  fetchChordById,
  fetchChordByName,
  fetchChordsWithCharts,
  createChord,
  createWithChart,
  createWithCharts,
  createManyChords,
  createManyChordsWithCharts,
  editChord,
  editManyChords,
  editManyChordsWithCharts,
  deleteChord,
  deleteManyChords,
};
