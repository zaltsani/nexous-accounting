import axios from "axios";
import { ENV } from "~/config/env";

export const api = axios.create({
  baseURL: ENV.BASE_URL,
});

export const authApi = axios.create({
  baseURL: ENV.BASE_URL,
  withCredentials: true,
});
