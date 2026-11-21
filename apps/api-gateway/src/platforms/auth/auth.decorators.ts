import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AuthContext, AuthRequest } from './auth.types';

export const IS_PUBLIC = 'auth:isPublic';
export const ALLOW_NO_TENANT = 'auth:allowNoTenant';

/** No token needed (login, register, refresh). */
export const Public = () => SetMetadata(IS_PUBLIC, true);

/** Token needed, but no tenant selected yet. */
export const AllowNoTenant = () => SetMetadata(ALLOW_NO_TENANT, true);

/** The verified caller: { userId, tenantId?, role? }. */
export const Auth = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthContext => {
  const req = ctx.switchToHttp().getRequest<AuthRequest>();
  if (!req.auth) throw new Error('@Auth() used on a public route');
  return req.auth;
});
