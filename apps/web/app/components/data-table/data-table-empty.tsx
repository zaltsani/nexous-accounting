import { TableBody, TableCell, TableRow } from "@nexous/ui";

interface DataTableEmptyProps {
  colSpan: number;
}

export function DataTableEmpty({ colSpan }: DataTableEmptyProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan}>Tidak ada data.</TableCell>
      </TableRow>
    </TableBody>
  );
}