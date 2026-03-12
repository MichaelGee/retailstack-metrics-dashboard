import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, CopyToClipboard } from '@/lib/utils';
import { Copy } from 'lucide-react';

interface CopyTooltipProps {
  text: string | number;
  iconOnly?: boolean;
  className?: string;
  tooltipText?: string;
  copySuccessText?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}

const CopyTooltip: React.FC<CopyTooltipProps> = ({
  text,
  iconOnly = false,
  className = '',
  tooltipText = 'Copy to clipboard',
  copySuccessText = 'Copied!',
  iconClassName = '',
  children,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = () => {
    CopyToClipboard(text);
    setIsCopied(true);
    setIsOpen(true);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <div
          className={cn('inline-flex items-center gap-2 cursor-pointer', className)}
          onClick={handleCopy}
        >
          {!iconOnly && children ? children : null}
          {!iconOnly && !children ? <span>{text}</span> : null}
          <Copy className={cn('w-4 h-4 text-text-tertiary cursor-pointer', iconClassName)} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isCopied ? copySuccessText : tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CopyTooltip;
