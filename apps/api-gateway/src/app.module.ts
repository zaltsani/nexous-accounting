import { Module } from "@nestjs/common";
import { NatsClientModule } from "@nexous-accounting/common";
import { AccountsGatewayController } from "./accounts-gateway.controller";
import { JournalsGatewayController } from "./journals-gateway.controller";
import { TransactionsGatewayController } from "./transactions-gateway.controller";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

@Module({
  imports: [NatsClientModule],
  controllers: [
    JournalsGatewayController,
    AccountsGatewayController,
    TransactionsGatewayController,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
