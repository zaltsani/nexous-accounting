import { Module } from "@nestjs/common";
import { AccountingGatewayController } from "./accounting-gateway.controller";
import { NatsClientModule } from "@nexous-accounting/common";

@Module({
  imports: [NatsClientModule],
  controllers: [AccountingGatewayController],
  providers: [],
})
export class AppModule {}
