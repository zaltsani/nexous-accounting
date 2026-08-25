import PageHeader from "~/components/common/page-header";
import { useGetTransactionList } from "../hooks/use-get-transaction-list";
import { Button } from "@nexous-accounting/ui";
import { href, Link } from "react-router";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { DataTable } from "~/components/data-table/data-table";
import { generalLedgerColumns } from "../components/general-ledger-columns";

export default function () {
  const { setSearch, debouncedSearch, pagination, sorting, setPagination, setSorting, apiParams } =
    useTableState();

  const { data } = useGetTransactionList(apiParams);

  const { table } = useDataTable({
    data: data?.items ?? [],
    columns: generalLedgerColumns,
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
      <PageHeader title="Jurnal Umum">
        <Link to={href("/general-ledger/create")}>
          <Button>Buat Jurnal Umum</Button>
        </Link>
      </PageHeader>
      <DataTable table={table} />
    </>
  );
}
