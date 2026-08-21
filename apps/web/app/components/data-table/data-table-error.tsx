import { TableBody, TableCell, TableRow } from "@nexous/ui";

interface DataTableErrorProps {
  colSpan: number;
  message: string;
}

export function DataTableError({ colSpan, message }: DataTableErrorProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan} role="alert">
          {message}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}