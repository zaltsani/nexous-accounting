import { Module } from "@nestjs/common";
import { PrismaService } from "@nexous-accounting/common";
import { AccountRepository } from "@nexous-accounting/database-core";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "./accounts.service";

@Module({
  controllers: [AccountsController],
  providers: [
    AccountsService,
    {
      provide: AccountRepository,
      useFactory: (prisma: PrismaService) => new AccountRepository(prisma),
      inject: [PrismaService],
    },
  ],
})
export class AccountsModule {}
