import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { springSmooth } from '@/lib/motion-tokens';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-bg-secondary', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator asChild>
      <motion.div
        className="size-full flex-1 bg-bg-brand-solid"
        // We start at -100% (empty) and animate to the current value
        initial={{ x: '-100%' }}
        animate={{ x: `-${100 - (value || 0)}%` }}
        transition={springSmooth}
        // Exact Linear Brand Color (Brand 500)
        style={{ backgroundColor: '#9E77ED' }}
      />
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
