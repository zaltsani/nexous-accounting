import { createApiResponseSchema, tenantMembershipSchema } from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";

export function getListTenants() {
  return apiClient.get({
    url: "/api/tenants",
    schema: createApiResponseSchema(tenantMembershipSchema.array()),
  });
}
