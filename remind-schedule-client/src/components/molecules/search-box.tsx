import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../atoms/input';
import { cn } from '@/lib/utils';

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className,
}) => {
  return (
    <div className={cn('relative w-full sm:w-64', className)}>
      <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9.5 h-9 text-xs rounded-xl"
      />
    </div>
  );
};

