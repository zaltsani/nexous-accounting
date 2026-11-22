import { api } from "./axios";
import { ApiError } from "./api-error";
import { useAuth } from "~/features/auth/stores/use-auth";

export function setupInterceptors() {
  api.interceptors.request.use(async (config) => {
    const auth = useAuth.getState();
    if (auth.authToken) {
      config.headers.Authorization = `Bearer ${auth.authToken.accessToken}`;
    }
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
