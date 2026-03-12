import * as React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { springSnappy } from '@/lib/motion-tokens';
import { useHorizontalScrollIndicator } from '@/hooks/use-horizontal-scroll-indicator';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    const { scrollContainerRef, canScrollLeft, canScrollRight } =
      useHorizontalScrollIndicator<HTMLDivElement>();

    return (
      <div
        className="relative overflow-hidden rounded-md border"
        // Force Visible Border (Gray-200)
        style={{ borderColor: '#EAECF0' }}
      >
        {/* Left scroll shadow */}
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 z-10 w-6 transition-opacity duration-snappy ease-snappy',
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.06), transparent)',
          }}
          aria-hidden="true"
        />

        <div ref={scrollContainerRef} className="w-full overflow-x-auto">
          <table
            ref={ref}
            className={cn('w-full caption-bottom text-sm border-collapse', className)}
            {...props}
          />
        </div>

        {/* Right scroll shadow */}
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 z-10 w-6 transition-opacity duration-snappy ease-snappy',
            canScrollRight ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(to left, rgba(0, 0, 0, 0.06), transparent)',
          }}
          aria-hidden="true"
        />
      </div>
    );
  }
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('text-text-tertiary font-semibold', className)}
    // Force Header Background (Gray-50) for contrast
    style={{ backgroundColor: '#F9FAFB' }}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0 text-text-secondary font-normal', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-bg-secondary/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

// UPDATED: Motion Row for "Liquid" sorting/filtering
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <motion.tr
      ref={ref}
      layout // This enables the "Glide" when sibling rows are removed/reordered
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        ...springSnappy,
        opacity: { duration: 0.2 },
      }}
      className={cn(
        'border-b transition-colors duration-snappy ease-snappy hover:bg-bg-active/50 data-[state=selected]:bg-bg-active last:border-b-0',
        className
      )}
      // Force Visible Border (Gray-200)
      style={{ borderColor: '#EAECF0' }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    />
  )
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-6 text-left align-middle font-medium text-xs text-text-tertiary whitespace-nowrap border-b first:pl-6 last:pr-6',
      className
    )}
    // Force Visible Border (Gray-200)
    style={{ borderColor: '#EAECF0' }}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'py-4 px-6 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5 text-sm font-normal text-text-secondary',
      className
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-text-tertiary', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
