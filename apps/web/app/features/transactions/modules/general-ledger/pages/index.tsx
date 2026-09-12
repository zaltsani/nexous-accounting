import type { ITransaction } from "@nexous-accounting/types";
import { Button } from "@nexous-accounting/ui";
import { href, Link } from "react-router";
import PageHeader from "~/components/common/page-header";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { useGetTransactionList } from "../../../hooks/use-get-transaction-list";
import { transactionColumns } from "../components/transaction-columns";

export default function () {
  const { setSearch, debouncedSearch, pagination, sorting, setPagination, setSorting, apiParams } =
    useTableState();

  const { data, isLoading, error } = useGetTransactionList({
    ...apiParams,
    journalCode: "JU",
  });

  const { table } = useDataTable<ITransaction>({
    data: data?.items ?? [],
    columns: transactionColumns,
    rowCount: data?.totalCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    search: debouncedSearch,
    onSearchChange: setSearch,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.entries as unknown as ITransaction[],
  });

  return (
    <>
      <PageHeader title="Jurnal Umum">
        <Link to={href("/general-ledger/create")}>
          <Button>Buat Jurnal Umum</Button>
        </Link>
      </PageHeader>
      <DataTable
        table={table}
        loading={isLoading}
        error={error && "Error"}
        tableBodyRowClassName="border-b-0"
      />
    </>
  );
}
