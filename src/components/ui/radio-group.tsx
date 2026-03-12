import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { springSnappy } from '@/lib/motion-tokens';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-3', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Layout & Base
        'peer aspect-square h-5 w-5 rounded-full border shadow-sm outline-none',
        'transition-all duration-snappy ease-snappy',

        // 1. IDLE STATE
        'border-border-secondary bg-bg-primary text-text-primary',

        // 2. HOVER STATE (Micro-interaction)
        'hover:border-[#D0D5DD] hover:shadow-md hover:bg-gray-50/50',

        // 3. CHECKED STATE (Brand Tokens)
        // Replaced hardcoded #9E77ED with bg-brand-600
        'data-[state=checked]:bg-brand-600 data-[state=checked]:border-brand-600 data-[state=checked]:text-white data-[state=checked]:shadow-none',

        // 4. FOCUS STATE
        // Replaced hardcoded #E9D7FE with ring-brand-200 and #9E77ED with border-brand-600
        'focus-visible:ring-4 focus-visible:ring-brand-200 focus-visible:border-brand-600',

        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      asChild
      {...props}
    >
      <motion.button whileTap={{ scale: 0.9 }} transition={springSnappy}>
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springSnappy}>
            <Circle className="size-2.5 fill-current text-current" />
          </motion.div>
        </RadioGroupPrimitive.Indicator>
      </motion.button>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
