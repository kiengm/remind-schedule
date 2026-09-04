import * as React from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../atoms/card';
import { Badge } from '../atoms/badge';
import { Button } from '../atoms/button';
import { Reminder, ReminderPriority } from '@/types/reminder';
import { cn } from '@/lib/utils';

export interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const priorityBadgeVariantMap: Record<ReminderPriority, 'success' | 'info' | 'warning' | 'urgent'> = {
  LOW: 'success',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'urgent',
};

export const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onToggle, onDelete }) => {
  const { t, i18n } = useTranslation();
  const isCompleted = reminder.status === 'COMPLETED';
  const scheduledDate = new Date(reminder.scheduledAt);
  const locale = i18n.language?.startsWith('en') ? 'en-US' : 'vi-VN';

  const formattedDate = scheduledDate.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = scheduledDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const badgeVariant = priorityBadgeVariantMap[reminder.priority] || 'info';
  const priorityLabel = t(`priority.${reminder.priority}`);

  return (
    <Card
      className={cn(
        'relative p-5 transition-all duration-200 hover:shadow-md bg-card',
        isCompleted
          ? 'opacity-70 bg-muted/40'
          : reminder.isOverdue
          ? 'border-destructive/40 ring-1 ring-destructive/20'
          : 'hover:border-primary/40'
      )}
    >
      <div className="flex items-start justify-between gap-3.5">
        {/* Checkbox Toggle */}
        <button
          type="button"
          onClick={() => onToggle(reminder)}
          className="mt-0.5 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
          title={isCompleted ? t('reminders.markPending') : t('reminders.markCompleted')}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="w-6 h-6 hover:text-primary" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Badge variant={badgeVariant}>
              {priorityLabel}
            </Badge>

            {reminder.isOverdue && !isCompleted && (
              <Badge variant="urgent" className="flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> {t('reminders.overdueBadge')}
              </Badge>
            )}
          </div>

          <h3
            className={cn(
              'text-base font-semibold text-foreground tracking-tight',
              isCompleted && 'line-through text-muted-foreground'
            )}
          >
            {reminder.title}
          </h3>

          {reminder.description && (
            <p
              className={cn(
                'text-sm mt-1 line-clamp-2 text-muted-foreground',
                isCompleted && 'line-through'
              )}
            >
              {reminder.description}
            </p>
          )}

          {/* Time info */}
          <div className="flex items-center gap-4 mt-3.5 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(reminder.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
          title={t('reminders.deleteTitle')}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};


