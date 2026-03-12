import type { Variants, TargetAndTransition } from 'framer-motion';

export interface SpringConfig {
  readonly type: 'spring';
  readonly stiffness: number;
  readonly damping: number;
  readonly mass: number;
}

export interface CssTiming {
  readonly durationMs: number;
  readonly easing: string;
}

export interface EntranceVariant {
  readonly initial: TargetAndTransition;
  readonly animate: TargetAndTransition;
  readonly exit: TargetAndTransition;
}

export interface StaggerConfig {
  readonly staggerChildren: number;
  readonly delayChildren: number;
}

export type PresetId = 'soft-settle' | 'blur-morph' | 'snap-glide' | 'orchestrated-flow';

export interface MotionPreset {
  readonly name: string;
  readonly id: PresetId;

  readonly springSnappy: SpringConfig;
  readonly springSmooth: SpringConfig;
  readonly springLiquid: SpringConfig;

  readonly liquidEntrance: EntranceVariant;
  readonly listItemVariants: Variants;
  readonly listContainerVariants: Variants;

  readonly cssSnappy: CssTiming;
  readonly cssSmooth: CssTiming;
  readonly cssLiquid: CssTiming;

  readonly stagger: StaggerConfig;
  readonly skeletonPulseDuration: number;
}
