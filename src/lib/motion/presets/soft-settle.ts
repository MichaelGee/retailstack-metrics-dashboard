import type { MotionPreset } from '../types';

/**
 * Soft Settle
 *
 * Elements arrive with a subtle 2-5% overshoot then settle into place.
 * Like a precision instrument clicking into its final position.
 *
 * Signature: micro-overshoot on every entrance, fast settle.
 * Feel: premium, confident, precise.
 */
export const softSettle: MotionPreset = {
  name: 'Soft Settle',
  id: 'soft-settle',

  // zeta = 28 / (2 * sqrt(600 * 0.8)) = 0.639 → ~4% overshoot, ~180ms settle
  springSnappy: { type: 'spring', stiffness: 600, damping: 28, mass: 0.8 },

  // zeta = 22 / (2 * sqrt(260 * 1)) = 0.683 → ~3% overshoot, ~350ms settle
  springSmooth: { type: 'spring', stiffness: 260, damping: 22, mass: 1 },

  // zeta = 18 / (2 * sqrt(120 * 1.1)) = 0.786 → ~2% overshoot, ~500ms settle
  springLiquid: { type: 'spring', stiffness: 120, damping: 18, mass: 1.1 },

  liquidEntrance: {
    initial: { opacity: 0, scale: 0.97, y: 6 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 22, mass: 1 },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: 6,
      transition: { duration: 0.12, ease: [0.32, 0, 0.67, 0] },
    },
  },

  listItemVariants: {
    hidden: { opacity: 0, y: 4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 600, damping: 28, mass: 0.8 },
    },
  },

  listContainerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.02 },
    },
  },

  // y2 > 1.0 creates CSS overshoot equivalent to spring overshoot
  cssSnappy: { durationMs: 180, easing: 'cubic-bezier(0.34, 1.04, 0.64, 1)' },
  cssSmooth: { durationMs: 300, easing: 'cubic-bezier(0.34, 1.03, 0.64, 1)' },
  cssLiquid: { durationMs: 450, easing: 'cubic-bezier(0.34, 1.02, 0.64, 1)' },

  stagger: { staggerChildren: 0.04, delayChildren: 0.02 },
  skeletonPulseDuration: 2,
};
