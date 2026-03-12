'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { springSnappy } from '@/lib/motion-tokens';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

// To prevent the TS2322 'onDrag' conflict during 'npm run build'
type PopoverContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
>;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} asChild {...props}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={springSnappy}
        className={cn(
          'z-50 w-72 rounded-xl border bg-bg-primary p-4 text-text-primary shadow-md outline-none',
          className
        )}
        style={{ borderColor: '#EAECF0' }} // Gray-200 for visible borders
      >
        {props.children}
      </motion.div>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
