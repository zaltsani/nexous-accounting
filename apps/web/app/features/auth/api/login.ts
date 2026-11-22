import { createApiResponseSchema, loginResultSchema, type ILogin } from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";

export function login(data: ILogin) {
  return apiClient.post({
    url: "/api/auth/login",
    data,
    schema: createApiResponseSchema(loginResultSchema),
  });
}
