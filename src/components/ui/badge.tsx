import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit items-center rounded-md px-[0.375rem] py-[0.1875rem] text-xs font-semibold transition-colors duration-snappy ease-snappy focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border border-border-secondary bg-bg-quaternary text-text-tertiary',
        info: 'border border-blue-200 bg-blue-50 text-blue-700',
        positive: 'border border-success-200 bg-bg-success-secondary text-success-700',
        negative: 'border border-error-200 bg-bg-error-secondary text-text-error-primary',
        warning: 'border border-warning-200 bg-bg-warning-secondary text-text-warning-primary',
        destructive: 'border border-transparent bg-bg-error-secondary text-text-error-primary',
        outline: 'border border-border-secondary bg-transparent text-text-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
