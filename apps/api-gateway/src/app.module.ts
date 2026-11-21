import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import {
  DebugZodSerializerInterceptor,
  HttpExceptionFilter,
  NatsClientModule,
  ZodValidationExceptionFilter,
} from "@nexous-accounting/common";
import { ZodValidationPipe } from "nestjs-zod";
import { JwtModule } from "@nestjs/jwt";

import { JwtAuthGuard } from "./platforms/auth/jwt-auth.guard";
import { TenantRequiredGuard } from "./platforms/auth/tenant-required.guard";
import { AuthTenantContextInterceptor } from "./platforms/auth/auth-tenant-context.interceptor";

import { AuthGatewayController } from "./platforms/auth/auth-gateway.controller";
import { TenantsGatewayController } from "./platforms/tenants-gateway.controller";

import { AccountsGatewayController } from "./core/accounts-gateway.controller";
import { JournalsGatewayController } from "./core/journals-gateway.controller";
import { TransactionsGatewayController } from "./finops/transactions-gateway.controller";
import { ReportsGatewayController } from "./core/reports-gateway.controller";

import { SalesGatewayController } from "./finops/sales-gateway.controller";

@Module({
  imports: [
    NatsClientModule,
    JwtModule.register({})
  ],
  controllers: [
    // Platforms
    AuthGatewayController,
    TenantsGatewayController,

    // Core
    AccountsGatewayController,
    JournalsGatewayController,
    TransactionsGatewayController,
    ReportsGatewayController,

    // Financial Operations
    SalesGatewayController,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DebugZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ZodValidationExceptionFilter,
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: TenantRequiredGuard },
    { provide: APP_INTERCEPTOR, useClass: AuthTenantContextInterceptor },
  ],
})
export class AppModule {}
