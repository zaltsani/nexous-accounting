import { type Table } from '@tanstack/react-table';
import { Input } from '@nexous/ui';
import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeholder?: string;
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  bottomActions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  placeholder = "Search...",
  leftActions,
  rightActions,
  bottomActions,
}: DataTableToolbarProps<TData>) {
  const globalFilterValue = (table.getState().globalFilter as string) ?? '';

  const [inputValue, setInputValue] = useState(globalFilterValue);

  useEffect(() => {
    setInputValue(globalFilterValue);
  }, [globalFilterValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    table.setGlobalFilter(value);
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
        {leftActions}
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full flex items-center">
            <SearchIcon className="absolute right-4 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              className='pr-10'
            />
          </div>
        </div>
        {rightActions}
      </div>
      {bottomActions}
    </div>
  );
}