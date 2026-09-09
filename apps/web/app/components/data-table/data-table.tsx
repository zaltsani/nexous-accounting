import { flexRender, type RowData, type Table as TanStackTable } from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import {
  cn,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexous-accounting/ui";
import { DataTableEmpty } from "./data-table-empty";
import { DataTableError } from "./data-table-error";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableSkeleton } from "./data-table-skeleton";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData extends RowData> {
  table: TanStackTable<TData>;
  tableFooter?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  placeholder?: string;
  showToolbar?: boolean;
  showPagination?: boolean;
  toolbarLeftActions?: React.ReactNode;
  toolbarRightActions?: React.ReactNode;
  toolbarBottomActions?: React.ReactNode;
  verticalAlign?: "top" | "bottom" | "middle";
  className?: string;
  containerClassName?: string;
  tableClassName?: string;
  tableHeaderClassName?: string;
  tableHeaderRowClassName?: string;
  tableHeadClassName?: string;
  tableBodyClassName?: string;
  tableBodyRowClassName?: string;
}

const verticalAlignClasses: Record<NonNullable<DataTableProps<any>["verticalAlign"]>, string> = {
  top: "!align-top",
  middle: "!align-middle",
  bottom: "!align-bottom",
};

export function DataTable<TData extends RowData>({
  table,
  tableFooter,
  loading = false,
  error = null,
  placeholder,
  showToolbar = true,
  showPagination = true,
  toolbarLeftActions,
  toolbarRightActions,
  toolbarBottomActions,
  verticalAlign = "middle",
  className,
  containerClassName,
  tableClassName,
  tableHeaderClassName,
  tableHeaderRowClassName,
  tableHeadClassName,
  tableBodyClassName,
  tableBodyRowClassName,
}: DataTableProps<TData>) {
  const colSpan = table.getVisibleFlatColumns().length;
  const rows = table.getRowModel().rows;

  return (
    <div className={cn("grid gap-4", className)}>
      {showToolbar && (
        <DataTableToolbar
          table={table}
          placeholder={placeholder}
          leftActions={toolbarLeftActions}
          rightActions={toolbarRightActions}
          bottomActions={toolbarBottomActions}
        />
      )}

      <div className={cn("overflow-hidden", containerClassName)}>
        <Table className={tableClassName}>
          <TableHeader className={tableHeaderClassName}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={tableHeaderRowClassName}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { align?: string; className?: string }
                    | undefined;
                  const align = meta?.align || "left";
                  const justifyClass =
                    align === "right"
                      ? "justify-end"
                      : align === "center"
                        ? "justify-center"
                        : "justify-start";

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      align={align as any}
                      className={cn(tableHeadClassName, meta?.className)}
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
            <TableBody className={tableBodyClassName}>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-depth={row.depth}
                  data-state={row.getIsExpanded() ? "expanded" : undefined}
                  className={tableBodyRowClassName}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { align?: string; className?: string }
                      | undefined;

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(verticalAlignClasses[verticalAlign], meta?.className)}
                        align={(meta?.align || "left") as any}
                      >
                        <div className="text-wrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          )}
          {tableFooter}
        </Table>
      </div>

      {showPagination && <DataTablePagination table={table} />}
    </div>
  );
}
