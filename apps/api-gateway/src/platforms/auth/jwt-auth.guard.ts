import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IAccessTokenPayload } from "@nexous-accounting/types";
import { IS_PUBLIC } from "./auth.decorators";
import { AuthRequest } from "./auth.types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== "http") return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const header = request.headers.authorization;
    const [scheme, token] = (typeof header === "string" ? header : "").split(" ");
    if (scheme !== "Bearer" || !token) throw new UnauthorizedException("Missing bearer token");

    try {
      const payload = await this.jwt.verifyAsync<IAccessTokenPayload>(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
      request.auth = { userId: payload.sub, tenantId: payload.tid, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
