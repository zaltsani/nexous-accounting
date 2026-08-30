import type { IAccountNode } from "@nexous-accounting/types";
import { TableCell, TableRow } from "@nexous-accounting/ui";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

export interface AccountTreeRowProps {
  node: IAccountNode;
  depth: number;
  formatAmount: (val: number) => string;
  isAllExpanded: boolean;
  searchQuery: string;
  hideZeroBalances: boolean;
}

export function AccountTreeRow({
  node,
  depth,
  formatAmount,
  isAllExpanded,
  searchQuery,
  hideZeroBalances,
}: AccountTreeRowProps) {
  const [isOpen, setIsOpen] = useState(isAllExpanded);

  // Sync state lokal ketika status toggle global berubah
  useEffect(() => {
    setIsOpen(isAllExpanded);
  }, [isAllExpanded]);

  // Otomatis ekspansi jika ada pencarian teks
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsOpen(true);
    }
  }, [searchQuery]);

  // Sembunyikan jika bersaldo Rp 0 dan tidak punya anak
  if (hideZeroBalances && node.balance === 0 && (!node.children || node.children.length === 0)) {
    return null;
  }

  const matchesSearch =
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (node.code && node.code.toLowerCase().includes(searchQuery.toLowerCase()));

  const hasChildren = Boolean(node.children && node.children.length > 0);

  const visibleChildren = node.children?.filter((child) => {
    if (
      hideZeroBalances &&
      child.balance === 0 &&
      (!child.children || child.children.length === 0)
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <TableRow
        className={`border-b border-border/40 hover:bg-muted/30 ${
          searchQuery && matchesSearch ? "bg-amber-500/10 dark:bg-amber-500/20" : ""
        }`}
      >
        <TableCell
          className={`py-2 text-sm ${
            hasChildren ? "font-semibold text-foreground" : "font-normal text-foreground/80"
          }`}
          style={{ paddingLeft: `${depth * 1.25}rem` }}
        >
          <div className="flex items-center gap-1.5">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-5 w-5 items-center justify-center rounded p-0.5 text-muted-foreground transition-transform hover:bg-muted hover:text-foreground"
                aria-label={isOpen ? "Collapse row" : "Expand row"}
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
            ) : (
              <span className="w-5" />
            )}

            {node.code && (
              <span className="font-mono text-xs text-muted-foreground">{node.code}</span>
            )}
            <span>{node.name}</span>
          </div>
        </TableCell>

        <TableCell className="py-2 text-right font-mono text-sm text-foreground">
          {!hasChildren && formatAmount(node.balance)}
        </TableCell>
      </TableRow>

      {hasChildren && isOpen && (
        <>
          {visibleChildren?.map((childNode) => (
            <AccountTreeRow
              key={childNode.id}
              node={childNode}
              depth={depth + 1}
              formatAmount={formatAmount}
              isAllExpanded={isAllExpanded}
              searchQuery={searchQuery}
              hideZeroBalances={hideZeroBalances}
            />
          ))}

          <TableRow className="border-b border-border bg-muted/20 font-semibold hover:bg-muted/30">
            <TableCell
              className="py-2 text-sm text-foreground"
              style={{ paddingLeft: `${depth * 1.25 + 1.75}rem` }}
            >
              Total {node.name}
            </TableCell>
            <TableCell className="py-2 text-right font-mono text-sm font-semibold text-foreground">
              {formatAmount(node.balance)}
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  );
}
