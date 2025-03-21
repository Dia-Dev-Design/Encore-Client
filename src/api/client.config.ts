import axios, { type AxiosResponse } from "axios";
import { getLocalItem } from "helper/localStorage.helper";
import { Connection } from "interfaces/login/connection.interface";
import isNil from "lodash.isnil";

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const unwrapAxiosResponse = <T>(response: AxiosResponse<T>) => response.data;

apiClient.interceptors.response.use(undefined, async (err) => {
  const connectionStr = getLocalItem("connection");
  if (!connectionStr) {
    return Promise.reject(err);
  }
  
  const connection: Connection = JSON.parse(connectionStr);
  const token = connection.token;
  if (err.response?.status === 401) {
    // TODO: remove session
  }
  if (!isNil(token)) {
    if (err.response?.status !== 401) {
      return Promise.reject(err);
    }
  }
});

apiClient.interceptors.request.use((config) => {
  const connectionStr = getLocalItem("connection");
  if (!connectionStr) {
    return config;
  }
  
  const connection: Connection = JSON.parse(connectionStr);
  const token = connection.token;

  if (!isNil(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
