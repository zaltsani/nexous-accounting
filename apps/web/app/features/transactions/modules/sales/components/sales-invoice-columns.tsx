import { type IInvoice } from "@nexous-accounting/types";
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

export const salesInvoiceColumns: ColumnDef<IInvoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
  },
  {
    accessorKey: "type",
    header: "Tipe",
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "issueDate",
    header: "Tanggal",
    cell: ({ row }) =>
      row.original.issueDate ? format(row.original.issueDate, "dd MMMM yyyy") : "",
  },
  {
    accessorKey: "dueDate",
    header: "Jatuh Tempo",
    cell: ({ row }) => (row.original.dueDate ? format(row.original.dueDate, "dd MMMM yyyy") : ""),
  },
  {
    accessorKey: "totalAmount",
    header: "Total Tagihan",
    cell: ({ row }) => formatIndonesiaCurrency(row.original.totalAmount),
  },
  {
    accessorKey: "unpaidAmount",
    header: "Sisa Tagihan",
    cell: ({ row }) =>
      row.original.unpaidAmount ? formatIndonesiaCurrency(row.original.unpaidAmount) : "-",
  },
  {
    accessorKey: "status",
    header: "Status Faktur",
  },
  {
    id: "action",
    meta: { align: "center", className: "max-w-content" },
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();

      const actions: DataTableRowAction<IInvoice>[] = [
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
