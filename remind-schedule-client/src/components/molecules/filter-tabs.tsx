import { cn } from '@/lib/utils';

export interface FilterTabOption<T extends string = string> {
  key: T;
  label: string;
  count: number;
  highlight?: boolean;
}

export interface FilterTabsProps<T extends string = string> {
  options: FilterTabOption<T>[];
  activeKey: T;
  onSelect: (key: T) => void;
  className?: string;
}

export function FilterTabs<T extends string = string>({
  options,
  activeKey,
  onSelect,
  className,
}: FilterTabsProps<T>) {
  return (
    <div className={cn('flex items-center gap-1.5 p-1 bg-muted rounded-xl w-full sm:w-auto overflow-x-auto', className)}>
      {options.map((tab) => {
        const isActive = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect(tab.key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
              isActive
                ? tab.highlight
                  ? 'bg-destructive/10 text-destructive shadow-sm font-semibold'
                  : 'bg-background text-primary shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label} ({tab.count})
          </button>
        );
      })}
    </div>
  );
}
