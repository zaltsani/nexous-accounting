import type { ITransaction } from "@nexous-accounting/types";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatIndonesiaCurrency } from "~/libs/utils/format-indonesia-currency";

export const transactionColumns: ColumnDef<ITransaction>[] = [
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
      formatIndonesiaCurrency(
        row.original.entries
          .filter((d) => d.amount > 0)
          .reduce((acc, curr) => acc + curr.amount, 0),
      ),
  },
];
