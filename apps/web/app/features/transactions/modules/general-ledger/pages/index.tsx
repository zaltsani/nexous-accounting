import { Button } from "@nexous-accounting/ui";
import { href, Link } from "react-router";
import PageHeader from "~/components/common/page-header";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { useGetTransactionList } from "../../../hooks/use-get-transaction-list";
import { entryColumns } from "../components/entries-columns";
import type { IEntry } from "@nexous-accounting/types";
import { LedgerTransactionsTable } from "../components/ledger-transactions-table";

export default function () {
  const { setSearch, debouncedSearch, pagination, sorting, setPagination, setSorting, apiParams } =
    useTableState();

  const { data } = useGetTransactionList({
    ...apiParams,
    journalCode: "JU",
  });

  const entries: IEntry[] = (data?.items ?? []).flatMap(({ entries, ...transaction }) =>
    entries.map((item, index) => ({
      ...item,
      ...(index === 0
        ? {
            transaction: {
              journalCode: transaction.journalCode,
              date: transaction.date,
              description: transaction.description,
            },
          }
        : {}),
    })),
  );

  const { table } = useDataTable({
    data: entries ?? [],
    columns: entryColumns,
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
      {/* <LedgerTransactionsTable table={table} /> */}
    </>
  );
}
