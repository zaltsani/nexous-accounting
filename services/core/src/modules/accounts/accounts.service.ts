import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateAccountDto,
  GetAccountListQueryDto,
  GetAccountSummaryQueryDto,
  UpdateAccountDto,
} from "@nexous-accounting/common";
import { NormalBalance, Prisma } from "@nexous-accounting/database-core";
import { IApiListQueryParams, NON_DELETABLE_ACCOUNT_CODES } from "@nexous-accounting/types";
import { PrismaService } from "src/database/prisma.service";
import { Decimal } from "../../../../../packages/database/core/dist/generated/prisma/internal/prismaNamespace";

@Injectable()
export class AccountsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CreateAccountDto) {
    if (data.parentId) {
      const parentHasEntries = await this.db.entry.findFirst({
        where: { accountId: data.parentId },
      });

      if (parentHasEntries) {
        throw new BadRequestException(
          `Tidak dapat menambahkan sub-akun. Akun induk sudah memiliki entri transaksi langsung.`,
        );
      }
    }

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

    if (query.accountCategory === "parent") where.children = { some: {} };
    if (query.accountCategory === "child") where.children = { none: {} };

    if (query.parentCode) {
      const descendantIds = await this.getDescendantIds(query.parentCode);
      where.id = { in: descendantIds };
    }

    const [items, totalCount] = await this.db.$transaction(async (tx) => {
      const items = await tx.account.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { mappings: true },
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
      include: {
        _count: {
          select: {
            children: true,
            entries: true,
            mappings: true,
          },
        },
      },
    });

    // Guard 1: Protect Root & System Engine Accounts by Code
    if (NON_DELETABLE_ACCOUNT_CODES.has(account.code)) {
      throw new BadRequestException(
        `Akun sistem '${account.name}' (${account.code}) adalah struktur dasar sistem dan tidak dapat dihapus.`,
      );
    }

    // Protect Parent Accounts with Sub-Accounts
    if (account._count.children > 0) {
      throw new BadRequestException(
        `Akun '${account.name}' (${account.code}) tidak dapat dihapus karena memiliki sub-akun. Hapus atau pindahkan sub-akun terlebih dahulu.`,
      );
    }

    // Protect Mapped Operations
    if (account._count.mappings > 0) {
      throw new BadRequestException(
        `Akun '${account.name}' (${account.code}) terhubung dengan pemetaan operasi sistem (AccountMapping). Ubah pemetaan akun di pengaturan sebelum menghapus.`,
      );
    }

    // Protect Accounts with Entries or Balance
    if (account._count.entries > 0 || Number(account.balance) !== 0) {
      throw new BadRequestException(
        `Akun '${account.name}' (${account.code}) tidak dapat dihapus karena memiliki riwayat entri transaksi atau saldo sebesar ${account.balance}.`,
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

    const targetAccountIds = await this.getAllSubAccountIds(id);
    where.accountId = { in: targetAccountIds };

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

  private async getAllSubAccountIds(rootAccountId: string): Promise<string[]> {
    const allAccounts = await this.db.account.findMany({
      select: { id: true, parentId: true },
    });

    const resultIds = new Set<string>([rootAccountId]);
    let addedNew = true;

    while (addedNew) {
      addedNew = false;
      for (const acc of allAccounts) {
        if (acc.parentId && resultIds.has(acc.parentId) && !resultIds.has(acc.id)) {
          resultIds.add(acc.id);
          addedNew = true;
        }
      }
    }

    return Array.from(resultIds);
  }

  /**
   * Private helper to fetch all descendant IDs recursively using PostgreSQL CTE
   */
  private async getDescendantIds(parentCode: string): Promise<string[]> {
    const descendants = await this.db.$queryRaw<{ id: string }[]>`
      WITH RECURSIVE account_tree AS (
        SELECT id, code, parent_id
        FROM core.accounts
        WHERE code = ${parentCode}

        UNION ALL

        SELECT a.id, a.code, a.parent_id
        FROM core.accounts a
        INNER JOIN account_tree at ON a."parent_id" = at.id
      )
      SELECT id FROM account_tree 
      WHERE code != ${parentCode};
    `;

    return descendants.map((row) => row.id);
  }
}
