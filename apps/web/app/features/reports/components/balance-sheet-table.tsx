import type { IReportBalaceSheet } from "@nexous-accounting/types";
import {
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexous-accounting/ui";
import { ChevronsDown, ChevronsUp, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AccountTreeRow } from "./account-tree-row";

export interface BalanceSheetTableProps {
  data: IReportBalaceSheet;
  searchQuery?: string;
}

export function BalanceSheetTable({ data, searchQuery = "" }: BalanceSheetTableProps) {
  const [isAllExpanded, setIsAllExpanded] = useState(true);
  const [hideZeroBalances, setHideZeroBalances] = useState(false);

  const formatAmount = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);

  const formattedAsOfDate = new Date(data.asOfDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const netIncome = data.summary.netIncome ?? 0;
  const totalLiabilitiesAndEquity = data.summary.totalLiabilities + data.summary.totalEquities;

  return (
    <div className="w-full space-y-3">
      {/* Sub-Bar Feature */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Switch id="hide-zero" checked={hideZeroBalances} onCheckedChange={setHideZeroBalances} />
          <label
            htmlFor="hide-zero"
            className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {hideZeroBalances ? (
              <EyeOff className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            Sembunyikan Akun Saldo Rp 0
          </label>
        </div>

        <div className="flex items-center gap-1.5 border-t pt-2 sm:border-t-0 sm:pt-0">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
            Tampilan Hirarki:
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2.5 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground"
            onClick={() => setIsAllExpanded(true)}
          >
            <ChevronsDown className="h-3.5 w-3.5 text-primary" />
            Buka Semua
          </Button>
          <span className="text-muted-foreground/30">|</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2.5 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground"
            onClick={() => setIsAllExpanded(false)}
          >
            <ChevronsUp className="h-3.5 w-3.5 text-muted-foreground" />
            Tutup Semua
          </Button>
        </div>
      </div>

      {/* Container Tabel */}
      <div className="w-full rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-border bg-muted/40 hover:bg-transparent">
              <TableHead className="py-3 text-xs font-bold uppercase tracking-wider text-foreground">
                NAMA AKUN
              </TableHead>
              <TableHead className="py-3 text-right text-xs font-bold uppercase tracking-wider text-foreground">
                <div>SALDO (IDR)</div>
                <div className="text-[11px] font-normal text-muted-foreground">
                  Per {formattedAsOfDate}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* ================= ASET ================= */}
            <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
              <TableCell
                colSpan={2}
                className="py-2 text-xs font-bold uppercase tracking-wide text-foreground"
              >
                ASET (ASSETS)
              </TableCell>
            </TableRow>
            {data.assets.map((node) => (
              <AccountTreeRow
                key={node.id}
                node={node}
                depth={1}
                formatAmount={formatAmount}
                isAllExpanded={isAllExpanded}
                searchQuery={searchQuery}
                hideZeroBalances={hideZeroBalances}
              />
            ))}
            <TableRow className="border-b-2 border-primary/40 bg-primary/5 font-bold hover:bg-primary/5">
              <TableCell className="py-2.5 text-sm font-bold text-foreground">TOTAL ASET</TableCell>
              <TableCell className="py-2.5 text-right font-mono text-sm font-bold text-foreground">
                {formatAmount(data.summary.totalAssets)}
              </TableCell>
            </TableRow>

            {/* ================= LIABILITAS ================= */}
            <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
              <TableCell
                colSpan={2}
                className="py-2 text-xs font-bold uppercase tracking-wide text-foreground"
              >
                LIABILITAS (LIABILITIES)
              </TableCell>
            </TableRow>
            {data.liabilities.map((node) => (
              <AccountTreeRow
                key={node.id}
                node={node}
                depth={1}
                formatAmount={formatAmount}
                isAllExpanded={isAllExpanded}
                searchQuery={searchQuery}
                hideZeroBalances={hideZeroBalances}
              />
            ))}
            <TableRow className="border-b-2 border-primary/40 bg-primary/5 font-bold hover:bg-primary/5">
              <TableCell className="py-2.5 text-sm font-bold text-foreground">
                TOTAL LIABILITAS
              </TableCell>
              <TableCell className="py-2.5 text-right font-mono text-sm font-bold text-foreground">
                {formatAmount(data.summary.totalLiabilities)}
              </TableCell>
            </TableRow>

            {/* ================= EKUITAS ================= */}
            <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
              <TableCell
                colSpan={2}
                className="py-2 text-xs font-bold uppercase tracking-wide text-foreground"
              >
                EKUITAS (EQUITY)
              </TableCell>
            </TableRow>
            {data.equity.map((node) => (
              <AccountTreeRow
                key={node.id}
                node={node}
                depth={1}
                formatAmount={formatAmount}
                isAllExpanded={isAllExpanded}
                searchQuery={searchQuery}
                hideZeroBalances={hideZeroBalances}
              />
            ))}

            <TableRow className="border-b border-border/60 hover:bg-muted/30">
              <TableCell
                className="py-2 text-sm italic text-foreground/90"
                style={{ paddingLeft: "1.75rem" }}
              >
                Laba Tahun Ini (Net Income)
              </TableCell>
              <TableCell className="py-2 text-right font-mono text-sm text-foreground">
                {formatAmount(netIncome)}
              </TableCell>
            </TableRow>

            <TableRow className="border-b-2 border-primary/40 bg-primary/5 font-bold hover:bg-primary/5">
              <TableCell className="py-2.5 text-sm font-bold text-foreground">
                TOTAL EKUITAS
              </TableCell>
              <TableCell className="py-2.5 text-right font-mono text-sm font-bold text-foreground">
                {formatAmount(data.summary.totalEquities)}
              </TableCell>
            </TableRow>

            {/* ================= TOTAL LIABILITAS & EKUITAS ================= */}
            <TableRow className="border-b-4 border-double border-foreground bg-muted/70 font-bold hover:bg-muted/70">
              <TableCell className="py-3 text-sm font-bold uppercase text-foreground">
                TOTAL LIABILITAS & EKUITAS
              </TableCell>
              <TableCell className="py-3 text-right font-mono text-sm font-bold text-foreground">
                {formatAmount(totalLiabilitiesAndEquity)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Balance Indicator Status */}
      <div
        className={`flex items-center justify-between rounded-md px-4 py-2 text-xs font-medium ${
          data.summary.isBalanced
            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"
        }`}
      >
        <span>
          Status Neraca:{" "}
          <strong>
            {data.summary.isBalanced ? "SEIMBANG (BALANCED)" : "TIDAK SEIMBANG (UNBALANCED)"}
          </strong>
        </span>
        <span>
          {data.summary.isBalanced
            ? "✓ Total Aset sama dengan Total Liabilitas + Ekuitas"
            : `Selisih: ${formatAmount(data.summary.totalAssets - totalLiabilitiesAndEquity)}`}
        </span>
      </div>
    </div>
  );
}
