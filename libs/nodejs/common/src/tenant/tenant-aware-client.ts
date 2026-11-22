import { ClientNats, ClientProviderOptions, NatsRecord } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { TenantContext } from "./tenant-context.js";
import { tenantRecord } from "./tenant-record.js";

/**
 * NATS client that attaches the current tenant (x-tenant-id / x-user-id headers) to every
 * send() and emit(), taken from TenantContext. Callers just write client.send(PATTERN, payload).
 *
 * - No tenant in the context (public routes, startup): the message goes out unchanged.
 * - Payload already a NatsRecord: left untouched (you set the headers yourself).
 * - The tenant only ever travels in headers, never in the payload, so a payload field such as
 *   "tenantId" sent by a client can't be mistaken for (or override) the real tenant.
 */
export class TenantAwareClientNats extends ClientNats {
  override send<TResult = any, TInput = any>(pattern: any, data: TInput): Observable<TResult> {
    return super.send<TResult, any>(pattern, this.withTenant(data));
  }

  override emit<TResult = any, TInput = any>(pattern: any, data: TInput): Observable<TResult> {
    return super.emit<TResult, any>(pattern, this.withTenant(data));
  }

  private withTenant<T>(data: T): T | NatsRecord<T> {
    if (data instanceof NatsRecord) return data;
    const context = TenantContext.get();
    return context ? tenantRecord(data, context) : data;
  }
}

/** Drop-in for a ClientsModule.register([...]) entry of a NATS client. */
export function tenantAwareNatsClient(name: string, servers: string[]): ClientProviderOptions {
  return { name, customClass: TenantAwareClientNats, options: { servers } };
}
