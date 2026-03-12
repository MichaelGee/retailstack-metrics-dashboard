import type { PresetId } from './types';

/**
 * BUILD-TIME CONFIGURATION
 *
 * Change this value to switch the entire motion identity
 * across all components. All imports from `motion-tokens.ts`
 * automatically resolve to the active preset.
 *
 * Options:
 *   'soft-settle'        - Premium micro-overshoot + settle
 *   'blur-morph'         - Cinematic blur-to-sharp depth transitions
 *   'snap-glide'         - Dual-speed: instant micro / graceful macro
 *   'orchestrated-flow'  - Sophisticated stagger choreography
 */
export const ACTIVE_PRESET: PresetId = 'soft-settle';
