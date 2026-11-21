import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { PLATFORM_PATTERNS } from '@nexous-accounting/types';
import type { ILogin, IRefresh, ISelectTenant } from '@nexous-accounting/types';
import { CurrentUserId } from '@nexous-accounting/common';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @MessagePattern(PLATFORM_PATTERNS.auth.login)
  login(@Payload() payload: ILogin) {
    return this.auth.login(payload);
  }

  @MessagePattern(PLATFORM_PATTERNS.auth.selectTenant)
  selectTenant(@Payload() payload: ISelectTenant, @CurrentUserId() userId: string) {
    return this.auth.selectTenant(payload, userId);
  }

  @MessagePattern(PLATFORM_PATTERNS.auth.refresh)
  refresh(@Payload() payload: IRefresh) {
    return this.auth.refresh(payload);
  }
}
