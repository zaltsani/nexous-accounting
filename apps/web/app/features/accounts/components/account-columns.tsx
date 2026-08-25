import type { IAccount } from "@nexous-accounting/types";
import type { ColumnDef } from "@tanstack/react-table";
import { formatIndonesiaCurrency } from "~/libs/utils/format-indonesia-currency";

export const accountColumns: ColumnDef<IAccount>[] = [
  {
    accessorKey: "code",
    header: "Kode Akun",
  },
  {
    accessorKey: "name",
    header: "Nama Akun",
  },
  {
    accessorKey: "type",
    header: "Tipe Akun",
  },
  {
    accessorKey: "normalBalance",
    header: "Saldo Normal",
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    cell: ({ row }) => formatIndonesiaCurrency(row.original.balance),
  },
];
