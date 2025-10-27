import axios, { type AxiosInstance } from "axios";

const API_URL = "https://jsonplaceholder.typicode.com";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
