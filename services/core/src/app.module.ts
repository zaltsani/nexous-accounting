import { Module } from "@nestjs/common";
import { NatsClientModule } from "@nexous-accounting/common";
import { DatabaseModule } from "./database/database.module";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { JournalsModule } from "./modules/journals/journals.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";

@Module({
  imports: [NatsClientModule, DatabaseModule, AccountsModule, JournalsModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
