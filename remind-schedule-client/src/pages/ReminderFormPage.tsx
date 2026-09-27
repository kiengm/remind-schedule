import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, Plus, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from '@/hooks/useRouter';
import { useFeedback } from '@/contexts/FeedbackContext';
import { reminderApi } from '@/services/api';
import {
  CreateReminderPayload,
  ReminderPriority,
  ReminderStatus,
  UpdateReminderPayload,
} from '@/types/reminder';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/card';
import { FormField } from '@/components/molecules/form-field';
import { Label } from '@/components/atoms/label';
import { Navbar } from '@/components/organisms/navbar';
import { User } from '@/types/auth';

export interface ReminderFormPageProps {
  currentUser: User | null;
  onLogout: () => void;
  onSuccess?: () => void;
}

export const ReminderFormPage: React.FC<ReminderFormPageProps> = ({
  currentUser,
  onLogout,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const router = useRouter<{ id: string }>();
  const { showSuccess, showError } = useFeedback();

  // Nhận id từ URL param /remind/edit/:id hoặc query param /remind/edit?id=...
  const reminderId = router.params.id || router.query.id;
  const isEditMode = Boolean(reminderId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const defaultDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);
  const [scheduledAt, setScheduledAt] = useState(defaultDate);
  const [priority, setPriority] = useState<ReminderPriority>('MEDIUM');
  const [status, setStatus] = useState<ReminderStatus>('PENDING');

  const [isFetching, setIsFetching] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Tải thông tin lời nhắc khi ở chế độ Edit
  useEffect(() => {
    if (!isEditMode || !reminderId) return;

    let isMounted = true;
    const loadReminder = async () => {
      try {
        setIsFetching(true);
        setFormError(null);
        const data = await reminderApi.getById(reminderId);
        if (isMounted) {
          setTitle(data.title);
          setDescription(data.description || '');
          const localDate = new Date(data.scheduledAt).toISOString().slice(0, 16);
          setScheduledAt(localDate);
          setPriority(data.priority);
          setStatus(data.status);
        }
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || t('form.notFound');
        if (isMounted) {
          setFormError(message);
          showError(message, t('feedback.errorTitle'));
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    loadReminder();

    return () => {
      isMounted = false;
    };
  }, [isEditMode, reminderId, t, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      const err = t('modal.errTitleRequired');
      setFormError(err);
      showError(err, t('feedback.errorTitle'));
      return;
    }
    if (!scheduledAt) {
      const err = t('modal.errDateRequired');
      setFormError(err);
      showError(err, t('feedback.errorTitle'));
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      if (isEditMode && reminderId) {
        const updatePayload: UpdateReminderPayload = {
          title: title.trim(),
          description: description.trim() || undefined,
          scheduledAt: new Date(scheduledAt).toISOString(),
          priority,
          status,
        };
        await reminderApi.update(reminderId, updatePayload);
        showSuccess(t('feedback.updateSuccess'));
      } else {
        const createPayload: CreateReminderPayload = {
          title: title.trim(),
          description: description.trim() || undefined,
          scheduledAt: new Date(scheduledAt).toISOString(),
          priority,
        };
        await reminderApi.create(createPayload);
        showSuccess(t('feedback.createSuccess'));
      }

      if (onSuccess) {
        onSuccess();
      }
      router.push('/');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || t('modal.defaultError');
      setFormError(message);
      showError(message, t('feedback.errorTitle'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <Navbar
        currentUser={currentUser}
        loading={false}
        onRefresh={() => {}}
        onCreateOpen={() => router.push('/remind/new')}
        onAuthOpen={() => {}}
        onLogout={onLogout}
      />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        {/* Nút quay lại danh sách */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {t('form.backToList')}
        </button>

        <Card className="shadow-md border-border">
          <CardHeader className="border-b border-border bg-muted/20 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  {isEditMode ? t('form.editTitle') : t('form.createTitle')}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-0.5">
                  {isEditMode ? t('form.editSubtitle') : t('form.createSubtitle')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isFetching ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">{t('form.loadingData')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Tiêu đề */}
                <FormField
                  label={t('modal.titleLabel')}
                  required
                  inputProps={{
                    placeholder: t('modal.titlePlaceholder'),
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    required: true,
                    autoFocus: true,
                  }}
                />

                {/* Mô tả */}
                <FormField
                  label={t('modal.descLabel')}
                  multiline
                  textareaProps={{
                    rows: 4,
                    placeholder: t('modal.descPlaceholder'),
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                  }}
                />

                {/* Thời gian & Độ ưu tiên */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label={t('modal.scheduledAtLabel')}
                    required
                    inputProps={{
                      type: 'datetime-local',
                      value: scheduledAt,
                      onChange: (e) => setScheduledAt(e.target.value),
                      required: true,
                    }}
                  />

                  <div className="space-y-1.5">
                    <Label>{t('modal.priorityLabel')}</Label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as ReminderPriority)}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
                    >
                      <option value="LOW">{t('priority.LOW')}</option>
                      <option value="MEDIUM">{t('priority.MEDIUM')}</option>
                      <option value="HIGH">{t('priority.HIGH')}</option>
                      <option value="URGENT">{t('priority.URGENT')}</option>
                    </select>
                  </div>
                </div>

                {/* Trạng thái (chỉ hiện khi Chỉnh sửa) */}
                {isEditMode && (
                  <div className="space-y-1.5">
                    <Label>{t('form.statusLabel')}</Label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ReminderStatus)}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
                    >
                      <option value="PENDING">{t('form.statusPending')}</option>
                      <option value="COMPLETED">{t('form.statusCompleted')}</option>
                    </select>
                  </div>
                )}

                {/* Nút Submit & Hủy */}
                <div className="flex items-center justify-end gap-3 pt-5 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/')}
                    disabled={isSubmitting}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 shadow-sm shadow-primary/20 min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : isEditMode ? (
                      <Save className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {isSubmitting
                      ? isEditMode
                        ? t('form.saving')
                        : t('form.creating')
                      : isEditMode
                        ? t('form.saveChanges')
                        : t('form.createBtn')}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
