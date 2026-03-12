import * as React from 'react';
import { MotionConfig } from 'framer-motion';
import { springSmooth } from '@/lib/motion-tokens';

interface MotionProviderProps {
  children: React.ReactNode;
}

export const MotionProvider = ({ children }: MotionProviderProps) => {
  return (
    // Sets the default physics for the entire app.
    // If you forget to add a transition prop to a component, it defaults to 'springSmooth'.
    <MotionConfig transition={springSmooth} reducedMotion="user">
      {children}
    </MotionConfig>
  );
};
