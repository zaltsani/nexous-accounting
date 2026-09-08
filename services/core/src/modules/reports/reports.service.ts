import { Injectable } from "@nestjs/common";
import { GetReportBalanceSheetQueryDto } from "@nexous-accounting/common";
import { AccountOperation, AccountType, NormalBalance } from "@nexous-accounting/database-core";
import { IAccountNode } from "@nexous-accounting/types";
import { PrismaService } from "src/database/prisma.service";
import { Decimal } from "../../../../../packages/database/core/dist/generated/prisma/internal/prismaNamespace";

@Injectable()
export class ReportsService {
  constructor(private readonly db: PrismaService) {}

  async getBalanceSheet(query: GetReportBalanceSheetQueryDto) {
    const asOfDate = query.asOfDate ? new Date(query.asOfDate) : new Date();
    asOfDate.setHours(23, 59, 59, 999);

    const [accounts, mappings] = await Promise.all([
      this.db.account.findMany({
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
      }),
      this.db.accountMapping.findMany(),
    ]);

    const mappingMap = new Map<AccountOperation, string>();
    mappings.forEach((m) => mappingMap.set(m.operation, m.accountId));

    // Aggregate ledger entries up to asOfDate
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

    // Compute raw balances per node
    const accountNodes: IAccountNode[] = accounts.map((acc) => {
      const netEntries = entryMap.get(acc.id) || new Decimal(0);

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

    // Calculate interim revenue & expense trees to derive Net Income
    const revenues = this.buildTreeAndAggregate(accountNodes, AccountType.REVENUE);
    const expenses = this.buildTreeAndAggregate(accountNodes, AccountType.EXPENSE);

    const totalRevenue = revenues.reduce((sum, item) => sum + item.balance, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.balance, 0);
    const netIncome = totalRevenue - totalExpense;

    // Map Net Income directly to CURRENT_YEAR_EARNINGS account if mapped
    const currentYearEarningsAccountId = mappingMap.get(AccountOperation.CURRENT_YEAR_EARNINGS);
    let mappedToNode = false;

    if (currentYearEarningsAccountId) {
      const cyeNode = accountNodes.find((n) => n.id === currentYearEarningsAccountId);
      if (cyeNode) {
        cyeNode.balance += netIncome;
        mappedToNode = true;
      }
    }

    // Build Balance Sheet trees
    const assets = this.buildTreeAndAggregate(accountNodes, AccountType.ASSET);
    const liabilities = this.buildTreeAndAggregate(accountNodes, AccountType.LIABILITY);
    const equity = this.buildTreeAndAggregate(accountNodes, AccountType.EQUITY);

    const totalAssets = assets.reduce((sum, item) => sum + item.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.balance, 0);
    const totalEquityAccounts = equity.reduce((sum, item) => sum + item.balance, 0);

    // If netIncome was injected into the node, totalEquityAccounts already includes it
    const totalEquities = mappedToNode ? totalEquityAccounts : totalEquityAccounts + netIncome;

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
      const parentNode = node.parentId ? nodeMap.get(node.parentId) : undefined;

      if (parentNode) {
        (parentNode.children ??= []).push(node);
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
