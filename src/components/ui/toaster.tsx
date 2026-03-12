import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import SuccessToastIcon from '@/assets/images/successToast.svg';
import errorToast from '@/assets/images/errorToast.svg';
import { AnimatePresence } from 'framer-motion';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <AnimatePresence mode="popLayout">
        {toasts.map(function ({ id, title, description, action, secondaryAction, open, ...props }) {
          // CRITICAL FIX:
          // If the hook says the toast is closed, we MUST return null.
          // This removes the component from React, triggering AnimatePresence's exit animation.
          if (open === false) return null;

          const hasActions = action || secondaryAction;

          return (
            <Toast
              key={id}
              id={id}
              open={open}
              {...props}
              className="group flex flex-col items-stretch justify-start gap-0 overflow-hidden p-0"
            >
              <div
                className={`flex items-start justify-start gap-3 p-4 ${hasActions ? 'pb-2' : 'pb-4'}`}
              >
                {props.variant === 'success' && (
                  <img src={SuccessToastIcon} alt="Success" className="mt-0.5 size-8 shrink-0" />
                )}

                {props.variant === 'destructive' && (
                  <img src={errorToast} alt="Error" className="mt-0.5 size-8 shrink-0" />
                )}

                <div className="grid flex-1 gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && <ToastDescription>{description}</ToastDescription>}

                  {hasActions && (
                    <div className="flex items-center gap-2 pt-3">
                      {action}
                      {secondaryAction}
                    </div>
                  )}
                </div>

                {/* The X button automatically triggers onOpenChange(false),
                    which updates the 'open' prop above to false,
                    which triggers the return null,
                    which triggers the exit animation.
                */}
                <ToastClose className="mt-1 text-text-tertiary hover:text-text-primary" />
              </div>
            </Toast>
          );
        })}
      </AnimatePresence>
      <ToastViewport />
    </ToastProvider>
  );
}
