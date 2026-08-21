import { type Table } from '@tanstack/react-table';
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@nexous/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nexous/ui';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const paginationOptions = [5, 10, 20, 30, 40, 50];

  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between px-2 py-1 gap-4">
      {/* Items Per Page dropdown selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground">Data ditampilkan per halaman</p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-full sm:w-fit">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {paginationOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page steps buttons */}
      <div className="flex justify-between items-center space-x-2">
        <Button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          size={"icon"}
          variant="black"
        >
          <ChevronFirstIcon />
        </Button>
        <Button
          size="icon"
          variant="black"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="hidden"
        >
          <ChevronLeft />
        </Button>
        <div className='space-x-4 sm:space-x-2'>
          {(() => {
            const maxButtons = 3;
            let startPage = Math.max(0, pageIndex - Math.floor(maxButtons / 2));
            let endPage = Math.min(pageCount - 1, startPage + maxButtons - 1);
            if (endPage - startPage + 1 < maxButtons) {
              startPage = Math.max(0, endPage - maxButtons + 1);
            }
            const visiblePages = Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            );
            return visiblePages.map((index) => (
              <Button
                key={index}
                size="icon"
                variant={index === pageIndex ? "black" : "outline"}
                onClick={() => table.setPageIndex(index)}
              >
                {index + 1}
              </Button>
            ));
          })()}
        </div>
        <Button
          size="icon"
          className="hidden"
          variant="black"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
        <Button
          size="icon"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          variant="black"
        >
          <ChevronLastIcon />
        </Button>
      </div>
    </div>
  );
}