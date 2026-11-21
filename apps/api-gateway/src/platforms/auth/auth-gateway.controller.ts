import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, LoginDto, RefreshDto } from '@nexous-accounting/common';
import { PLATFORM_PATTERNS } from '@nexous-accounting/types';
import { firstValueFrom, timeout } from 'rxjs';
import { AllowNoTenant, Auth, Public } from './auth.decorators';
import type { AuthContext } from './auth.types';

@Controller('auth')
export class AuthGatewayController {
  constructor(@Inject("NATS_SERVICE") private readonly natsClient: ClientProxy) {}

  private call<T>(pattern: string, data: unknown, ms = 15_000): Promise<T> {
    return firstValueFrom(this.natsClient.send<T>(pattern, data).pipe(timeout(ms)));
  }

  @Public()
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.call(PLATFORM_PATTERNS.users.create, body);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.call(PLATFORM_PATTERNS.auth.login, dto);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() body: RefreshDto) {
    return this.call(PLATFORM_PATTERNS.auth.refresh, body);
  }

  @AllowNoTenant()
  @Post('select-tenant')
  selectTenant(@Auth() auth: AuthContext, @Body() body: { tenantId?: string }) {
    return this.call(PLATFORM_PATTERNS.auth.selectTenant, { userId: auth.userId, tenantId: body?.tenantId });
  }
}
