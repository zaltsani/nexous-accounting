import { DataTable } from "~/components/data-table/data-table";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { accountColumns } from "../components/account-columns";
import { useGetAccountList } from "../data/use-get-account-list";

export default function () {
  const {
    setSearch,
    debouncedSearch,
    pagination,
    sorting,
    setPagination,
    setSorting,
  } = useTableState();

  const { data } = useGetAccountList();

  const { table } = useDataTable({
    data: data?.items ?? [],
    columns: accountColumns,
    rowCount: data?.totalCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    search: debouncedSearch,
    onSearchChange: setSearch,
  });

  return (
    <>
      <DataTable
        table={table}
      />
    </>
  );
}
