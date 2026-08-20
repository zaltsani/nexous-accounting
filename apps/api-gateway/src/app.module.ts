import { Module } from "@nestjs/common";
import { NatsClientModule } from "@nexous-accounting/common";
import { AccountsGatewayController } from "./accounts-gateway.controller";
import { JournalsGatewayController } from "./journals-gateway.controller";
import { TransactionsGatewayController } from "./transactions-gateway.controller";

@Module({
  imports: [NatsClientModule],
  controllers: [
    JournalsGatewayController,
    AccountsGatewayController,
    TransactionsGatewayController,
  ],
  providers: [],
})
export class AppModule {}
