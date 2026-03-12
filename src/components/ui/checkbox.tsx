import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { springSnappy } from '@/lib/motion-tokens';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-50',
      // Base (Unchecked)
      'border-border-primary bg-bg-primary',
      // Checked
      'data-[state=checked]:bg-bg-brand-solid data-[state=checked]:border-brand-solid data-[state=checked]:text-white shadow-sm transition-[color,background-color,border-color,box-shadow] duration-snappy ease-snappy',
      className
    )}
    style={{
      borderColor: props.checked ? '#7F56D9' : '#D0D5DD', // Manual fallback/override if needed, but classes handle it mostly.
      // Actually standard radix uses data-[state=checked] for styling classNames.
      // I will trust the classNames above.
    }}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={springSnappy}
      >
        <Check className="size-3" strokeWidth={4} />
      </motion.div>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
