import { type Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDown } from 'lucide-react';

interface TableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function TableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: TableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === 'desc'
                ? `Sorted descending. Click to sort ascending.`
                : column.getIsSorted() === 'asc'
                  ? `Sorted ascending. Click to sort descending.`
                  : `Not sorted. Click to sort ascending.`
            }
            variant="tertiaryGray"
            size="sm"
            className="-ml-3 h-8 outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <ChevronsUpDown className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem aria-label="Sort ascending" onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 size-3.5 text-text-tertiary" aria-hidden="true" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem aria-label="Sort descending" onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 size-3.5 text-text-tertiary" aria-hidden="true" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
