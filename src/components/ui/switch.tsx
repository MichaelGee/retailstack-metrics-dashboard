import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { springSnappy } from '@/lib/motion-tokens';

const MotionSwitchRoot = motion(SwitchPrimitives.Root);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <MotionSwitchRoot
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm',
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // We removed the bg- classes here because we control them with 'animate' below
      'flex',
      className
    )}
    // 1. FORCE COLORS via Animation
    // This ignores CSS classes and forces the correct colors to render
    animate={{
      backgroundColor: props.checked ? '#9E77ED' : '#EAECF0', // Brand-500 vs Gray-200
      justifyContent: props.checked ? 'flex-end' : 'flex-start',
    }}
    // Exact Focus Ring Color
    style={{ '--brand-200': '#E9D7FE' } as React.CSSProperties}
    whileTap={{ scale: 0.95 }}
    transition={springSnappy}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {...(props as any)}
    ref={ref}
  >
    <SwitchPrimitives.Thumb asChild>
      <motion.span
        layout
        transition={springSnappy}
        className="pointer-events-none block size-4 rounded-full bg-white shadow-lg ring-0"
      />
    </SwitchPrimitives.Thumb>
  </MotionSwitchRoot>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
