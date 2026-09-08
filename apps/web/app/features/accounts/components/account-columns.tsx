import {
  NON_DELETABLE_ACCOUNT_CODES,
  type IAccount,
  type IAccountNode,
} from "@nexous-accounting/types";
import { Button } from "@nexous-accounting/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  EyeIcon,
  PenLineIcon,
  Trash2Icon,
} from "lucide-react";
import { href, useNavigate } from "react-router";
import {
  DataTableActions,
  type DataTableRowAction,
} from "~/components/data-table/data-table-actions";
import { formatIndonesiaCurrency } from "~/libs/utils/format-indonesia-currency";

export const accountColumns: ColumnDef<IAccountNode>[] = [
  {
    accessorKey: "code",
    header: "Kode Akun",
    cell: ({ row, getValue }) => (
      <span className={row.getCanExpand() ? "font-semibold" : ""}>{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama Akun",
    cell: ({ row, getValue }) => {
      const canExpand = row.getCanExpand();

      return (
        <div className="flex items-center gap-1.5" style={{ paddingLeft: `${row.depth * 1.5}rem` }}>
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
          <span className={canExpand ? "font-semibold text-slate-900" : "text-slate-700"}>
            {getValue<string>()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    cell: ({ row }) => (
      <span className={row.getCanExpand() ? "font-semibold" : ""}>
        {formatIndonesiaCurrency(row.original.balance)}
      </span>
    ),
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
      const account = row.original;

      const hasChildren = Boolean(account.children && account.children.length > 0);
      const isSystemAccount = NON_DELETABLE_ACCOUNT_CODES.has(account.code);
      const hasBalance = Number(account.balance ?? 0) !== 0;
      const isAccountMapping = Boolean(account.mappings && account.mappings.length > 0);

      const canDelete = !hasChildren && !isSystemAccount && !hasBalance && !isAccountMapping;

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
      ];

      if (canDelete)
        actions.push({
          label: "Hapus Akun",
          variant: "destructive",
          icon: <Trash2Icon />,
          onClick: (data) => table.options.meta?.deleteRow?.(data),
        });

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
