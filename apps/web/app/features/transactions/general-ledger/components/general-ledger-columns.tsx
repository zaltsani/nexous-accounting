import type { ITransaction } from "@nexous-accounting/types";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const generalLedgerColumns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => format(row.original.date, "dd MMMM yyyy"),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    id: "totalTransaction",
    header: "Total Transaksi",
    cell: ({ row }) =>
      row.original.entries.filter((d) => d.amount > 0).reduce((acc, curr) => acc + curr.amount, 0),
  },
];
