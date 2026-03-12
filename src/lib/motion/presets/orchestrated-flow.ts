import type { MotionPreset } from '../types';

/**
 * Orchestrated Flow
 *
 * Individual element motion is simple (fade + short translate).
 * The sophistication is in the choreography: pronounced stagger
 * timing, sequential reveal patterns, and container-to-child
 * relationships. Like dominoes falling, but elegant.
 *
 * Signature: 80ms stagger between children, 50ms initial delay.
 * Feel: polished, editorial, intentional.
 */
export const orchestratedFlow: MotionPreset = {
  name: 'Orchestrated Flow',
  id: 'orchestrated-flow',

  // Standard, clean. Nothing fancy -- the stagger does the work.
  // zeta = 35 / (2 * sqrt(450 * 1)) = 0.825
  springSnappy: { type: 'spring', stiffness: 450, damping: 35, mass: 1 },

  // Moderate, predictable
  // zeta = 28 / (2 * sqrt(250 * 1)) = 0.886
  springSmooth: { type: 'spring', stiffness: 250, damping: 28, mass: 1 },

  // Reliable layout spring
  // zeta = 23 / (2 * sqrt(160 * 0.9)) = 0.958
  springLiquid: { type: 'spring', stiffness: 160, damping: 23, mass: 0.9 },

  liquidEntrance: {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 250, damping: 28, mass: 1 },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.15, ease: [0.32, 0, 0.67, 0] },
    },
  },

  // Pronounced stagger (0.08s per item) IS the identity
  listItemVariants: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 450, damping: 35, mass: 1 },
    },
  },

  listContainerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  },

  // Standard ease-out; the identity lives in stagger, not easing
  cssSnappy: { durationMs: 150, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' },
  cssSmooth: { durationMs: 280, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' },
  cssLiquid: { durationMs: 400, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' },

  stagger: { staggerChildren: 0.08, delayChildren: 0.05 },
  skeletonPulseDuration: 2.2,
};
