import { Module } from "@nestjs/common";
import { NatsClientModule, TenantDatabaseModule } from "@nexous-accounting/common";
import { createFinopsClient, PrismaClient } from "@nexous-accounting/database-finops";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { SalesModule } from "./modules/sales/sales.module";

@Module({
  imports: [
    NatsClientModule,
    TenantDatabaseModule.forRoot<PrismaClient>({
      baseUrl: process.env.TENANT_DATABASE_BASE_URL!,
      schema: "finops",
      createClient: createFinopsClient,
    }),
    DatabaseModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
