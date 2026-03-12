import { activePreset } from './motion/resolve';

export type { MotionPreset, PresetId, SpringConfig, CssTiming } from './motion/types';

// Backward-compatible exports (used by 16+ components)
export const springSnappy = activePreset.springSnappy;
export const springSmooth = activePreset.springSmooth;
export const springLiquid = activePreset.springLiquid;
export const liquidEntrance = activePreset.liquidEntrance;
export const listItemVariants = activePreset.listItemVariants;

// New exports
export const listContainerVariants = activePreset.listContainerVariants;
export const motionPreset = activePreset;

export { ACTIVE_PRESET } from './motion/config';
export { reducedMotionPreset } from './motion/reduced-motion';
