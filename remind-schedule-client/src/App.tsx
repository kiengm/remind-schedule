import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useReminders } from '@/features/reminders/hooks/useReminders';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
import { AuthPage } from '@/pages/AuthPage';
import { ReminderListPage } from '@/pages/ReminderListPage';
import { ReminderFormPage } from '@/pages/ReminderFormPage';
import { User } from '@/types/auth';
import { authApi } from '@/features/auth/api/auth.api';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { reminders, loading, error, fetchReminders, deleteReminder, toggleComplete } =
    useReminders();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    }

    const onSessionExpired = () => {
      setCurrentUser(null);
    };

    window.addEventListener('auth:expired', onSessionExpired);
    return () => {
      window.removeEventListener('auth:expired', onSessionExpired);
    };
  }, []);

  const handleAuthSuccess = (user: User, token: string, refreshToken: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await authApi.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <FeedbackProvider>
        {!currentUser ? (
          <AuthPage onSuccess={handleAuthSuccess} />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <ReminderListPage
                  currentUser={currentUser}
                  reminders={reminders}
                  loading={loading}
                  error={error}
                  fetchReminders={fetchReminders}
                  deleteReminder={deleteReminder}
                  toggleComplete={toggleComplete}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/remind/new"
              element={
                <ReminderFormPage
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onSuccess={fetchReminders}
                />
              }
            />
            <Route
              path="/remind/edit/:id"
              element={
                <ReminderFormPage
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onSuccess={fetchReminders}
                />
              }
            />
            <Route
              path="/remind/edit"
              element={
                <ReminderFormPage
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onSuccess={fetchReminders}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </FeedbackProvider>
    </BrowserRouter>
  );
}

export default App;
