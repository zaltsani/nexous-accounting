import { accountTypeLabels } from "@nexous-accounting/types";
import { Badge } from "@nexous-accounting/ui";
import PageHeader from "~/components/common/page-header";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { getAccountById } from "../api/get-account-by-id";
import { accountEntriesColumns, AccountEntriesFooter } from "../components/account-entries-columns";
import { AccountOverview } from "../components/account-overview";
import { useGetAccountEntries } from "../data/use-get-account-entries";
import type { Route } from "./+types/detail";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await getAccountById(params.id);
  return res.data;
}

export default function ({ params, loaderData }: Route.ComponentProps) {
  const data = loaderData;

  const { setSearch, debouncedSearch, pagination, sorting, setPagination, setSorting, apiParams } =
    useTableState({ initialPageSize: 20 });

  const { data: entries, isLoading, error } = useGetAccountEntries(params.id, apiParams);

  const { table: entriesTable } = useDataTable({
    data: entries?.items ?? [],
    columns: accountEntriesColumns,
    rowCount: entries?.totalCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    search: debouncedSearch,
    onSearchChange: setSearch,
  });

  return (
    <>
      <div className="space-y-2">
        <PageHeader title={`${data.code} - ${data.name}`} />
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-semibold">
            {accountTypeLabels[data.type]}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
          >
            Saldo Normal: {data.normalBalance}
          </Badge>
        </div>
      </div>

      <AccountOverview accountData={data} />
      <DataTable
        table={entriesTable}
        loading={isLoading}
        error={error?.message}
        tableFooter={<AccountEntriesFooter entries={entries?.items ?? []} />}
        tableClassName="font-mono"
      />
    </>
  );
}
