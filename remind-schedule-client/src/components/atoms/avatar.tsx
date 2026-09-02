import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
};

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className, ...props }) => {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary font-bold overflow-hidden select-none border border-primary/20',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};

