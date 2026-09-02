import * as React from 'react';
import { Label } from '../atoms/label';
import { Input, InputProps } from '../atoms/input';
import { Textarea, TextareaProps } from '../atoms/textarea';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string | null;
  className?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  inputProps?: InputProps;
  textareaProps?: TextareaProps;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  className,
  icon,
  multiline,
  inputProps,
  textareaProps,
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label required={required}>{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        {multiline ? (
          <Textarea
            className={cn(icon && 'pl-10', error && 'border-destructive focus-visible:ring-destructive')}
            {...textareaProps}
          />
        ) : (
          <Input
            className={cn(icon && 'pl-10', error && 'border-destructive focus-visible:ring-destructive')}
            {...inputProps}
          />
        )}
      </div>
      {error && <p className="text-xs font-medium text-destructive mt-1">{error}</p>}
    </div>
  );
};

