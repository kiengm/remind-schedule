import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';
import { Reminder } from '../../../types/reminder';

interface ReminderStatsProps {
  reminders: Reminder[];
}

export const ReminderStats: React.FC<ReminderStatsProps> = ({ reminders }) => {
  const total = reminders.length;
  const pending = reminders.filter((r) => r.status === 'PENDING').length;
  const completed = reminders.filter((r) => r.status === 'COMPLETED').length;
  const overdue = reminders.filter((r) => r.isOverdue && r.status === 'PENDING').length;

  const stats = [
    { label: 'Tổng số lời nhắc', value: total, icon: ListTodo, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Đang chờ thực hiện', value: pending, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Đã hoàn thành', value: completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Quá hạn', value: overdue, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

