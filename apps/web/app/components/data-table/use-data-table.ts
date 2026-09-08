import { useState } from "react";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type PaginationState,
  type Row,
  type SortingState,
  type TableOptions,
} from "@tanstack/react-table";

interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  rowCount: number;

  pagination: PaginationState;
  onPaginationChange: (
    pagination: PaginationState | ((old: PaginationState) => PaginationState),
  ) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState | ((old: SortingState) => SortingState)) => void;
  search: string;
  onSearchChange: (search: string) => void;

  expanded?: ExpandedState;
  defaultExpanded?: ExpandedState;
  onExpandedChange?: (expanded: ExpandedState | ((old: ExpandedState) => ExpandedState)) => void;
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;

  meta?: TableOptions<TData>["meta"];
  mode?: "server" | "client";
}

export function useDataTable<TData>({
  data,
  columns,
  rowCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  search,
  onSearchChange,
  expanded: externalExpanded,
  defaultExpanded = true,
  onExpandedChange: externalOnExpandedChange,
  getSubRows,
  getRowId,
  meta,
  mode = "server",
}: UseDataTableProps<TData>) {
  const isServer = mode === "server";

  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>(defaultExpanded);

  const expanded = externalExpanded ?? internalExpanded;
  const onExpandedChange = externalOnExpandedChange ?? setInternalExpanded;

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      globalFilter: search,
      expanded,
    },
    onPaginationChange,
    onSortingChange,
    onGlobalFilterChange: onSearchChange,
    onExpandedChange,

    getRowId: getRowId ?? ((row: any) => row.id),
    getSubRows: getSubRows ?? ((row: any) => row.children),

    paginateExpandedRows: false,
    autoResetExpanded: false,

    meta,

    manualPagination: isServer,
    manualSorting: isServer,
    manualFiltering: isServer,

    rowCount: isServer ? rowCount : undefined,
    pageCount: isServer && rowCount ? Math.ceil(rowCount / pagination.pageSize) : undefined,

    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),

    getPaginationRowModel: isServer ? undefined : getPaginationRowModel(),
    getFilteredRowModel: isServer ? undefined : getFilteredRowModel(),
    getSortedRowModel: isServer ? undefined : getSortedRowModel(),
  });

  return { table };
}
