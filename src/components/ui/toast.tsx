import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { springSnappy } from '@/lib/motion-tokens';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border p-4 shadow-lg transition-all duration-snappy ease-snappy data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
  {
    variants: {
      variant: {
        default: 'border-border-secondary bg-bg-primary text-text-primary',
        destructive: 'destructive group border-error-200 bg-error-50 text-error-700',
        success: 'success group border-success-200 bg-success-50 text-success-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      asChild
      forceMount={true} // KEEPS IT IN DOM FOR EXIT ANIMATION
      {...props}
    >
      <motion.li
        layout
        // ENTRY
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        // EXIT: Slide to the right
        exit={{
          opacity: 0,
          x: '100%',
          scale: 0.95,
          transition: { duration: 0.2, ease: 'anticipate' },
        }}
        transition={springSnappy}
        className={cn(toastVariants({ variant }), className)}
        style={{
          ...(variant === 'default' && { borderColor: '#EAECF0', backgroundColor: '#FFFFFF' }),
          ...(variant === 'destructive' && { borderColor: '#FECDCA', backgroundColor: '#FEF3F2' }),
          ...(variant === 'success' && { borderColor: '#ABEFC6', backgroundColor: '#ECFDF3' }),
        }}
      >
        {props.children}
      </motion.li>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors duration-snappy ease-snappy hover:bg-bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-error-200 group-[.destructive]:hover:border-error-300 group-[.destructive]:hover:bg-error-100 group-[.destructive]:focus:ring-error-500 group-[.success]:border-success-200 group-[.success]:hover:border-success-300 group-[.success]:hover:bg-success-100',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-1 top-1 rounded-md p-1 text-text-tertiary opacity-0 transition-opacity duration-snappy ease-snappy hover:text-text-primary focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-error-400 group-[.destructive]:hover:text-error-600 group-[.success]:text-success-400 group-[.success]:hover:text-success-600',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="size-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold [&+div]:text-xs', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      'text-sm opacity-90 text-text-secondary group-[.destructive]:text-error-700 group-[.success]:text-success-700',
      className
    )}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
