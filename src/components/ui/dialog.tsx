import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { liquidEntrance } from '@/lib/motion-tokens';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    data-cy="close-dialog-from-overlay"
    ref={ref}
    className={cn(
      // Flex centering so Content doesn't need translate(-50%,-50%) hacks
      'fixed inset-0 z-50 flex items-center justify-center bg-bg-overlay/60 backdrop-blur-[2px]',
      // CSS fade for both enter/exit (overlay is a simple fade — spring adds little value here)
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'duration-smooth',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Fix for TS conflict with framer-motion props
type DialogContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
> & {
  showCloseButton?: boolean;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay>
      <DialogPrimitive.Content ref={ref} asChild {...props}>
        <motion.div
          // Spring entrance from the active motion preset
          initial={liquidEntrance.initial}
          animate={liquidEntrance.animate}
          className={cn(
            'scrollbar-hide relative z-50 grid w-full max-w-lg max-md:h-svh gap-4 border border-border-primary bg-bg-primary p-6',
            // CSS exit only — Framer Motion handles entrance, CSS handles exit
            // Radix listens for animationend on these to know when to unmount
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'duration-smooth ease-smooth',
            'sm:rounded-2xl sm:max-w-[425px] lg:max-w-screen-sm overflow-y-scroll max-h-screen',
            className
          )}
        >
          {children}
          {showCloseButton && (
            <DialogClose className="absolute right-4 top-4 bg-bg-primary p-1">
              <X className="size-6 text-text-disabled" />
            </DialogClose>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogOverlay>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 md:gap-0 gap-4',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-text-lg font-semibold tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-text-tertiary', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
