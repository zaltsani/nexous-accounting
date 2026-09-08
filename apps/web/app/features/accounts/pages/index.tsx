import type { IAccount, IAccountNode } from "@nexous-accounting/types";
import { Button } from "@nexous-accounting/ui";
import { useMemo, useState } from "react";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTable } from "~/components/data-table/use-data-table";
import { useTableState } from "~/components/data-table/use-table-state";
import { CreateAccount } from "~/features/accounts/components/create-account";
import { accountColumns } from "../components/account-columns";
import { DeleteAccount } from "../components/delete-account";
import { UpdateAccount } from "../components/update-account";
import { useGetAccountList } from "../data/use-get-account-list";
import { buildAccountTree } from "../utils/build-account-tree";

export default function () {
  const { setSearch, debouncedSearch, pagination, sorting, setPagination, setSorting, apiParams } =
    useTableState({ initialPageSize: 1000 });

  const { data, isLoading, error } = useGetAccountList(apiParams);

  const treeData = useMemo(() => {
    return buildAccountTree(data?.items ?? []);
  }, [data?.items]);

  const [selectedData, setSelectedData] = useState<undefined | IAccount>(undefined);

  const [createAccountModalOpen, setCreateAccountModalOpen] = useState<boolean>(false);
  const [updateAccountModalOpen, setUpdateAccountModalOpen] = useState<boolean>(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState<boolean>(false);

  const { table } = useDataTable<IAccountNode>({
    data: treeData,
    columns: accountColumns,
    rowCount: data?.totalCount ?? 0,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    search: debouncedSearch,
    onSearchChange: setSearch,
    getRowId: (row) => row.id,
    getSubRows: (row) => row.children,
    mode: "client",
    meta: {
      updateRow: (rowData) => {
        setSelectedData(rowData);
        setTimeout(() => setUpdateAccountModalOpen(true), 300);
      },
      deleteRow: (rowData) => {
        setSelectedData(rowData);
        setTimeout(() => setDeleteAccountModalOpen(true), 300);
      },
    },
  });

  console.log({ data, treeData });

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

      <DataTable
        table={table}
        loading={isLoading}
        error={error?.message}
        showPagination={false}
        tableClassName="font-mono"
      />

      <CreateAccount open={createAccountModalOpen} onOpenChange={setCreateAccountModalOpen} />
      {selectedData && (
        <UpdateAccount
          key={selectedData.id}
          data={selectedData}
          open={updateAccountModalOpen}
          onOpenChange={setUpdateAccountModalOpen}
        />
      )}
      {selectedData && (
        <DeleteAccount
          key={selectedData.id}
          data={selectedData}
          open={deleteAccountModalOpen}
          onOpenChange={setDeleteAccountModalOpen}
        />
      )}
    </div>
  );
}
