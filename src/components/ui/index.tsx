import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { Pagination } from './Pagination';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Recursively extract plain text from React nodes (strips component styling)
const extractTextContent = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node || typeof node === 'boolean') return '';
  if (Array.isArray(node)) return node.map(extractTextContent).join('');
  if (React.isValidElement(node) && node.props.children != null) {
    return extractTextContent(node.props.children as React.ReactNode);
  }
  return '';
};

const TableCellContent = ({
  children,
  columnId,
}: {
  children: React.ReactNode;
  columnId: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

  // Skip truncation for specific columns that should be full width or handle their own layout
  const shouldSkipTruncation = ['actions', 'select', 'selection'].includes(columnId.toLowerCase());

  const textContent = extractTextContent(children);

  React.useLayoutEffect(() => {
    if (shouldSkipTruncation || !textContent) return;

    const checkTruncation = () => {
      // Compare hidden span's natural text width against the container's rendered width
      if (containerRef.current && measureRef.current) {
        setIsTruncated(measureRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };

    const container = containerRef.current;
    if (container) {
      const resizeObserver = new ResizeObserver(checkTruncation);
      resizeObserver.observe(container);

      checkTruncation();

      return () => {
        resizeObserver.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, textContent]);

  if (shouldSkipTruncation || !textContent) {
    return <>{children}</>;
  }

  const content = (
    <div ref={containerRef} className="relative max-w-[12rem]">
      {/* Hidden span for measuring natural text width — not clipped by overflow */}
      <span
        ref={measureRef}
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
        aria-hidden="true"
      >
        {textContent}
      </span>
      {/* Visible content — [&>*]:truncate propagates ellipsis to block children */}
      <div className="truncate [&>*]:truncate">{children}</div>
    </div>
  );

  if (isTruncated) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent className="max-w-[400px] break-words">{textContent}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

interface GenericTableProps<T, TValue> {
  data: T[];
  columns: ColumnDef<T, TValue>[];
  onRowClick?: (row: T) => void;
  onRowHover?: (row: T) => void;
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  className?: string;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  showPagination?: boolean;
  customToolbar?: React.ReactNode;
  initialRowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
}

export function GenericTable<T, TValue>({
  data,
  columns,
  onRowClick,
  onRowHover,
  className,
  showPagination = true,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  emptyState,
  hasNextPage,
  hasPrevPage,
  customToolbar,
  initialRowSelection = {},
  onRowSelectionChange,
}: GenericTableProps<T, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState(initialRowSelection);

  const prevInitialSelectionRef = React.useRef(JSON.stringify(initialRowSelection));

  React.useEffect(() => {
    const newSelectionStr = JSON.stringify(initialRowSelection);

    if (newSelectionStr !== prevInitialSelectionRef.current) {
      setRowSelection(initialRowSelection);
      prevInitialSelectionRef.current = newSelectionStr;
    }
  }, [initialRowSelection]);

  React.useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(rowSelection);
    }
  }, [rowSelection, onRowSelectionChange]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      {customToolbar &&
        React.cloneElement(customToolbar as React.ReactElement, {
          table,
        })}

      {data?.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-3 py-20">
          {emptyState || (
            <>
              <h1 className="!mt-0 text-xl font-bold !text-text-primary">No Data Available</h1>
              <p className="!mt-1.5 text-center text-sm text-text-tertiary">
                There are no records to display at this time.
              </p>
            </>
          )}
        </div>
      ) : isLoading ? (
        <div className="w-full">
          <Table className={`${className || ''} mt-4`}>
            <TableHeader>
              <TableRow>
                {columns.map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="w-full">
          <Table className={`${className || ''}`}>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  onMouseEnter={() => onRowHover && onRowHover(row.original)}
                  className={onRowClick ? 'cursor-pointer hover:bg-bg-secondary/50' : ''}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      <TableCellContent columnId={cell.column.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCellContent>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && showPagination && data?.length !== 0 && (
        <Pagination
          columns={columns}
          currentPage={currentPage || 1}
          totalPages={totalPages || 1}
          onPageChange={onPageChange || (() => {})}
          hasNextPage={hasNextPage || false}
          hasPrevPage={hasPrevPage || false}
        />
      )}
    </div>
  );
}
