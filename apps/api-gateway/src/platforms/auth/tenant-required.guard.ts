import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ALLOW_NO_TENANT, IS_PUBLIC } from "./auth.decorators";
import { AuthRequest } from "./auth.types";

/** Every route needs a tenant in the token, unless it is @Public() or @AllowNoTenant(). */
@Injectable()
export class TenantRequiredGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== "http") return true;

    const skip = [IS_PUBLIC, ALLOW_NO_TENANT].some((key) =>
      this.reflector.getAllAndOverride<boolean>(key, [context.getHandler(), context.getClass()]),
    );
    if (skip) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    if (!request.auth?.tenantId) throw new ForbiddenException("Select a tenant first");
    return true;
  }
}
