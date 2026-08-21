import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type TableOptions,
} from '@tanstack/react-table';

interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  rowCount: number;
  
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState | ((old: PaginationState) => PaginationState)) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState | ((old: SortingState) => SortingState)) => void;
  search: string;
  onSearchChange: (search: string) => void;

  meta?: TableOptions<TData>["meta"];
  mode?: 'server' | 'client';
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
  meta,
  mode = 'server',
}: UseDataTableProps<TData>) {
  const isServer = mode === 'server';
  
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      globalFilter: search,
    },
    onPaginationChange,
    onSortingChange,
    onGlobalFilterChange: onSearchChange,    
    meta,

    manualPagination: isServer,
    manualSorting: isServer,
    manualFiltering: isServer,

    rowCount: isServer ? rowCount : undefined,
    pageCount: isServer && rowCount ? Math.ceil(rowCount / pagination.pageSize) : undefined,
    
    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: isServer ? undefined : getPaginationRowModel(),
    getFilteredRowModel: isServer ? undefined : getFilteredRowModel(),
    getSortedRowModel: isServer ? undefined : getSortedRowModel(),
  });

  return { table };
}