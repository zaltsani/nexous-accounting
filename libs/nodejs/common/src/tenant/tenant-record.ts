import { NatsRecordBuilder } from "@nestjs/microservices";
import { headers as natsHeaders } from "nats";
import {
  TENANT_ID_HEADER,
  TenantContext,
  TenantContextStore,
  USER_ID_HEADER,
} from "./tenant-context.js";
import { assertTenantId } from "./tenant-db-name.js";

/**
 * Wrap a NATS payload so the tenant travels with it.
 *
 *   client.send(PATTERN, tenantRecord(payload))                       // inside a tenant request: forwards the current tenant
 *   client.send(PATTERN, tenantRecord(payload, { tenantId, userId })) // gateway: tenant comes from the JWT
 */
export function tenantRecord<T>(
  data: T,
  context: TenantContextStore | undefined = TenantContext.get(),
) {
  if (!context)
    throw new Error("tenantRecord() needs a tenant: call it inside a tenant request or pass one");
  assertTenantId(context.tenantId);

  const hdrs = natsHeaders();
  hdrs.set(TENANT_ID_HEADER, context.tenantId);
  if (context.userId) hdrs.set(USER_ID_HEADER, context.userId);

  return new NatsRecordBuilder<T>(data).setHeaders(hdrs).build();
}
