import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import type { IApiListQueryParams } from "@nexous-accounting/types";

interface UseTableStateOptions {
  initialPageIndex?: number;
  initialPageSize?: number;
  initialSorting?: SortingState;
  initialSearch?: string;
  debounceDelay?: number;
}

export function useTableState(options: UseTableStateOptions = {}) {
  const delay = options.debounceDelay ?? 500;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: options.initialPageIndex ?? 0,
    pageSize: options.initialPageSize ?? 10,
  });

  const [sorting, setSorting] = useState<SortingState>(options.initialSorting ?? []);

  const [search, setSearch] = useState<string>(options.initialSearch ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(options.initialSearch ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, delay);

    return () => clearTimeout(timer);
  }, [search, delay]);

  // Reset pageIndex
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch]);

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting(updaterOrValue);
      setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page on sort change
    },
    [],
  );

  const apiParams: IApiListQueryParams = {
    search: debouncedSearch,
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    sortBy: sorting[0]?.id || undefined,
    sortOrder: sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined,
  };

  return {
    search,
    setSearch,
    debouncedSearch,
    pagination,
    sorting,
    setPagination,
    setSorting: handleSortingChange,
    apiParams,
  };
}
