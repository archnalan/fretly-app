import { ChartModel } from "../DataModels/ChartModel";
import API from "./API";

export const apiEndpoints = {
  fetchAllChordCharts: 'api/charts',
  fetchSpecificChordChart: (id: number) => `api/charts/${id}`,
  fetchAllChartsWithParentChords: 'admin/api_chordcharts/charts',
  fetchSpecificChartWithParentChord: (id: number) => `admin/api_chordcharts/charts/${id}`,
  fetchSelectedChordChartsByIds: 'admin/api_chordcharts/by_ids',
  fetchSpecificChartWithParentChordByIds: (id: number) => `admin/api_chordcharts/charts/by_ids/${id}`,
  createChordChart: 'api/charts/create',
  createManyChordCharts: 'admin/api_chordcharts/create_many',
  editChordChart: (id: number) => `api/charts/edit/${id}`,
  editManyChordCharts: 'admin/api_chordcharts/edit_many',
  deleteChordChart: (id: number) => `api/charts/${id}`,
  deleteManyChordCharts: 'admin/api_chordcharts/by_ids',
};

const fetchAllChordCharts = () => API.get(apiEndpoints.fetchAllChordCharts);
const fetchSpecificChordChart = (id: number) => API.get(apiEndpoints.fetchSpecificChordChart(id));
const fetchAllChartsWithParentChords = () => API.get(apiEndpoints.fetchAllChartsWithParentChords);
const fetchSpecificChartWithParentChord = (id: number) => API.get(apiEndpoints.fetchSpecificChartWithParentChord(id));
const fetchSelectedChordChartsByIds = (ids: number[]) => API.post(apiEndpoints.fetchSelectedChordChartsByIds, { ids });
const fetchSpecificChartWithParentChordByIds = (id: number) => API.get(apiEndpoints.fetchSpecificChartWithParentChordByIds(id));
const createChordChart = (chartData: ChartModel) => API.post(apiEndpoints.createChordChart, chartData);
const createManyChordCharts = (chartsData: ChartModel[]) => API.post(apiEndpoints.createManyChordCharts, chartsData);
const editChordChart = (id: number, chartData: ChartModel) => API.put(apiEndpoints.editChordChart(id), chartData);
const editManyChordCharts = (chartsData: ChartModel[]) => API.put(apiEndpoints.editManyChordCharts, chartsData);
const deleteChordChart = (id: number) => API.delete(apiEndpoints.deleteChordChart(id));
const deleteManyChordCharts = (ids: number[]) => API.post(apiEndpoints.deleteManyChordCharts, { ids });

export default {
  fetchAllChordCharts,
  fetchSpecificChordChart,
  fetchAllChartsWithParentChords,
  fetchSpecificChartWithParentChord,
  fetchSelectedChordChartsByIds,
  fetchSpecificChartWithParentChordByIds,
  createChordChart,
  createManyChordCharts,
  editChordChart,
  editManyChordCharts,
  deleteChordChart,
  deleteManyChordCharts,
};
