import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MaterialIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number | string;
  filled?: boolean;
  className?: string;
}

export const MaterialIcon = React.forwardRef<HTMLSpanElement, MaterialIconProps>(
  ({ name, size = 20, filled = false, className, style, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('material-symbols-outlined shrink-0 select-none leading-none', className)}
        style={{
          fontSize: typeof size === 'number' ? `${size}px` : size,
          fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
          ...style,
        }}
        {...props}
      >
        {name}
      </span>
    );
  }
);

MaterialIcon.displayName = 'MaterialIcon';

export default MaterialIcon;

