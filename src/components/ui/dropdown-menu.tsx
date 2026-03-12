'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { springSnappy } from '@/lib/motion-tokens';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default gap-2 select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors duration-snappy ease-snappy',
      'focus:bg-brand-50 focus:text-brand-900', // Premium Hover State
      'data-[state=open]:bg-brand-50 data-[state=open]:text-brand-900',
      'text-text-secondary font-medium tracking-tight',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto text-text-tertiary opacity-50" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

// Fix for TS conflict with framer-motion props
type DropdownMenuContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
>;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuContentProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent ref={ref} asChild {...props}>
    <motion.div
      initial={{ opacity: 0, scale: 0.96, x: -4 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.96, x: -4 }}
      transition={springSnappy}
      className={cn(
        // MacOS/Linear Style Container
        'z-50 min-w-[10rem] overflow-hidden rounded-xl border bg-white/95 p-1.5 text-text-primary shadow-xl backdrop-blur-sm',
        className
      )}
      style={{ borderColor: '#EAECF0' }}
    >
      {children}
    </motion.div>
  </DropdownMenuPrimitive.SubContent>
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content ref={ref} sideOffset={sideOffset} asChild {...props}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -4 }}
        transition={springSnappy}
        className={cn(
          // MacOS/Linear Style Container
          'z-50 min-w-[10rem] overflow-hidden rounded-xl border bg-white/95 p-1.5 text-text-primary shadow-xl backdrop-blur-sm',
          className
        )}
        style={{ borderColor: '#EAECF0' }}
      >
        {children}
      </motion.div>
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors duration-snappy ease-snappy',
      // Premium Hover State (Brand Tint)
      'focus:bg-brand-50 focus:text-brand-900',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      // Typography
      'text-text-secondary font-medium tracking-tight',
      '[&>svg]:size-4 [&>svg]:shrink-0',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none transition-colors duration-snappy ease-snappy',
      'focus:bg-brand-50 focus:text-brand-900',
      'text-text-secondary font-medium tracking-tight',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springSnappy}>
          <Check className="size-4 text-brand-600" />
        </motion.div>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none transition-colors duration-snappy ease-snappy',
      'focus:bg-brand-50 focus:text-brand-900',
      'text-text-secondary font-medium tracking-tight',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springSnappy}>
          <Circle className="size-2 fill-brand-600 text-brand-600" />
        </motion.div>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-3 py-1.5 text-xs font-semibold text-text-tertiary uppercase tracking-wider',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border-secondary/50', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-text-tertiary', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
