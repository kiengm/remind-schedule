import { useState, useMemo, useEffect } from 'react';
import { useReminders } from '@/features/reminders/hooks/useReminders';
import { Navbar, ReminderItem, ReminderStatsBar, ReminderModal } from '@/components/organisms';
import { SearchBox, FilterTabs, FilterTabOption } from '@/components/molecules';
import { Button, Card, CardContent, MaterialIcon } from '@/components/atoms';
import { AuthPage } from '@/pages/AuthPage';
import { ReminderStatus } from '@/types/reminder';
import { User } from '@/types/auth';

export function App() {
  const {
    reminders,
    loading,
    error,
    fetchReminders,
    createReminder,
    deleteReminder,
    toggleComplete,
  } = useReminders();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | ReminderStatus | 'OVERDUE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Tải thông tin người dùng từ localStorage khi tải trang
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleAuthSuccess = (user: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Cấu hình các tab lọc trạng thái
  const filterOptions: FilterTabOption<'ALL' | ReminderStatus | 'OVERDUE'>[] = useMemo(() => [
    { key: 'ALL', label: 'Tất cả', count: reminders.length },
    { key: 'PENDING', label: 'Đang chờ', count: reminders.filter((r) => r.status === 'PENDING').length },
    { key: 'COMPLETED', label: 'Hoàn thành', count: reminders.filter((r) => r.status === 'COMPLETED').length },
    { key: 'OVERDUE', label: 'Quá hạn', count: reminders.filter((r) => r.isOverdue && r.status === 'PENDING').length, highlight: true },
  ], [reminders]);

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

  // Nếu người dùng chưa đăng nhập -> Hiển thị trực tiếp toàn bộ trang AuthPage theo mẫu login.html
  if (!currentUser) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Organism: Navbar */}
      <Navbar
        currentUser={currentUser}
        loading={loading}
        onRefresh={fetchReminders}
        onCreateOpen={() => setIsModalOpen(true)}
        onAuthOpen={() => {}}
        onLogout={handleLogout}
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
              Thử lại
            </button>
          </div>
        )}

        {/* Organism: Stats Bar */}
        <ReminderStatsBar reminders={reminders} />

        {/* Toolbar: Molecules FilterTabs + SearchBox */}
        <Card className="p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <FilterTabs
            options={filterOptions}
            activeKey={filterStatus}
            onSelect={setFilterStatus}
          />
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm lời nhắc..."
          />
        </Card>

        {/* Reminder Items Grid */}
        {loading && reminders.length === 0 ? (
          <div className="text-center py-16">
            <MaterialIcon name="progress_activity" size={32} className="text-primary animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Đang tải dữ liệu lịch nhắc...</p>
          </div>
        ) : filteredReminders.length === 0 ? (
          <Card className="text-center py-16 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <MaterialIcon name="event_busy" size={48} className="text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground">Chưa có lời nhắc nào</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1 mb-4">
                Không tìm thấy lời nhắc phù hợp với bộ lọc hiện tại. Hãy tạo lời nhắc mới để bắt đầu.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="gap-1.5 shadow-sm shadow-primary/20"
              >
                <MaterialIcon name="add" size={18} />
                Tạo lời nhắc đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggle={toggleComplete}
                onDelete={deleteReminder}
              />
            ))}
          </div>
        )}
      </main>

      {/* Organism: Modal Tạo lời nhắc */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (payload) => {
          await createReminder(payload);
        }}
      />
    </div>
  );
}

export default App;
