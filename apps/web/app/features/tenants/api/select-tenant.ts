import { createApiResponseSchema, selectTenantResponseSchema } from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";

export function selectTenant(tenantId: string) {
  return apiClient.post({
    url: `/api/tenants/${tenantId}/select`,
    schema: createApiResponseSchema(selectTenantResponseSchema),
  });
}
