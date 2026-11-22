import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import type { ILogin, IRefresh } from "@nexous-accounting/types";
import { PLATFORM_PATTERNS } from "@nexous-accounting/types";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @MessagePattern(PLATFORM_PATTERNS.auth.login)
  login(@Payload() payload: ILogin) {
    return this.auth.login(payload);
  }

  @MessagePattern(PLATFORM_PATTERNS.auth.selectTenant)
  selectTenant(@Payload("tenantId") tenantId: string, @Payload("userId") userId: string) {
    return this.auth.selectTenant(tenantId, userId);
  }

  @MessagePattern(PLATFORM_PATTERNS.auth.refresh)
  refresh(@Payload() payload: IRefresh) {
    return this.auth.refresh(payload);
  }
}
