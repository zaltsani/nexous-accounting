import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { NatsContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { TENANT_ID_HEADER, TenantContext, USER_ID_HEADER } from './tenant-context.js';
import { isTenantId } from './tenant-db-name.js';

/**
 * Reads the tenant (and user) from the NATS headers and runs the handler inside TenantContext.
 * Messages without a tenant header pass through untouched; handlers that need a tenant
 * fail in TenantDatabaseManager.current().
 */
@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'rpc') return next.handle();

    const headers = context.switchToRpc().getContext<NatsContext>().getHeaders?.();
    const tenantId = headers?.get(TENANT_ID_HEADER);
    if (!isTenantId(tenantId)) return next.handle();

    const userId = headers?.get(USER_ID_HEADER) || undefined;

    // Subscribe inside run() so async work in the handler keeps the context.
    return new Observable((subscriber) =>
      TenantContext.run({ tenantId, userId }, () => next.handle().subscribe(subscriber)),
    );
  }
}
