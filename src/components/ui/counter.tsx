import type React from 'react';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CounterProps {
  defaultValue?: number;
  allowNegative?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function Counter({
  defaultValue = 0,
  allowNegative = true,
  onChange,
  className,
}: CounterProps) {
  const [count, setCount] = useState(defaultValue);

  const increment = () => {
    const newValue = count + 1;
    setCount(newValue);
    onChange?.(newValue);
  };

  const decrement = () => {
    const newValue = count - 1;
    // Prevent going below 0 if negative numbers are not allowed
    if (!allowNegative && newValue < 0) return;

    setCount(newValue);
    onChange?.(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || value === '-') {
      // Allow empty input or just minus sign for typing
      return;
    }

    const numValue = Number.parseInt(value, 10);
    if (!isNaN(numValue)) {
      // Prevent negative numbers if not allowed
      if (!allowNegative && numValue < 0) return;

      setCount(numValue);
      onChange?.(numValue);
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-md border  shadow-sm overflow-hidden h-10 w-[8.5rem]',
        className
      )}
    >
      <div className="grid h-full grid-cols-3">
        {/* Minus Button Section */}
        <Button
          variant="tertiaryGray"
          onClick={decrement}
          disabled={!allowNegative && count <= 0}
          className="flex size-full items-center justify-center rounded-none border-r  p-0 transition-colors duration-snappy ease-snappy hover:bg-gray-50 disabled:opacity-50"
        >
          <Minus className="size-4 stroke-[3] text-gray-600" />
        </Button>

        <input
          type="number"
          value={count}
          onChange={handleInputChange}
          className="flex h-full appearance-none items-center justify-center border-0  border-r bg-transparent text-center text-sm font-bold text-gray-800 outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        {/* Plus Button Section */}
        <Button
          variant="tertiaryGray"
          onClick={increment}
          className="flex size-full items-center justify-center rounded-none p-0 transition-colors duration-snappy ease-snappy hover:bg-gray-50"
        >
          <Plus className="size-4 stroke-[3] text-gray-800" />
        </Button>
      </div>
    </div>
  );
}
