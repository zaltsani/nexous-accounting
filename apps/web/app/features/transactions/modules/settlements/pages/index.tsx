import { Button } from "@nexous-accounting/ui";
import { href, Link } from "react-router";
import PageHeader from "~/components/common/page-header";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { settlementsColumns } from "../components/sales-invoice-columns";
import { useGetSettlementList } from "../hooks/use-get-settlement-list";

export default function () {
  const { setSearch, debouncedSearch, pagination, sorting, setPagination, setSorting, apiParams } =
    useTableState({ initialPageSize: 20 });

  const { data } = useGetSettlementList(apiParams);

  const { table } = useDataTable({
    data: data?.items ?? [],
    columns: settlementsColumns,
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
      <PageHeader showBack title="Penerimaan (Settlement)">
        <Button render={<Link to={href("/settlements/create")} />}>Buat Penerimaan</Button>
      </PageHeader>
      <DataTable table={table} />
    </>
  );
}
