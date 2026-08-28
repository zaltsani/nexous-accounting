import type { IAccount } from "@nexous-accounting/types";
import { Button } from "@nexous-accounting/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, PenLineIcon } from "lucide-react";
import {
  DataTableActions,
  type DataTableRowAction,
} from "~/components/data-table/data-table-actions";
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
  {
    id: "action",
    meta: { align: "center", className: "max-w-content" },
    header: "Actions",
    cell: ({ row, table }) => {
      const actions: DataTableRowAction<IAccount>[] = [
        {
          label: "Edit Akun",
          icon: <PenLineIcon />,
          onClick: (data) => table.options.meta?.updateRow?.(data),
        },
      ];

      return (
        <DataTableActions row={row.original} actions={actions}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DataTableActions>
      );
    },
  },
];
