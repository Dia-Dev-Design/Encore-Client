import axios, { AxiosResponse } from "axios";
const SERVER_URL = process.env.REACT_APP_API_BASE_URL

// Generic type for the response data
export const get = <T = any>(route: string): Promise<AxiosResponse<T>> => {
  const token = localStorage.getItem("authToken");

  return axios.get<T>(SERVER_URL + route, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
  });
};

export const post = <T = any, D = any>(route: string, body: D): Promise<AxiosResponse<T>> => {
  console.log("This is the post route's route", )
  const token = localStorage.getItem("authToken");

  return axios.post<T>(SERVER_URL + route, body, {
    headers: { Authorization: `Bearer ${token}`
  
  },
    
  });
};

export const put = <T = any, D = any>(route: string, body: D): Promise<AxiosResponse<T>> => {
  const token = localStorage.getItem("authToken");

  return axios.put<T>(SERVER_URL + route, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const axiosDelete = <T = any>(route: string): Promise<AxiosResponse<T>> => {
  const token = localStorage.getItem("authToken");

  return axios.delete<T>(SERVER_URL + route, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



// Example usage with explicit types
interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Type-safe API calls
const getUser = () => get<User>('/user/profile');
const login = (credentials: LoginCredentials) => post<{token: string}, LoginCredentials>('/auth/login', credentials);