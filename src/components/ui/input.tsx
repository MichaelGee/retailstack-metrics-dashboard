import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { springSmooth } from '@/lib/motion-tokens';

type InputProps = React.ComponentProps<'input'> & {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  hintText?: string;
  icon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, label, error, icon, errorMessage, hintText, containerClassName, ...props },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(prevState => !prevState);
    };

    return (
      <div className={cn('flex flex-col gap-1.5 relative w-full text-start', containerClassName)}>
        {label && <Label>{label}</Label>}

        <div className="group relative">
          {icon && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-text-tertiary">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type}
            className={cn(
              'flex h-11 w-full rounded-lg bg-white px-3.5 py-2.5 text-sm shadow-xs',
              'border border-gray-300',
              'placeholder:text-text-placeholder',
              'outline-none',
              'transition-[border-color,box-shadow] duration-snappy ease-snappy',
              'focus-visible:border-brand-300 focus-visible:ring-4 focus-visible:ring-brand-100',
              'disabled:bg-gray-50 disabled:text-text-disabled disabled:cursor-not-allowed',
              error &&
                'border-error-300 focus-visible:border-error-300 focus-visible:ring-4 focus-visible:ring-error-100',
              icon && 'pl-10',
              className
            )}
            {...props}
          />

          {type === 'password' && (
            <div
              className="absolute right-3.5 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-text-tertiary hover:text-text-primary"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <Icon icon="heroicons:eye-16-solid" width={20} height={20} />
              ) : (
                <Icon icon="heroicons:eye-slash-16-solid" width={20} height={20} />
              )}
            </div>
          )}
        </div>

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
Input.displayName = 'Input';

export { Input };
