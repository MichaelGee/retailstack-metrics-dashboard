import type { MotionPreset, PresetId } from './types';
import { ACTIVE_PRESET } from './config';
import { softSettle } from './presets/soft-settle';
import { blurMorph } from './presets/blur-morph';
import { snapGlide } from './presets/snap-glide';
import { orchestratedFlow } from './presets/orchestrated-flow';

const presetMap: Record<PresetId, MotionPreset> = {
  'soft-settle': softSettle,
  'blur-morph': blurMorph,
  'snap-glide': snapGlide,
  'orchestrated-flow': orchestratedFlow,
};

function getActivePreset(): MotionPreset {
  const preset = presetMap[ACTIVE_PRESET];
  if (!preset) {
    throw new Error(
      `[motion] Unknown preset "${ACTIVE_PRESET}". ` + `Valid: ${Object.keys(presetMap).join(', ')}`
    );
  }
  return preset;
}

export const activePreset = getActivePreset();
