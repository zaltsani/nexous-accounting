import { Body, Controller, Get, Inject, Param, Post, UsePipes } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AddTenantMemberDto, CreateTenantDto } from "@nexous-accounting/common";
import { PLATFORM_PATTERNS } from "@nexous-accounting/types";
import { ZodValidationPipe } from "nestjs-zod";
import { firstValueFrom, timeout } from "rxjs";
import { AllowNoTenant, Auth } from "src/platforms/auth/auth.decorators";
import type { AuthContext } from "src/platforms/auth/auth.types";

@ApiBearerAuth()
@Controller("tenants")
@UsePipes(ZodValidationPipe)
export class TenantsGatewayController {
  constructor(@Inject("NATS_SERVICE") private readonly natsClient: ClientProxy) {}

  private call<T>(pattern: string, data: unknown, ms = 15_000): Promise<T> {
    return firstValueFrom(this.natsClient.send<T>(pattern, data).pipe(timeout(ms)));
  }

  @AllowNoTenant()
  @Post()
  async create(@Body() dto: CreateTenantDto, @Auth() auth: AuthContext) {
    return this.natsClient.send(PLATFORM_PATTERNS.tenants.create, { ...dto, userId: auth.userId });
  }

  @AllowNoTenant()
  @Get()
  listMine(@Auth() auth: AuthContext) {
    return this.call(PLATFORM_PATTERNS.tenants.listForUser, { userId: auth.userId });
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.natsClient.send(PLATFORM_PATTERNS.tenants.get, { id });
  }

  @AllowNoTenant()
  @Post(":tenantId/select")
  selectTenant(@Auth() auth: AuthContext, @Param("tenantId") tenantId: string) {
    return this.call(PLATFORM_PATTERNS.auth.selectTenant, {
      userId: auth.userId,
      tenantId: tenantId,
    });
  }

  @AllowNoTenant()
  @Post("memberships")
  addMemberships(@Body() dto: AddTenantMemberDto) {
    return this.call(PLATFORM_PATTERNS.tenants.addMember, dto);
  }
}
