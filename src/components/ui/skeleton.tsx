import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { motionPreset } from '@/lib/motion-tokens';

function Skeleton({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      // Custom Pulse: Smooth "Breathing" animation
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{
        duration: motionPreset.skeletonPulseDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={cn('rounded-md', className)}
      // Fixed Color: Gray-200 (#EAECF0) guarantees visibility on white backgrounds.
      // (The original bg-bg-secondary was too light).
      style={{ backgroundColor: '#EAECF0', ...props.style }}
      {...props}
    />
  );
}

export { Skeleton };
