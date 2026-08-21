import { api } from './axios';
import { ApiError } from './api-error';
import { useAuth } from '~/features/auth/stores/use-auth';
import { postRefresh } from '~/features/auth/api/refresh';
import { postLogout } from '~/features/auth/api/logout';
import { gooeyToast } from 'goey-toast';

export function setupInterceptors() {
  api.interceptors.request.use(async (config) => {
    const auth = useAuth.getState();

    if (auth.access_token && !auth.isTokenValid()) {
      try {
        const response = await postRefresh();

        auth.login(response.user, response.access_token);

        config.headers.Authorization = `Bearer ${response.access_token}`;
      } catch (error) {
        try {
          await postLogout();
        } catch (logoutError) {
          console.error("Failed to cleanly clear cookie on backend", logoutError);
        } finally {
          auth.logout();
          window.dispatchEvent(new Event('auth:logout'));
          gooeyToast.error("Sesi Anda telah berakhir. Silakan masuk kembali.")
        }
        return Promise.reject(error);
      }
    } else if (auth.access_token) {
      config.headers.Authorization = `Bearer ${auth.access_token}`;
    };

    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unknown error';

      throw new ApiError(
        message,
        error.response?.status,
        error.response?.data
      );
    },
  );
};