import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  GetSalesInvoiceListQueryDto,
  GetSalesSettlementListQueryDto,
} from "@nexous-accounting/common";
import { InvoiceStatus, Prisma } from "@nexous-accounting/database-finops";
import { ACCOUNT_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class SalesQueryService {
  constructor(
    private readonly db: PrismaService,
    @Inject("NATS_SERVICE") private readonly natsClient: ClientProxy,
  ) {}

  async listInvoice(query: GetSalesInvoiceListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const skip = (page - 1) * limit;

    const orderBy: Prisma.SalesInvoiceOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder }
      : { updatedAt: "desc" };

    const where: Prisma.SalesInvoiceWhereInput = {
      type: query.type,
      ...(Array.isArray(query.status)
        ? { status: { in: query.status as InvoiceStatus[] } }
        : { status: query.status }),
      ...(query.search && {
        OR: [{ invoiceNumber: { contains: query.search, mode: "insensitive" } }],
      }),
    };

    const [items, totalCount] = await Promise.all([
      this.db.salesInvoice.findMany({ where, orderBy, skip, take: limit }),
      this.db.salesInvoice.count({ where }),
    ]);

    return { items, totalCount, page, limit };
  }

  async listSettlement(query: GetSalesSettlementListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const skip = (page - 1) * limit;

    const orderBy: Prisma.SalesSettlementOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder }
      : { updatedAt: "desc" };

    const where: Prisma.SalesSettlementWhereInput = {
      // type: query.type,
      // status: query.status,
      ...(query.search &&
        {
          // OR: [{ invoiceNumber: { contains: query.search, mode: "insensitive" } }],
        }),
    };

    const [items, totalCount] = await Promise.all([
      this.db.salesSettlement.findMany({ where, orderBy, skip, take: limit }),
      this.db.salesSettlement.count({ where }),
    ]);

    if (items.length === 0) return { items: [], totalCount, page, limit };

    const accountIds = Array.from(new Set(items.map((item) => item.accountId).filter(Boolean)));

    const accountsResponse =
      accountIds.length > 0
        ? await firstValueFrom(
            this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.LIST_ACCOUNT, {
              query: { ids: accountIds, limit: accountIds.length },
            }),
          )
        : { items: [] };

    const accountMap = new Map(accountsResponse.items.map((acc: any) => [acc.id, acc]));

    const hydratedItems = items.map((settlement) => ({
      ...settlement,
      account: accountMap.get(settlement.accountId) || null,
    }));

    return { items: hydratedItems, totalCount, page, limit };
  }
}
