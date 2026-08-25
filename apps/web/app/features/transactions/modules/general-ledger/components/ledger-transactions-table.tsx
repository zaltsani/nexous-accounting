import { cn, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nexous/ui";
import { flexRender, type RowData, type Table as TanStackTable } from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { DataTableEmpty } from "~/components/data-table/data-table-empty";
import { DataTableError } from "~/components/data-table/data-table-error";
import { DataTablePagination } from "~/components/data-table/data-table-pagination";
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar";

interface LedgerTransactionsTableProps<TData extends RowData> {
  table: TanStackTable<TData>;
  loading?: boolean;
  error?: string | null;
  placeholder?: string;
  showToolbar?: boolean;
  showPagination?: boolean;
  toolbarLeftActions?: React.ReactNode;
  toolbarRightActions?: React.ReactNode;
  toolbarBottomActions?: React.ReactNode;
  verticalAlign?: "top" | "bottom" | "middle";
}

const verticalAlignClasses: Record<NonNullable<LedgerTransactionsTableProps<any>["verticalAlign"]>, string> = {
  top: "!align-top",
  middle: "!align-middle",
  bottom: "!align-bottom",
};

export function LedgerTransactionsTable<TData extends RowData>({
  table,
  loading = false,
  error = null,
  placeholder,
  showToolbar = true,
  showPagination = true,
  toolbarLeftActions,
  toolbarRightActions,
  toolbarBottomActions,
  verticalAlign = "middle",
}: LedgerTransactionsTableProps<TData>) {
  const colSpan = table.getVisibleFlatColumns().length;
  const rows = table.getRowModel().rows;

  return (
    <div className="grid gap-4">
      {showToolbar && (
        <DataTableToolbar
          table={table}
          placeholder={placeholder}
          leftActions={toolbarLeftActions}
          rightActions={toolbarRightActions}
          bottomActions={toolbarBottomActions}
        />
      )}

      <div className="border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const align = header.column.columnDef.meta?.align || "left";
                  const justifyClass =
                    align === "right"
                      ? "justify-end"
                      : align === "center"
                        ? "justify-center"
                        : "justify-start";
                  const className = header.column.columnDef.meta?.className;

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      align={align}
                      className={className}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? `cursor-pointer select-none flex items-center gap-2 group hover:text-slate-900 transition-colors ${justifyClass}`
                              : `flex items-center ${justifyClass}`
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className={align === "right" ? "order-first" : ""}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>

                          {header.column.getCanSort() && (
                            <span
                              className={`flex items-center text-muted-foreground group-hover:text-slate-600 ${align === "right" ? "order-last" : ""}`}
                            >
                              {(() => {
                                const isSorted = header.column.getIsSorted();
                                if (isSorted === "asc")
                                  return <ChevronUp className="h-4 w-4 text-primary" />;
                                if (isSorted === "desc")
                                  return <ChevronDown className="h-4 w-4 text-primary" />;
                                return (
                                  <ChevronsUpDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                );
                              })()}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {loading ? (
            <DataTableSkeleton columns={colSpan} />
          ) : error ? (
            <DataTableError colSpan={colSpan} message={error} />
          ) : rows.length === 0 ? (
            <DataTableEmpty colSpan={colSpan} />
          ) : (
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        verticalAlignClasses[verticalAlign],
                        cell.column.columnDef.meta?.className,
                      )}
                      align={cell.column.columnDef.meta?.align || "left"}
                    >
                      <div className="text-wrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {showPagination && <DataTablePagination table={table} />}
    </div>
  );
}
