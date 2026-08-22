import type { IAccount } from "@nexous-accounting/types";
import type { ColumnDef } from "@tanstack/react-table";

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
];
