import type { MotionPreset } from '../types';

/**
 * Blur Morph
 *
 * Elements emerge from a soft blur into sharp focus, combined with
 * a subtle scale shift. Like adjusting a camera lens -- the world
 * sharpens into view.
 *
 * Signature: blur(4px) → blur(0px) on every entrance/exit.
 * Feel: cinematic, modern, depth-aware.
 */
export const blurMorph: MotionPreset = {
  name: 'Blur Morph',
  id: 'blur-morph',

  // Overdamped, no overshoot. The blur is the reveal, not bounce.
  // zeta = 38 / (2 * sqrt(400 * 1)) = 0.95
  springSnappy: { type: 'spring', stiffness: 400, damping: 38, mass: 1 },

  // Slightly slower to let the blur-to-sharp transition read
  // zeta = 26 / (2 * sqrt(200 * 1.2)) = 0.839
  springSmooth: { type: 'spring', stiffness: 200, damping: 26, mass: 1.2 },

  // Very gentle for layout shifts so blur can be perceived
  // zeta = 20 / (2 * sqrt(100 * 1.3)) = 0.877
  springLiquid: { type: 'spring', stiffness: 100, damping: 20, mass: 1.3 },

  liquidEntrance: {
    initial: { opacity: 0, scale: 0.94, y: 4, filter: 'blur(4px)' },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 200, damping: 26, mass: 1.2 },
    },
    exit: {
      opacity: 0,
      scale: 0.94,
      y: 4,
      filter: 'blur(4px)',
      transition: { duration: 0.18, ease: [0.32, 0, 0.67, 0] },
    },
  },

  listItemVariants: {
    hidden: { opacity: 0, y: 3, filter: 'blur(3px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 400, damping: 38, mass: 1 },
    },
  },

  listContainerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.03 },
    },
  },

  // Deceleration curve mirroring a camera rack-focus
  cssSnappy: { durationMs: 200, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
  cssSmooth: { durationMs: 350, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
  cssLiquid: { durationMs: 500, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },

  stagger: { staggerChildren: 0.06, delayChildren: 0.03 },
  skeletonPulseDuration: 2.5,
};
