import { Module } from "@nestjs/common";
import { NatsClientModule } from "@nexous-accounting/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { SalesModule } from "./modules/sales/sales.module";

@Module({
  imports: [NatsClientModule, DatabaseModule, SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
