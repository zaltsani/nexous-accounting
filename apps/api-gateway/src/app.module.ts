import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import {
  DebugZodSerializerInterceptor,
  HttpExceptionFilter,
  NatsClientModule,
  ZodValidationExceptionFilter,
} from "@nexous-accounting/common";
import { ZodValidationPipe } from "nestjs-zod";

import { AccountsGatewayController } from "./accounts-gateway.controller";
import { JournalsGatewayController } from "./journals-gateway.controller";
import { TransactionsGatewayController } from "./transactions-gateway.controller";
import { ReportsGatewayController } from "./reports-gateway.controller";
import { SalesGatewayController } from "./sales-gateway.controller";

@Module({
  imports: [NatsClientModule],
  controllers: [
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
  ],
})
export class AppModule {}
