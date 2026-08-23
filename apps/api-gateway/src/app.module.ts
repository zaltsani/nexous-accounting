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

@Module({
  imports: [NatsClientModule],
  controllers: [
    AccountsGatewayController,
    JournalsGatewayController,
    TransactionsGatewayController,
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
