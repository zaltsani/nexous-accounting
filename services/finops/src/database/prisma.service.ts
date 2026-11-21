import { Injectable } from "@nestjs/common";
import { createTenantClientProxy, TenantDatabaseManager } from "@nexous-accounting/common";
import { PrismaClient } from "@nexous-accounting/database-finops";

@Injectable()
// oxlint-disable-next-line typescript/no-unsafe-declaration-merging
export class PrismaService {
  constructor(tenantDb: TenantDatabaseManager<PrismaClient>) {
    return createTenantClientProxy(tenantDb) as unknown as PrismaService;
  }
}

export interface PrismaService extends PrismaClient {}
