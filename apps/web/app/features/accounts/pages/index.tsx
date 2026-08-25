import { DataTable } from "~/components/data-table/data-table";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { accountColumns } from "../components/account-columns";
import { useGetAccountList } from "../data/use-get-account-list";

export default function () {
  const { setSearch, debouncedSearch, pagination, sorting, setPagination, setSorting, apiParams } =
    useTableState();

  const { data } = useGetAccountList(apiParams);

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
    <div className="space-y-3">
      <div className="space-y-1">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Chart of Account</h1>
        <p className="text-sm sm:text-base">Daftar akun perushaan</p>
      </div>
      <DataTable table={table} />
    </div>
  );
}
