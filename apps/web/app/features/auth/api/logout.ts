import { apiClient } from "~/libs/api/client";

export function logout() {
  return apiClient.post({
    url: "/api/auth/logout",
  });
}
