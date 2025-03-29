import axios, { type AxiosResponse } from "axios";
import isNil from "lodash.isnil";

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const unwrapAxiosResponse = <T>(response: AxiosResponse<T>) => response.data;

apiClient.interceptors.response.use(undefined, async (err) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return Promise.reject(err);
  }
  
  if (err.response?.status === 401) {
  }
  if (!isNil(token)) {
    if (err.response?.status !== 401) {
      return Promise.reject(err);
    }
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return config;
  }

  if (!isNil(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
