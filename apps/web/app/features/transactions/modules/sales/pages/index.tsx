import PageHeader from "~/components/common/page-header";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { useGetSalesInvoiceList } from "../hooks/use-get-sales-invoice-list";
import { salesInvoiceColumns } from "../components/sales-invoice-columns";
import { Button } from "@nexous-accounting/ui";
import { href, Link } from "react-router";

export default function () {
  const { setSearch, debouncedSearch, pagination, sorting, setPagination, setSorting, apiParams } =
    useTableState({ initialPageSize: 20 });

  const { data } = useGetSalesInvoiceList(apiParams);

  const { table } = useDataTable({
    data: data?.items ?? [],
    columns: salesInvoiceColumns,
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
      <PageHeader showBack title="Sales">
        <Button render={<Link to={href("/sales/create")} />}>Buat Invoice</Button>
      </PageHeader>
      <DataTable table={table} />
    </>
  );
}
