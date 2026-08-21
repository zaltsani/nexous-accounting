import { type ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@nexous/ui';

export interface DataTableRowAction<TRow> {
  label: string;
  onClick: (row: TRow) => void;
  disabled?: (row: TRow) => boolean;
  icon?: ReactNode;
  variant?: 'default' | 'destructive';
}

interface DataTableActionsProps<TRow> {
  actions: DataTableRowAction<TRow>[];
  children: React.ReactElement;
  row: TRow;
}

export function DataTableActions<TRow>({
  actions,
  children,
  row,
}: DataTableActionsProps<TRow>) {
  if (actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={children} />
      <DropdownMenuContent
        align="end"
        className="w-max"
      >
        {actions.map((action) => {
          const isDisabled = action.disabled ? action.disabled(row) : false;
          const isDestructive = action.variant === 'destructive';
          return (
            <DropdownMenuItem
              key={action.label}
              disabled={isDisabled}
              onClick={() => !isDisabled && action.onClick(row)}
              className={
                isDestructive 
                  ? 'text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer disabled:pointer-events-none disabled:opacity-50'
                  : 'cursor-pointer'
              }
            >
              {action.icon && (
                <span className="mr-2 flex items-center justify-center">
                  {action.icon}
                </span>
              )}
              <span>{action.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}