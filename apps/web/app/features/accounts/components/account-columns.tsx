import { accountTypeLabels, type IAccount } from "@nexous-accounting/types";
import { Button } from "@nexous-accounting/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EllipsisVertical, EyeIcon, PenLineIcon, Trash2Icon } from "lucide-react";
import { href, useNavigate } from "react-router";
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
    cell: ({ row }) => accountTypeLabels[row.original.type],
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    cell: ({ row }) => formatIndonesiaCurrency(row.original.balance),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => format(row.original.updatedAt, "dd MMMM yyyy HH:mm"),
  },
  {
    id: "action",
    meta: { align: "center", className: "max-w-content" },
    header: "Actions",
    cell: ({ row, table }) => {
      const navigate = useNavigate();

      const actions: DataTableRowAction<IAccount>[] = [
        {
          label: "Detail Akun",
          icon: <EyeIcon />,
          onClick: () => navigate(href("/accounts/:id", { id: row.original.id })),
        },
        {
          label: "Edit Akun",
          icon: <PenLineIcon />,
          onClick: (data) => table.options.meta?.updateRow?.(data),
        },
        {
          label: "Hapus Akun",
          variant: "destructive",
          icon: <Trash2Icon />,
          onClick: (data) => table.options.meta?.deleteRow?.(data),
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
