import type { IEntry, ITransaction } from "@nexous-accounting/types";
import { Button } from "@nexous-accounting/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, EllipsisVertical, PenLineIcon, Trash2Icon } from "lucide-react";
import {
  DataTableActions,
  type DataTableRowAction,
} from "~/components/data-table/data-table-actions";
import { formatIndonesiaCurrency } from "~/libs/utils/format-indonesia-currency";

export const transactionColumns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const canExpand = row.getCanExpand();
      const isSubRow = row.depth > 0;

      if (isSubRow) {
        const entry = row.original as unknown as IEntry;
        return (
          <div className="flex items-center pl-8 text-xs text-slate-600">
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 mr-2">
              {entry.account?.code}
            </span>
            <span>{entry.account?.name}</span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-1.5">
          {canExpand ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 text-muted-foreground hover:bg-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                row.toggleExpanded();
              }}
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4 text-slate-700" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <span className="w-5 inline-block" />
          )}
          <span className="font-medium text-slate-900">
            {row.original.date && format(new Date(row.original.date), "dd MMMM yyyy")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      if (isSubRow) return null;

      return row.original.description;
    },
  },
  {
    id: "debit",
    header: "Debit",
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      const totalDebit = row.original.entries
        ?.filter((d) => d.amount > 0)
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

      if (!isSubRow)
        return <span className="font-medium">{formatIndonesiaCurrency(totalDebit)}</span>;

      const entry = row.original as any;
      return entry.amount > 0 ? (
        <span className="font-semibold text-emerald-600">
          {formatIndonesiaCurrency(Math.abs(entry.amount))}
        </span>
      ) : null;
    },
  },
  {
    id: "credit",
    header: "Kredit",
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      const totalCredit = row.original.entries
        ?.filter((d) => d.amount < 0)
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

      if (!isSubRow)
        return <span className="font-medium">{formatIndonesiaCurrency(totalCredit)}</span>;

      const entry = row.original as any;
      return entry.amount < 0 ? (
        <span className="font-semibold text-rose-600">
          {formatIndonesiaCurrency(Math.abs(entry.amount))}
        </span>
      ) : null;
    },
  },
  {
    id: "action",
    meta: { align: "center" },
    header: "Aksi",
    cell: ({ row, table }) => {
      if (row.depth > 0) {
        return null;
      }

      const actions: DataTableRowAction<ITransaction>[] = [
        // {
        //   label: "Detail Transaksi",
        //   icon: <EyeIcon />,
        //   onClick: () => navigate(href("")),
        // },
        {
          label: "Edit Transaksi",
          icon: <PenLineIcon />,
          onClick: (data) => table.options.meta?.updateRow?.(data),
        },
        {
          label: "Hapus Transaksi",
          variant: "destructive",
          icon: <Trash2Icon />,
          onClick: (data) => table.options.meta?.deleteRow?.(data),
        },
      ];

      return (
        <DataTableActions row={row.original} actions={actions}>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
            <EllipsisVertical className="h-4 w-4 text-slate-500" />
          </Button>
        </DataTableActions>
      );
    },
  },
];
