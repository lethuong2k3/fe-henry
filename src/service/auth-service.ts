import Cookies from "js-cookie";
import axiosClient from "./client-service";

import type { LoginResponse, InfoResponse } from "@/interfaces/auth";
import API from "./axios-instance";


const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await axiosClient.post<LoginResponse>("/api/login", {
    email,
    password,
  });
  Cookies.set("token", res.data.token);
  Cookies.set("refreshToken", res.data.refreshToken);
  return res.data;
};

const signOut = async () => {
  const res = await API.post('/api/auth/logout');
  return res.data;
}

const infoAPI = async (): Promise<InfoResponse> => {
  const res = await API.get<InfoResponse>("/api/auth/info");
  return res.data;
}

export { loginApi, infoAPI, signOut};

