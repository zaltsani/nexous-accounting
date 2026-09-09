import { BadRequestException, Injectable } from "@nestjs/common";
import {
  CreateTransactionDto,
  GetTransactionListQueryDto,
  UpdateTransactionDto,
} from "@nexous-accounting/common";
import { IEntriesWithoutTransactionId } from "@nexous-accounting/types";
import { PrismaService } from "src/database/prisma.service";
import { Decimal } from "../../../../../packages/database/core/dist/generated/prisma/internal/prismaNamespace";
import { TRANSACTION_INCLUDE } from "./transactions.mapper";
import { Prisma } from "@nexous-accounting/database-core";

@Injectable()
export class TransactionsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CreateTransactionDto) {
    const { entries, ...transaction } = data;

    return this.db.$transaction(async (tx) => {
      // Validate total = 0 AND only leaf accounts are used
      await this.validateEntries(tx, entries);

      // Apply new entry balances
      await this.adjustAccountBalances(tx, entries, "APPLY");

      return tx.transaction.create({
        data: {
          ...transaction,
          entries: { create: entries },
        },
        include: TRANSACTION_INCLUDE,
      });
    });
  }

  async listTransaction(query: GetTransactionListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;

    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.TransactionOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder }
      : { updatedAt: "desc" };

    const where: Prisma.TransactionWhereInput = {};

    if (query.search) {
      where.OR = [
        { journalCode: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    where.journalCode = query.journalCode;

    const [items, totalCount] = await this.db.$transaction(async (tx) => {
      const items = await tx.transaction.findMany({
        where,
        orderBy,
        skip,
        take,
        include: TRANSACTION_INCLUDE,
      });
      const totalCount = await tx.transaction.count({ where });
      return [items, totalCount];
    });

    return {
      items,
      totalCount,
      page,
      limit,
    };
  }

  async getTransaction(id: string) {
    return this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: TRANSACTION_INCLUDE,
    });
  }

  async updateTransaction(id: string, data: UpdateTransactionDto) {
    const { entries, ...transaction } = data;

    const existingTransaction = await this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: { entries: true },
    });

    return this.db.$transaction(async (tx) => {
      if (entries && entries.length > 0) {
        await this.validateEntries(tx, entries);

        // Revert old balances
        await this.adjustAccountBalances(tx, existingTransaction.entries, "REVERT");

        // Delete old entries
        await tx.entry.deleteMany({
          where: { transactionId: id },
        });

        // Apply new balances
        await this.adjustAccountBalances(tx, entries, "APPLY");
      }

      return tx.transaction.update({
        where: { id },
        data: {
          ...transaction,
          entries: { create: entries },
        },
        include: TRANSACTION_INCLUDE,
      });
    });
  }

  async deleteTransaction(id: string) {
    const existingTransaction = await this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: { entries: true },
    });

    return this.db.$transaction(async (tx) => {
      // Revert existing entry balances
      await this.adjustAccountBalances(tx, existingTransaction.entries, "REVERT");

      return tx.transaction.delete({
        where: { id },
        include: TRANSACTION_INCLUDE,
      });
    });
  }

  private async validateEntries(
    tx: Prisma.TransactionClient,
    entries: IEntriesWithoutTransactionId,
  ) {
    // Check 1: Balanced entry sum
    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
    if (Math.abs(total) > 0) {
      throw new BadRequestException(
        `Transaction is unbalanced. Sum of entries must be 0, received sum: ${total}`,
      );
    }

    // Check 2: Reject non-leaf accounts (accounts with sub-accounts)
    const accountIds = Array.from(new Set(entries.map((e) => e.accountId)));
    const parentAccounts = await tx.account.findMany({
      where: {
        id: { in: accountIds },
        children: { some: {} },
      },
      select: { code: true, name: true },
    });

    if (parentAccounts.length > 0) {
      const invalidList = parentAccounts.map((a) => `'${a.name}' (${a.code})`).join(", ");
      throw new BadRequestException(
        `Transaksi tidak dapat dicatat pada akun induk: ${invalidList}. Pilih akun sub/leaf account paling bawah.`,
      );
    }
  }

  private async adjustAccountBalances(
    tx: Parameters<Parameters<typeof this.db.$transaction>[0]>[0],
    entries: Array<{ accountId: string; amount: number | Decimal }>,
    mode: "APPLY" | "REVERT" = "APPLY",
  ) {
    if (!entries || entries.length === 0) return;

    const leafIds = Array.from(new Set(entries.map((e) => e.accountId)));

    // Fetch target leaf accounts and recursively fetch their parent chains
    const accountMap = new Map<
      string,
      { id: string; parentId: string | null; normalBalance: string }
    >();
    let idsToFetch = leafIds;

    while (idsToFetch.length > 0) {
      const fetchedAccounts = await tx.account.findMany({
        where: { id: { in: idsToFetch } },
        select: { id: true, parentId: true, normalBalance: true },
      });

      const nextParentIds: string[] = [];
      for (const acc of fetchedAccounts) {
        accountMap.set(acc.id, acc);
        if (acc.parentId && !accountMap.has(acc.parentId)) {
          nextParentIds.push(acc.parentId);
        }
      }

      // Prepare next iteration with unfetched parent IDs
      idsToFetch = Array.from(new Set(nextParentIds));
    }

    const multiplier = mode === "REVERT" ? -1 : 1;

    for (const entry of entries) {
      const targetAccount = accountMap.get(entry.accountId);
      if (!targetAccount) continue;

      const numericAmount =
        typeof entry.amount === "number" ? entry.amount : entry.amount.toNumber();

      // DEBIT account: +amount increases balance
      // CREDIT account: -amount increases balance
      const applyAdjustment =
        targetAccount.normalBalance === "CREDIT" ? -numericAmount : numericAmount;
      const finalDelta = applyAdjustment * multiplier;

      // Resolve ancestor hierarchy IDs (target account + all parent ancestors)
      const targetAndAncestorIds = this.getAccountAndAncestorIds(entry.accountId, accountMap);

      // 2. Increment/Decrement balance on leaf account AND parent hierarchy
      await tx.account.updateMany({
        where: { id: { in: targetAndAncestorIds } },
        data: {
          balance: { increment: finalDelta },
        },
      });
    }
  }

  private getAccountAndAncestorIds(
    accountId: string,
    accountMap: Map<string, { id: string; parentId: string | null }>,
  ): string[] {
    const ids: string[] = [];
    let currentId: string | null = accountId;

    while (currentId) {
      ids.push(currentId);
      const acc = accountMap.get(currentId);
      currentId = acc?.parentId ?? null;
    }

    return ids;
  }
}
