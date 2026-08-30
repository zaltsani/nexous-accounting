import { Button, DatePicker, Input } from "@nexous-accounting/ui";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import PageHeader from "~/components/common/page-header";
import { BalanceSheetTable } from "../components/balance-sheet-table";
import { useGetBalanceSheet } from "../hooks/use-get-balance-sheet";
import { format } from "date-fns";

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState<Date | undefined>(new Date());
  const { data, isLoading } = useGetBalanceSheet({
    asOfDate: asOfDate && format(asOfDate, "yyyy-MM-dd"),
  });

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <PageHeader title="Laporan Neraca" description="Laporan Posisi Keuangan (Balance Sheet)">
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          Export PDF
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Account */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari berdasarkan nama akun atau kode COA..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* As Of Date */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Per Tanggal:
          </span>
          <DatePicker date={asOfDate} setDate={setAsOfDate} placeholder="Pilih tanggal..." />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border bg-card text-xs text-muted-foreground">
          Memuat Laporan Neraca...
        </div>
      ) : data ? (
        <BalanceSheetTable data={data} searchQuery={searchQuery} />
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border bg-card text-xs text-muted-foreground">
          Data laporan tidak ditemukan.
        </div>
      )}
    </>
  );
}
