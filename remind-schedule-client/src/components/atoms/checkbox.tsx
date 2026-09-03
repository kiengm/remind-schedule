import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-center space-x-2">
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              'h-4 w-4 shrink-0 rounded border border-input bg-background ring-offset-background flex items-center justify-center transition-colors cursor-pointer',
              'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
              'peer-checked:bg-primary peer-checked:border-primary peer-checked:text-primary-foreground',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              className
            )}
          >
            <svg
              className="h-3 w-3 stroke-current stroke-[3] fill-none opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </label>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm text-muted-foreground select-none cursor-pointer font-normal"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
