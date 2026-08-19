import { Module } from "@nestjs/common";
import { DatabaseModule, NatsClientModule } from "@nexous-accounting/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SalesModule } from "./modules/sales/sales.module";

@Module({
  imports: [NatsClientModule, DatabaseModule, SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
