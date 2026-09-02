import * as React from 'react';
import { useState } from 'react';
import { X, Clock, Plus } from 'lucide-react';
import { Button } from '../atoms/button';
import { FormField } from '../molecules/form-field';
import { Label } from '../atoms/label';
import { CreateReminderPayload, ReminderPriority } from '@/types/reminder';

export interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateReminderPayload) => Promise<void>;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
      <div className="bg-card rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Tạo lời nhắc mới</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
              {formError}
            </div>
          )}

          <FormField
            label="Tiêu đề"
            required
            inputProps={{
              placeholder: 'VD: Họp định kỳ tuần, nộp báo cáo...',
              value: title,
              onChange: (e) => setTitle(e.target.value),
              required: true,
            }}
          />

          <FormField
            label="Mô tả chi tiết"
            multiline
            textareaProps={{
              rows: 3,
              placeholder: 'Nhập ghi chú thêm nếu cần...',
              value: description,
              onChange: (e) => setDescription(e.target.value),
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Thời gian nhắc"
              required
              inputProps={{
                type: 'datetime-local',
                value: scheduledAt,
                onChange: (e) => setScheduledAt(e.target.value),
                required: true,
              }}
            />

            <div className="space-y-1.5">
              <Label>Mức độ ưu tiên</Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReminderPriority)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
              >
                <option value="LOW">Thấp (Low)</option>
                <option value="MEDIUM">Bình thường (Medium)</option>
                <option value="HIGH">Cao (High)</option>
                <option value="URGENT">Khẩn cấp (Urgent)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="gap-1.5 shadow-sm shadow-primary/20">
              <Plus className="w-4 h-4" />
              {loading ? 'Đang tạo...' : 'Tạo lời nhắc'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

