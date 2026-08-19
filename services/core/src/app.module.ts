import { Module } from "@nestjs/common";
import { DatabaseModule, NatsClientModule } from "@nexous-accounting/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { JournalsModule } from "./modules/journals/journals.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";

@Module({
  imports: [NatsClientModule, DatabaseModule, AccountsModule, JournalsModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
