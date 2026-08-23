import type { ITransaction } from "@nexous-accounting/types";
import type { ColumnDef } from "@tanstack/react-table";

export const generalLedgerColumns: ColumnDef<ITransaction>[] = [
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
