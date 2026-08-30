import { Injectable } from "@nestjs/common";
import { GetReportBalanceSheetQueryDto } from "@nexous-accounting/common";
import { AccountType, NormalBalance } from "@nexous-accounting/database-core";
import { IAccountNode } from "@nexous-accounting/types";
import { PrismaService } from "src/database/prisma.service";
import { Decimal } from "../../../../../packages/database/core/dist/generated/prisma/internal/prismaNamespace";

@Injectable()
export class ReportsService {
  constructor(private readonly db: PrismaService) {}

  async getBalanceSheet(query: GetReportBalanceSheetQueryDto) {
    const asOfDate = query.asOfDate ? new Date(query.asOfDate) : new Date();
    asOfDate.setHours(23, 59, 59, 999);

    const accounts = await this.db.account.findMany({
      where: {
        type: {
          in: [
            AccountType.ASSET,
            AccountType.LIABILITY,
            AccountType.EQUITY,
            AccountType.REVENUE,
            AccountType.EXPENSE,
          ],
        },
      },
      orderBy: { code: "asc" },
    });

    // Agregasi entri transaksi dari awal hingga asOfDate
    const entryAggregations = await this.db.entry.groupBy({
      by: ["accountId"],
      _sum: {
        amount: true,
      },
      where: {
        transaction: {
          date: {
            lte: asOfDate,
          },
        },
      },
    });

    const entryMap = new Map<string, Decimal>();
    entryAggregations.forEach((item) => {
      entryMap.set(item.accountId, item._sum.amount || new Decimal(0));
    });

    // Hitung saldo MURNI dari net entries transaksi hingga asOfDate
    const accountNodes: IAccountNode[] = accounts.map((acc) => {
      const netEntries = entryMap.get(acc.id) || new Decimal(0);

      // Hitung posisi saldo berdasarkan Normal Balance (DEBIT vs CREDIT)
      let calculatedBalance = netEntries;
      if (acc.normalBalance === NormalBalance.CREDIT) {
        calculatedBalance = netEntries.negated();
      }

      return {
        id: acc.id,
        code: acc.code,
        name: acc.name,
        type: acc.type,
        normalBalance: acc.normalBalance,
        parentId: acc.parentId,
        balance: calculatedBalance.toNumber(),
        createdAt: acc.createdAt.toISOString(),
        updatedAt: acc.updatedAt.toISOString(),
        children: [],
      };
    });

    // Build Tree & Agregasi Saldo ke Parent Account
    const assets = this.buildTreeAndAggregate(accountNodes, AccountType.ASSET);
    const liabilities = this.buildTreeAndAggregate(accountNodes, AccountType.LIABILITY);
    const equity = this.buildTreeAndAggregate(accountNodes, AccountType.EQUITY);
    const revenues = this.buildTreeAndAggregate(accountNodes, AccountType.REVENUE);
    const expenses = this.buildTreeAndAggregate(accountNodes, AccountType.EXPENSE);

    // Hitung Ringkasan Posisi Keuangan
    const totalAssets = assets.reduce((sum, item) => sum + item.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.balance, 0);
    const totalEquityAccounts = equity.reduce((sum, item) => sum + item.balance, 0);

    const totalRevenue = revenues.reduce((sum, item) => sum + item.balance, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.balance, 0);

    const netIncome = totalRevenue - totalExpense;
    const totalEquities = totalEquityAccounts + netIncome;

    const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquities)) < 0.0001;

    return {
      asOfDate: asOfDate.toISOString(),
      summary: {
        totalAssets,
        totalLiabilities,
        totalEquities,
        totalRevenue,
        totalExpense,
        netIncome,
        isBalanced,
      },
      assets,
      liabilities,
      equity,
    };
  }

  private buildTreeAndAggregate(nodes: IAccountNode[], type: AccountType): IAccountNode[] {
    const filteredNodes = nodes.filter((n) => n.type === type);
    const nodeMap = new Map<string, IAccountNode>();

    filteredNodes.forEach((n) => {
      nodeMap.set(n.id, { ...n, children: [] });
    });

    const roots: IAccountNode[] = [];

    nodeMap.forEach((node) => {
      if (node.parentId && nodeMap.has(node.parentId)) {
        nodeMap.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    const calculateSubtreeBalance = (node: IAccountNode): number => {
      if (!node.children || node.children.length === 0) {
        return node.balance;
      }
      node.balance = node.children.reduce((sum, child) => sum + calculateSubtreeBalance(child), 0);
      return node.balance;
    };

    roots.forEach((root) => calculateSubtreeBalance(root));

    return roots;
  }
}
