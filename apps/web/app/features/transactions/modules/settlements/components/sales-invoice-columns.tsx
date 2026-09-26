import { type ISalesSettlement } from "@nexous-accounting/types";
import { Button } from "@nexous-accounting/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EllipsisVertical, EyeIcon } from "lucide-react";
import { href, useNavigate } from "react-router";
import {
  DataTableActions,
  type DataTableRowAction,
} from "~/components/data-table/data-table-actions";
import { formatIndonesiaCurrency } from "~/libs/utils/format-indonesia-currency";

export const settlementsColumns: ColumnDef<ISalesSettlement>[] = [
  {
    accessorKey: "settlementDate",
    header: "Tanggal Penerimaan",
    cell: ({ row }) =>
      row.original.settlementDate ? format(row.original.settlementDate, "dd MMMM yyyy") : "",
  },
  {
    accessorKey: "account.name",
    header: "Akun Kas / Bank",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatIndonesiaCurrency(row.original.amount),
  },
  {
    id: "action",
    meta: { align: "center", className: "max-w-content" },
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();

      const actions: DataTableRowAction<ISalesSettlement>[] = [
        {
          label: "Lihat Detail",
          icon: <EyeIcon />,
          onClick: () => navigate(href("/accounts/:id", { id: row.original.id })),
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
