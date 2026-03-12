import { Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  content: string;
  className?: string;
  iconClassName?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function InfoTooltip({ content, className, iconClassName, side = 'top' }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn('inline-flex cursor-help items-center', className)}
          onClick={e => e.stopPropagation()}
        >
          <Info
            className={cn(
              'size-3.5 text-text-quaternary transition-colors hover:text-text-tertiary',
              iconClassName
            )}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs text-left">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
