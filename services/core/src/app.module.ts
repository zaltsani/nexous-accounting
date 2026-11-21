import { Module } from "@nestjs/common";
import { NatsClientModule, TenantDatabaseModule } from "@nexous-accounting/common";
import { DatabaseModule } from "./database/database.module";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { JournalsModule } from "./modules/journals/journals.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { createCoreClient, PrismaClient } from "@nexous-accounting/database-core";

@Module({
  imports: [
    NatsClientModule,
    TenantDatabaseModule.forRoot<PrismaClient>({
      baseUrl: process.env.TENANT_DATABASE_BASE_URL!,
      schema: 'core',
      createClient: createCoreClient,
    }),
    DatabaseModule,
    AccountsModule,
    JournalsModule,
    TransactionsModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
