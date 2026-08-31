import { type IEntry } from "@nexous-accounting/types";
import { TableCell, TableFooter } from "@nexous-accounting/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const accountEntriesColumns: ColumnDef<IEntry>[] = [
  {
    accessorKey: "transaction.date",
    header: "Tanggal",
    cell: ({ row }) =>
      row.original.transaction && format(row.original.transaction.date, "dd MMMM yyyy"),
  },
  {
    accessorKey: "transaction.description",
    header: "Deskripsi",
  },
  {
    id: "debit",
    accessorKey: "amount",
    header: "Debit",
    cell: ({ row }) => {
      const isDebit = row.original.amount > 0;
      if (isDebit) return row.original.amount;
    },
  },
  {
    id: "credit",
    accessorKey: "amount",
    header: "Kredit",
    cell: ({ row }) => {
      const isCredit = row.original.amount < 0;
      if (isCredit) return Math.abs(row.original.amount);
    },
  },
  {
    id: "total",
    accessorKey: "amount",
    header: "Jumlah",
    cell: ({ row }) => Math.abs(row.original.amount),
  },
];

export const AccountEntriesFooter = ({ entries }: { entries: IEntry[] }) => {
  const totalDebit = entries
    .filter((d) => d.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalCredit = entries
    .filter((d) => d.amount < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  const total = totalDebit - totalCredit;

  return (
    <TableFooter className="bg-gray-200">
      <TableCell colSpan={2}>Total</TableCell>
      <TableCell>{totalDebit}</TableCell>
      <TableCell>{totalCredit}</TableCell>
      <TableCell>{total}</TableCell>
    </TableFooter>
  );
};
