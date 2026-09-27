import * as React from 'react';
import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FlashMessageProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const FlashMessage: React.FC<FlashMessageProps> = ({
  message,
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-5 right-5 z-50 flex items-center gap-3.5 max-w-md p-4 rounded-2xl',
        'bg-card/95 backdrop-blur-md border border-emerald-500/30 text-foreground',
        'shadow-xl shadow-emerald-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5',
      )}
    >
      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>

      <div className="flex-1 pr-1">
        <p className="text-sm font-semibold leading-snug">{message}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors shrink-0"
        title="Đóng"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
