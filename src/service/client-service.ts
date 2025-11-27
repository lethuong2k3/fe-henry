import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";


const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_URL_BE as string,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const axiosClient: AxiosInstance = axios.create(config);

export default axiosClient;
