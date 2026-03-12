import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Spinner } from './spinner';
import { springSnappy } from '@/lib/motion-tokens';

const buttonVariants = cva(
  'inline-flex cursor-default items-center justify-center whitespace-nowrap font-semibold outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'border border-brand-600 bg-brand-600 text-white shadow-xs hover:border-brand-700 hover:bg-brand-700 focus-visible:ring-4 focus-visible:ring-brand-100 disabled:border-brand-200 disabled:bg-brand-200 disabled:text-white',
        secondaryColor:
          'border border-brand-50 bg-brand-50 text-brand-700 shadow-xs hover:border-brand-100 hover:bg-brand-100 focus-visible:ring-4 focus-visible:ring-brand-100 disabled:border-brand-25 disabled:bg-brand-25 disabled:text-brand-300',
        secondaryGray:
          'border border-gray-300 bg-white text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-800 focus-visible:ring-4 focus-visible:ring-gray-100 disabled:border-gray-200 disabled:text-gray-300',
        tertiaryColor:
          'border border-transparent bg-transparent text-brand-700 hover:bg-brand-50 focus-visible:ring-4 focus-visible:ring-brand-100 disabled:text-brand-300',
        tertiaryGray:
          'border border-transparent bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-700 focus-visible:ring-4 focus-visible:ring-gray-100 disabled:text-gray-300',
        linkColor:
          'border-0 bg-transparent text-brand-700 hover:text-brand-800 disabled:text-gray-300',
        linkGray:
          'border-0 bg-transparent text-gray-600 hover:text-gray-700 disabled:text-gray-300',
      },
      size: {
        sm: 'h-9 gap-1 rounded-md px-3.5 text-sm',
        md: 'h-10 gap-1 rounded-md px-4 text-sm',
        lg: 'h-11 gap-1.5 rounded-md px-[1.125rem] text-md',
        xl: 'h-12 gap-1.5 rounded-md px-5 text-md',
      },
      destructive: {
        true: '',
        false: '',
      },
      iconOnly: {
        true: 'justify-center px-0',
        false: '',
      },
    },
    compoundVariants: [
      // --- Destructive overrides ---
      {
        variant: 'primary',
        destructive: true,
        className:
          'border-error-600 bg-error-600 hover:border-error-700 hover:bg-error-700 focus-visible:ring-error-100 disabled:border-error-200 disabled:bg-error-200',
      },
      {
        variant: 'secondaryColor',
        destructive: true,
        className:
          'border-error-50 bg-error-50 text-error-700 hover:border-error-100 hover:bg-error-100 focus-visible:ring-error-100 disabled:border-error-25 disabled:bg-error-25 disabled:text-error-300',
      },
      {
        variant: 'secondaryGray',
        destructive: true,
        className:
          'border-error-300 text-error-700 hover:bg-error-50 hover:text-error-800 focus-visible:ring-error-100 disabled:border-error-200 disabled:text-error-300',
      },
      {
        variant: 'tertiaryColor',
        destructive: true,
        className:
          'text-error-700 hover:bg-error-50 focus-visible:ring-error-100 disabled:text-error-300',
      },
      {
        variant: 'tertiaryGray',
        destructive: true,
        className:
          'text-error-700 hover:bg-error-50 hover:text-error-700 focus-visible:ring-error-100 disabled:text-error-300',
      },
      {
        variant: 'linkColor',
        destructive: true,
        className: 'text-error-700 hover:text-error-800 disabled:text-error-300',
      },
      {
        variant: 'linkGray',
        destructive: true,
        className: 'text-error-700 hover:text-error-800 disabled:text-error-300',
      },

      // --- Link size overrides (auto-height, no padding/shadow) ---
      { variant: 'linkColor', size: 'sm', className: 'h-auto rounded-none px-0 shadow-none' },
      { variant: 'linkColor', size: 'md', className: 'h-auto rounded-none px-0 shadow-none' },
      { variant: 'linkColor', size: 'lg', className: 'h-auto rounded-none px-0 shadow-none' },
      { variant: 'linkColor', size: 'xl', className: 'h-auto rounded-none px-0 shadow-none' },
      { variant: 'linkGray', size: 'sm', className: 'h-auto rounded-none px-0 shadow-none' },
      { variant: 'linkGray', size: 'md', className: 'h-auto rounded-none px-0 shadow-none' },
      { variant: 'linkGray', size: 'lg', className: 'h-auto rounded-none px-0 shadow-none' },
      { variant: 'linkGray', size: 'xl', className: 'h-auto rounded-none px-0 shadow-none' },

      // --- Icon-only size overrides (square) ---
      { iconOnly: true, size: 'sm', className: 'size-9' },
      { iconOnly: true, size: 'md', className: 'size-10' },
      { iconOnly: true, size: 'lg', className: 'size-11' },
      { iconOnly: true, size: 'xl', className: 'size-12' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      destructive: false,
      iconOnly: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  destructive?: boolean;
  iconOnly?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      destructive = false,
      iconOnly = false,
      asChild = false,
      loading,
      ...props
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp = asChild ? Slot : (motion.button as any);

    const motionProps = !asChild
      ? {
          whileTap: { scale: 0.95 },
          whileHover: { scale: 1.02 },
          transition: springSnappy,
        }
      : {};

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, destructive, iconOnly, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...motionProps}
        {...props}
      >
        {loading ? <Spinner variant="spin" size="medium" intent="current" /> : props.children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
