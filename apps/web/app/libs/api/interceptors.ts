import { api } from "./axios";
import { ApiError } from "./api-error";

export function setupInterceptors() {
  api.interceptors.request.use(async (config) => {
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const message = error.response?.data?.message || error.message || "Unknown error";
      const statusCode = error.response?.status;
      const data = error.response?.data;

      throw new ApiError(message, statusCode, data);
    },
  );
}
