import React from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { Reminder, ReminderPriority } from '../../../types/reminder';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<ReminderPriority, { bg: string; text: string; label: string }> = {
  LOW: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-700', label: 'Thấp' },
  MEDIUM: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-700', label: 'Bình thường' },
  HIGH: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-700', label: 'Cao' },
  URGENT: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'text-rose-700', label: 'Khẩn cấp' },
};

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onToggle, onDelete }) => {
  const isCompleted = reminder.status === 'COMPLETED';
  const scheduledDate = new Date(reminder.scheduledAt);
  const formattedDate = scheduledDate.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = scheduledDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const priorityMeta = priorityColors[reminder.priority] || priorityColors.MEDIUM;

  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md bg-white ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/70 opacity-75'
          : reminder.isOverdue
          ? 'border-rose-300 ring-1 ring-rose-100'
          : 'border-slate-200 hover:border-indigo-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Toggle Complete Checkbox */}
        <button
          onClick={() => onToggle(reminder)}
          className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
          title={isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="w-6 h-6 hover:text-indigo-500" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${priorityMeta.bg}`}
            >
              {priorityMeta.label}
            </span>

            {reminder.isOverdue && !isCompleted && (
              <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Quá hạn
              </span>
            )}
          </div>

          <h3
            className={`text-base font-semibold text-slate-800 ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}
          >
            {reminder.title}
          </h3>

          {reminder.description && (
            <p
              className={`text-sm mt-1 line-clamp-2 ${
                isCompleted ? 'text-slate-400 line-through' : 'text-slate-600'
              }`}
            >
              {reminder.description}
            </p>
          )}

          {/* Time metadata */}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Delete Action */}
        <button
          onClick={() => onDelete(reminder.id)}
          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          title="Xóa lịch nhắc"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

