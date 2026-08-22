import { Skeleton } from "@nexous/ui";
import { TableBody, TableCell, TableRow } from "@nexous/ui";

interface DataTableSkeletonProps {
  columns: number;
  rows?: number;
}

export function DataTableSkeleton({ columns, rows = 5 }: DataTableSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <TableCell key={columnIndex}>
              <Skeleton className="h-6" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
