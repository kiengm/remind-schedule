import * as React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@/hooks/useRouter';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Navbar, ReminderItem, ReminderStatsBar } from '@/components/organisms';
import { SearchBox, FilterTabs, FilterTabOption } from '@/components/molecules';
import { Button, Card, CardContent, MaterialIcon } from '@/components/atoms';
import { Reminder, ReminderStatus } from '@/types/reminder';
import { User } from '@/types/auth';
import { reminderApi } from '@/services/api';

export interface ReminderListPageProps {
  currentUser: User | null;
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  fetchReminders: () => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleComplete: (reminder: Reminder) => Promise<void>;
  onLogout: () => void;
}

export const ReminderListPage: React.FC<ReminderListPageProps> = ({
  currentUser,
  reminders,
  loading,
  error,
  fetchReminders,
  deleteReminder,
  toggleComplete,
  onLogout,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { showSuccess, showError } = useFeedback();
  const [filterStatus, setFilterStatus] = useState<'ALL' | ReminderStatus | 'OVERDUE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
      await reminderApi.downloadTemplate();
      showSuccess(t('excel.downloadSuccess'));
    } catch (err: any) {
      showError(
        err?.response?.data?.message || err?.message || t('excel.downloadError'),
        t('feedback.errorTitle'),
      );
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReminder(id);
      showSuccess(t('feedback.deleteSuccess'));
    } catch (err: any) {
      showError(
        err?.response?.data?.message || err?.message || 'Không thể xóa lời nhắc',
        t('feedback.errorTitle'),
      );
    }
  };

  const handleToggle = async (reminder: Reminder) => {
    try {
      const willComplete = reminder.status !== 'COMPLETED';
      await toggleComplete(reminder);
      showSuccess(willComplete ? t('feedback.toggleCompleted') : t('feedback.togglePending'));
    } catch (err: any) {
      showError(
        err?.response?.data?.message || err?.message || 'Không thể cập nhật trạng thái',
        t('feedback.errorTitle'),
      );
    }
  };

  // Cấu hình các tab lọc trạng thái
  const filterOptions: FilterTabOption<'ALL' | ReminderStatus | 'OVERDUE'>[] = useMemo(
    () => [
      { key: 'ALL', label: t('filters.all'), count: reminders.length },
      {
        key: 'PENDING',
        label: t('filters.pending'),
        count: reminders.filter((r) => r.status === 'PENDING').length,
      },
      {
        key: 'COMPLETED',
        label: t('filters.completed'),
        count: reminders.filter((r) => r.status === 'COMPLETED').length,
      },
      {
        key: 'OVERDUE',
        label: t('filters.overdue'),
        count: reminders.filter((r) => r.isOverdue && r.status === 'PENDING').length,
        highlight: true,
      },
    ],
    [reminders, t],
  );

  const filteredReminders = useMemo(() => {
    return reminders.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === 'ALL') return true;
      if (filterStatus === 'OVERDUE') return item.isOverdue && item.status === 'PENDING';
      return item.status === filterStatus;
    });
  }, [reminders, filterStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Organism: Navbar */}
      <Navbar
        currentUser={currentUser}
        loading={loading}
        onRefresh={fetchReminders}
        onCreateOpen={() => router.push('/remind/new')}
        onAuthOpen={() => {}}
        onLogout={onLogout}
      />

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => fetchReminders()}
              className="underline font-semibold hover:opacity-80 ml-4"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Organism: Stats Bar */}
        <ReminderStatsBar reminders={reminders} />

        {/* Toolbar: Molecules FilterTabs + SearchBox + Excel Actions */}
        <Card className="p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <FilterTabs options={filterOptions} activeKey={filterStatus} onSelect={setFilterStatus} />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('filters.searchPlaceholder')}
            />
            <Button
              variant="outline"
              size="default"
              onClick={handleDownloadTemplate}
              disabled={downloadingTemplate}
              className="rounded-xl gap-2 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shrink-0 font-medium"
              title={t('excel.downloadTemplate')}
            >
              <MaterialIcon
                name={downloadingTemplate ? 'progress_activity' : 'description'}
                size={18}
                className={
                  downloadingTemplate ? 'animate-spin' : 'text-emerald-600 dark:text-emerald-400'
                }
              />
              <span className="hidden sm:inline">
                {downloadingTemplate ? t('excel.downloading') : t('excel.downloadTemplate')}
              </span>
            </Button>
          </div>
        </Card>

        {/* Reminder Items Grid */}
        {loading && reminders.length === 0 ? (
          <div className="text-center py-16">
            <MaterialIcon
              name="progress_activity"
              size={32}
              className="text-primary animate-spin mx-auto mb-3"
            />
            <p className="text-muted-foreground text-sm">{t('reminders.loadingList')}</p>
          </div>
        ) : filteredReminders.length === 0 ? (
          <Card className="text-center py-16 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <MaterialIcon
                name="event_busy"
                size={48}
                className="text-muted-foreground/40 mx-auto mb-3"
              />
              <h3 className="text-base font-semibold text-foreground">
                {t('reminders.emptyTitle')}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-4">
                {t('reminders.emptyDesc')}
              </p>
              <Button
                onClick={() => router.push('/remind/new')}
                className="gap-1.5 shadow-sm shadow-primary/20"
              >
                <MaterialIcon name="add" size={18} />
                {t('reminders.createFirst')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={(item) => router.push(`/remind/edit/${item.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
