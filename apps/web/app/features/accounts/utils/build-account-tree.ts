import type { IAccount, IAccountNode } from "@nexous-accounting/types";

export function buildAccountTree(accounts: IAccount[]): IAccountNode[] {
  const accountMap = new Map<string, IAccountNode>();
  const roots: IAccountNode[] = [];

  accounts.forEach((acc) => {
    accountMap.set(acc.id, { ...acc, children: [] });
  });

  accounts.forEach((acc) => {
    const node = accountMap.get(acc.id)!;
    if (acc.parentId && accountMap.has(acc.parentId)) {
      accountMap.get(acc.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
