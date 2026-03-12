'use client';
import type { DropZoneProps } from 'react-aria-components';
import { DropZone as DropPrimitiveZone, composeRenderProps } from 'react-aria-components';

import { cva } from 'class-variance-authority';

const dropZoneStyles = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-snappy ease-snappy focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-bg-brand-solid-hover bg-bg-brand-solid text-white shadow',
        destructive: 'bg-error-500 text-white shadow-sm hover:bg-error-600',
        outline:
          'border-border-default border bg-bg-primary shadow-sm hover:bg-bg-active hover:text-text-primary',
        secondary: 'bg-bg-secondary text-text-secondary shadow-sm hover:bg-bg-tertiary',
        ghost: 'hover:bg-bg-active hover:text-text-primary',
        link: 'text-text-brand-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const DropZone = ({ className, ...props }: DropZoneProps) => (
  <DropPrimitiveZone
    className={composeRenderProps(className, (className, renderProps) =>
      dropZoneStyles({ ...renderProps, className })
    )}
    {...props}
  />
);
export { DropZone };
