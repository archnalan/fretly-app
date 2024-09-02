import axios, { AxiosInstance} from 'axios';

const API: AxiosInstance = axios.create({
    baseURL: 'https://localhost:7077/',
    headers: { 'Content-Type': 'application/json' }
});

export default API;