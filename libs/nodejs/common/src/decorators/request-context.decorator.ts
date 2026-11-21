import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { NatsContext } from '@nestjs/microservices';
import { TENANT_ID_HEADER, TenantContextMissingError, USER_ID_HEADER } from '../tenant/tenant-context.js';
import { isTenantId } from '../tenant/tenant-db-name.js';

export interface RequestContext {
  tenantId: string;
  userId?: string;
}

function readContext(ctx: ExecutionContext): RequestContext {
  const headers = ctx.switchToRpc().getContext<NatsContext>().getHeaders?.();
  const tenantId = headers?.get(TENANT_ID_HEADER);
  return { tenantId, userId: headers?.get(USER_ID_HEADER) || undefined };
}

export const ReqContext = createParamDecorator((_data: unknown, ctx: ExecutionContext): RequestContext =>
  readContext(ctx),
);

export const CurrentTenantId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const tenantId = readContext(ctx).tenantId;
  if (!isTenantId(tenantId)) throw new TenantContextMissingError();
  return tenantId;
});

export const CurrentUserId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const { userId } = readContext(ctx);
  if (!userId) throw new Error('No user in the request context');
  return userId;
});
