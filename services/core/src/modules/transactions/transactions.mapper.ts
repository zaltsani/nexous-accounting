import { Prisma } from "@nexous-accounting/database-core";

export const TRANSACTION_INCLUDE = {
  journal: true,
  entries: {
    include: {
      account: true,
    },
  },
} satisfies Prisma.TransactionInclude;
