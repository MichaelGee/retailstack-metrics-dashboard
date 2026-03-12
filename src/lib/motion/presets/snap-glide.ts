import type { MotionPreset } from '../types';

/**
 * Snap & Glide
 *
 * Dual-speed motion system. Micro-interactions (buttons, toggles,
 * checkboxes) are near-instantaneous (<80ms). Macro-transitions
 * (modals, drawers, page-level) are graceful glides (250-350ms).
 *
 * Signature: the contrast between instant snap and smooth glide.
 * Feel: responsive, intelligent, efficient.
 */
export const snapGlide: MotionPreset = {
  name: 'Snap & Glide',
  id: 'snap-glide',

  // VERY high stiffness, overdamped. Settles in <80ms.
  // zeta = 50 / (2 * sqrt(900 * 0.6)) = 1.075 (overdamped)
  springSnappy: { type: 'spring', stiffness: 900, damping: 50, mass: 0.6 },

  // The "glide". Lower stiffness, higher mass = graceful deceleration.
  // zeta = 24 / (2 * sqrt(180 * 1.2)) = 0.816
  springSmooth: { type: 'spring', stiffness: 180, damping: 24, mass: 1.2 },

  // Even more glide for layout reflows
  // zeta = 22 / (2 * sqrt(140 * 1.0)) = 0.928
  springLiquid: { type: 'spring', stiffness: 140, damping: 22, mass: 1.0 },

  liquidEntrance: {
    initial: { opacity: 0, scale: 0.96, y: 12 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 180, damping: 24, mass: 1.2 },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 12,
      transition: { duration: 0.1, ease: [0.32, 0, 0.67, 0] },
    },
  },

  listItemVariants: {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 900, damping: 50, mass: 0.6 },
    },
  },

  listContainerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.025, delayChildren: 0.01 },
    },
  },

  // Aggressive ease-out makes 75ms feel instant
  cssSnappy: { durationMs: 75, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  // Gentler deceleration for the glide
  cssSmooth: { durationMs: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  cssLiquid: { durationMs: 400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },

  stagger: { staggerChildren: 0.025, delayChildren: 0.01 },
  skeletonPulseDuration: 1.8,
};
