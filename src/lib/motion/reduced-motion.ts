import type { MotionPreset } from './types';

/**
 * Accessible fallback for prefers-reduced-motion.
 *
 * No springs, no blur, no scale, no stagger.
 * Only instant opacity crossfade.
 */
export const reducedMotionPreset: MotionPreset = {
  name: 'Reduced Motion',
  id: 'soft-settle',

  springSnappy: { type: 'spring', stiffness: 900, damping: 80, mass: 1 },
  springSmooth: { type: 'spring', stiffness: 900, damping: 80, mass: 1 },
  springLiquid: { type: 'spring', stiffness: 900, damping: 80, mass: 1 },

  liquidEntrance: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.01 } },
    exit: { opacity: 0, transition: { duration: 0.01 } },
  },

  listItemVariants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
  },

  listContainerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0, delayChildren: 0 },
    },
  },

  cssSnappy: { durationMs: 0, easing: 'linear' },
  cssSmooth: { durationMs: 0, easing: 'linear' },
  cssLiquid: { durationMs: 0, easing: 'linear' },

  stagger: { staggerChildren: 0, delayChildren: 0 },
  skeletonPulseDuration: 0,
};
