import { useCallback, useEffect, useState } from 'react';
import { CreateReminderPayload, Reminder, UpdateReminderPayload } from '../../../types/reminder';
import { reminderApi } from '../../../services/api';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reminderApi.getAll();
      setReminders(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Không thể tải danh sách lời nhắc');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const createReminder = async (payload: CreateReminderPayload) => {
    const newItem = await reminderApi.create(payload);
    setReminders((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateReminder = async (id: string, payload: UpdateReminderPayload) => {
    const updated = await reminderApi.update(id, payload);
    setReminders((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteReminder = async (id: string) => {
    await reminderApi.delete(id);
    setReminders((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleComplete = async (reminder: Reminder) => {
    const newStatus = reminder.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await updateReminder(reminder.id, { status: newStatus });
  };

  return {
    reminders,
    loading,
    error,
    fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleComplete,
  };
}

