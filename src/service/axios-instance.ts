import axios from "axios";
import Cookies from 'js-cookie';

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_URL_BE,
  withCredentials: true, 

});

// Gắn access token vào Header
API.interceptors.request.use((config) => {
  const token = Cookies.get('token');
if (token) {config.headers.set("Authorization", `Bearer ${token}`);}
  return config;
});

// Refresh token khi access token hết hạn
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post<RefreshResponse>(
           `${import.meta.env.VITE_URL_BE}/api/auth/refresh`,
          {
            refreshToken: Cookies.get('refreshToken')
          },
          { withCredentials: true }
        );

        Cookies.set("token", res.data.token);
        Cookies.set("token", res.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;

        return API(originalRequest);
      } catch (err) {
        console.log("Refresh token hết hạn!");
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
