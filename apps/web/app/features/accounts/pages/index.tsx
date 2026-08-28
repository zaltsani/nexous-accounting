import { Button } from "@nexous-accounting/ui";
import { useState } from "react";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { CreateAccount } from "~/features/accounts/components/create-account";
import { accountColumns } from "../components/account-columns";
import { useGetAccountList } from "../data/use-get-account-list";
import type { IAccount } from "@nexous-accounting/types";
import { UpdateAccount } from "../components/update-account";

export default function () {
  const { setSearch, debouncedSearch, pagination, sorting, setPagination, setSorting, apiParams } =
    useTableState();

  const { data } = useGetAccountList(apiParams);

  const [selectedData, setSelectedData] = useState<undefined | IAccount>(undefined);

  const [createAccountModalOpen, setCreateAccountModalOpen] = useState<boolean>(false);
  const [updateAccountModalOpen, setUpdateAccountModalOpen] = useState<boolean>(false);

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
    meta: {
      updateRow: (rowData) => {
        setSelectedData(rowData);
        setTimeout(() => setUpdateAccountModalOpen(true), 300);
      },
    },
  });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Chart of Account</h1>
          <p className="text-sm sm:text-base">Daftar akun perushaan</p>
        </div>
        <Button onClick={() => setCreateAccountModalOpen(true)}>Tambah Akun</Button>
      </div>

      <DataTable table={table} />

      <CreateAccount open={createAccountModalOpen} onOpenChange={setCreateAccountModalOpen} />
      {selectedData && (
        <UpdateAccount
          key={selectedData.id}
          data={selectedData}
          open={updateAccountModalOpen}
          onOpenChange={setUpdateAccountModalOpen}
        />
      )}
    </div>
  );
}
