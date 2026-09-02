import * as React from 'react';
import { ListTodo, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { StatCard } from '../molecules/stat-card';
import { Reminder } from '@/types/reminder';

export interface ReminderStatsBarProps {
  reminders: Reminder[];
}

export const ReminderStatsBar: React.FC<ReminderStatsBarProps> = ({ reminders }) => {
  const total = reminders.length;
  const pending = reminders.filter((r) => r.status === 'PENDING').length;
  const completed = reminders.filter((r) => r.status === 'COMPLETED').length;
  const overdue = reminders.filter((r) => r.isOverdue && r.status === 'PENDING').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Tổng số lời nhắc"
        value={total}
        icon={ListTodo}
        iconColor="text-primary"
        iconBg="bg-primary/10"
      />
      <StatCard
        label="Đang chờ thực hiện"
        value={pending}
        icon={Clock}
        iconColor="text-blue-600"
        iconBg="bg-blue-500/10"
      />
      <StatCard
        label="Đã hoàn thành"
        value={completed}
        icon={CheckCircle2}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-500/10"
      />
      <StatCard
        label="Quá hạn"
        value={overdue}
        icon={AlertCircle}
        iconColor="text-destructive"
        iconBg="bg-destructive/10"
      />
    </div>
  );
};

