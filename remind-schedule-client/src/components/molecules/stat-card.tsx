import * as React from 'react';
import { Card } from '../atoms/card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  className,
}) => {
  return (
    <Card className={cn('p-4 flex items-center gap-4 transition-all hover:shadow-md', className)}>
      <div className={cn('p-3 rounded-xl shrink-0', iconBg, iconColor)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">{value}</p>
      </div>
    </Card>
  );
};

