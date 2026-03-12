import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { motion, AnimatePresence } from 'framer-motion';
import { springSmooth } from '@/lib/motion-tokens';

type TextareaProps = React.ComponentProps<'textarea'> & {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  hintText?: string;
  containerClassName?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, errorMessage, hintText, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('relative flex flex-col gap-1.5 text-start', containerClassName)}>
        {label && <Label>{label}</Label>}

        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[128px] w-full rounded-lg bg-white px-3.5 py-2.5 text-md shadow-xs',
            'border border-gray-300',
            'placeholder:text-text-placeholder',
            'outline-none',
            'transition-[border-color,box-shadow] duration-snappy ease-snappy',
            'focus-visible:border-brand-300 focus-visible:ring-4 focus-visible:ring-brand-100',
            'disabled:bg-gray-50 disabled:text-text-disabled disabled:cursor-not-allowed',
            error &&
              'border-error-300 focus-visible:border-error-300 focus-visible:ring-4 focus-visible:ring-error-100',
            className
          )}
          {...props}
        />

        <AnimatePresence mode="wait">
          {error && errorMessage ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={springSmooth}
              className="overflow-hidden text-sm text-error-500"
            >
              {errorMessage}
            </motion.p>
          ) : hintText ? (
            <p className="text-sm text-gray-600">{hintText}</p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
