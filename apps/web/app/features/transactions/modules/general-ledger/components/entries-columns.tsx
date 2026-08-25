import type { IEntry } from "@nexous-accounting/types";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatIndonesiaCurrency } from "~/libs/utils/format-indonesia-currency";

export const entryColumns: ColumnDef<IEntry>[] = [
  {
    accessorKey: "transaction.date",
    header: "Tanggal",
    cell: ({ row }) =>
      row.original.transaction && format(row.original.transaction.date, "dd MMMM yyyy"),
  },
  {
    accessorKey: "transaction.description",
    header: "Deskripsi",
  },
  {
    accessorKey: "account.code",
    header: "Akun",
    cell: ({ row }) => `${row.original.account.code} - ${row.original.account.name}`,
  },
  {
    accessorKey: "debit",
    header: "Debit",
    cell: ({ row }) => row.original.amount > 0
      ? formatIndonesiaCurrency(Math.abs(row.original.amount))
      : ""
  },
  {
    accessorKey: "credit",
    header: "Kredit",
    cell: ({ row }) => row.original.amount < 0
      ? formatIndonesiaCurrency(Math.abs(row.original.amount))
      : ""
  },
];
