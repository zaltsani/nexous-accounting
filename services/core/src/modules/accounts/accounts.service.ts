import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateAccountDto,
  GetAccountListQueryDto,
  GetAccountSummaryQueryDto,
  UpdateAccountDto,
} from "@nexous-accounting/common";
import { NormalBalance, Prisma } from "@nexous-accounting/database-core";
import {
  IApiListQueryParams,
  SYSTEM_ROOT_ACCOUNTS,
  SYSTEM_SUB_HEADER_ACCOUNTS,
} from "@nexous-accounting/types";
import { PrismaService } from "src/database/prisma.service";
import { Decimal } from "../../../../../packages/database/core/dist/generated/prisma/internal/prismaNamespace";

@Injectable()
export class AccountsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CreateAccountDto) {
    return this.db.account.create({
      data,
    });
  }

  async listAccount(query: GetAccountListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;

    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.AccountOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder }
      : { code: "asc" };

    const where: Prisma.AccountWhereInput = {};

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: "insensitive" } },
        { name: { contains: query.search, mode: "insensitive" } },
      ];
    }

    where.type = query.type;

    const [items, totalCount] = await this.db.$transaction(async (tx) => {
      const items = await tx.account.findMany({
        where,
        orderBy,
        skip,
        take,
      });
      const totalCount = await tx.account.count();
      return [items, totalCount];
    });

    return {
      items,
      totalCount,
      page,
      limit,
    };
  }

  async getAccountById(id: string) {
    return this.db.account.findUniqueOrThrow({
      where: { id },
    });
  }

  async getAccountByCode(code: string) {
    return this.db.account.findUniqueOrThrow({
      where: { code },
    });
  }

  async updateAccount(id: string, data: UpdateAccountDto) {
    return this.db.account.update({
      where: { id },
      data,
    });
  }

  async deleteAccount(id: string) {
    const account = await this.db.account.findUniqueOrThrow({
      where: { id },
    });

    const systemAccountCodes = [
      ...SYSTEM_ROOT_ACCOUNTS.map((a) => a.code),
      ...SYSTEM_SUB_HEADER_ACCOUNTS.map((a) => a.code),
    ];

    if (systemAccountCodes.includes(account.code as any)) {
      throw new BadRequestException(
        `Akun sistem dengan kode '${account.code}' tidak dapat dihapus.`,
      );
    }

    if (Number(account.balance) !== 0) {
      throw new BadRequestException(
        `Akun '${account.name}' (${account.code}) tidak dapat dihapus karena masih memiliki saldo sebesar ${account.balance}.`,
      );
    }

    return this.db.account.delete({
      where: { id },
    });
  }

  async getAccountEntries(id: string, query: IApiListQueryParams) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;

    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.EntryOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder }
      : { updatedAt: "desc" };

    const where: Prisma.EntryWhereInput = {};

    if (query.search) {
      where.OR = [
        { transaction: { description: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    where.accountId = id;

    const [items, totalCount] = await this.db.$transaction(async (tx) => {
      const items = await tx.entry.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          transaction: true,
        },
      });
      const totalCount = await tx.account.count();
      return [items, totalCount];
    });

    return {
      items,
      totalCount,
      page,
      limit,
    };
  }

  async getAccountSummaryAndTrend(accountId: string, query: GetAccountSummaryQueryDto) {
    // 1. Validasi keberadaan akun
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException("Akun tidak ditemukan");
    }

    // 2. Setup Filter Rentang Tanggal
    const startDate = query.startDate
      ? new Date(query.startDate)
      : new Date(new Date().getFullYear(), 0, 1); // Default: Awal tahun
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);

    // -------------------------------------------------------------
    // A. AGREGASI TOTAL DEBIT & KREDIT PERIODE INI
    // -------------------------------------------------------------
    const debitAggregate = await this.db.entry.aggregate({
      _sum: { amount: true },
      where: {
        accountId,
        amount: { gt: 0 }, // Positive values = Debit
        transaction: {
          date: { gte: startDate, lte: endDate },
        },
      },
    });

    const creditAggregate = await this.db.entry.aggregate({
      _sum: { amount: true },
      where: {
        accountId,
        amount: { lt: 0 }, // Negative values = Credit
        transaction: {
          date: { gte: startDate, lte: endDate },
        },
      },
    });

    const totalDebit = debitAggregate._sum.amount ?? new Decimal(0);
    const totalCreditRaw = creditAggregate._sum.amount ?? new Decimal(0);
    const totalCredit = totalCreditRaw.abs(); // Positifkan nilai kredit untuk tampilan UI

    // Hitung Net Mutation sesuai Posisi Normal Saldo
    let netMutation = totalDebit.sub(totalCredit);
    if (account.normalBalance === NormalBalance.CREDIT) {
      netMutation = totalCredit.sub(totalDebit);
    }

    // -------------------------------------------------------------
    // B. DATA TREND TRANSAKSI (AGREGASI BULANAN SEPANJANG PERIODE)
    // -------------------------------------------------------------
    // Menggunakan Prisma Raw Query agar pembentukan tanggal/bulan cepat dan akurat di level DB
    const trendRaw = await this.db.$queryRaw<
      Array<{
        period: string; // "YYYY-MM"
        debit: string | number;
        credit: string | number;
      }>
    >`
      SELECT 
        TO_CHAR(t."date", 'YYYY-MM') AS period,
        SUM(CASE WHEN e."amount" > 0 THEN e."amount" ELSE 0 END) AS debit,
        ABS(SUM(CASE WHEN e."amount" < 0 THEN e."amount" ELSE 0 END)) AS credit
      FROM "core"."entries" e
      JOIN "core"."transactions" t ON e."transaction_id" = t."id"
      WHERE e."account_id" = ${accountId}
        AND t."date" >= ${startDate}
        AND t."date" <= ${endDate}
      GROUP BY TO_CHAR(t."date", 'YYYY-MM')
      ORDER BY period ASC
    `;

    const trend = trendRaw.map((row) => ({
      period: row.period,
      debit: Number(row.debit),
      credit: Number(row.credit),
      net:
        account.normalBalance === NormalBalance.CREDIT
          ? Number(row.credit) - Number(row.debit)
          : Number(row.debit) - Number(row.credit),
    }));

    console.log({ trendRaw, trend });

    return {
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary: {
        totalDebit: totalDebit.toNumber(),
        totalCredit: totalCredit.toNumber(),
        netMutation: netMutation.toNumber(),
      },
      trend,
    };
  }
}
