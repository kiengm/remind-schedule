import React, { useState } from 'react';
import { X, Plus, Clock } from 'lucide-react';
import { CreateReminderPayload, ReminderPriority } from '../../../types/reminder';

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateReminderPayload) => Promise<void>;
}

export const ReminderFormModal: React.FC<ReminderFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Mặc định là 1 tiếng sau
  const defaultDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);
  const [scheduledAt, setScheduledAt] = useState(defaultDate);
  const [priority, setPriority] = useState<ReminderPriority>('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Vui lòng nhập tiêu đề lời nhắc');
      return;
    }
    if (!scheduledAt) {
      setFormError('Vui lòng chọn thời gian nhắc');
      return;
    }

    try {
      setLoading(true);
      setFormError(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        scheduledAt: new Date(scheduledAt).toISOString(),
        priority,
      });
      setTitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setFormError(err?.message || 'Có lỗi xảy ra khi tạo lời nhắc');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Tạo lời nhắc mới</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tiêu đề <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Họp định kỳ tuần, nộp báo cáo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mô tả chi tiết
            </label>
            <textarea
              rows={3}
              placeholder="Nhập ghi chú thêm nếu cần..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Thời gian nhắc <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mức độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReminderPriority)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-white"
              >
                <option value="LOW">Thấp (Low)</option>
                <option value="MEDIUM">Bình thường (Medium)</option>
                <option value="HIGH">Cao (High)</option>
                <option value="URGENT">Khẩn cấp (Urgent)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Đang tạo...' : 'Tạo lời nhắc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

