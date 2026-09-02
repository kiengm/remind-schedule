import * as React from 'react';
import { CalendarDays, Plus, RefreshCw, LogIn } from 'lucide-react';
import { Button } from '../atoms/button';
import { UserNav } from '../molecules/user-nav';
import { User } from '@/types/auth';

export interface NavbarProps {
  currentUser: User | null;
  loading?: boolean;
  onRefresh: () => void;
  onCreateOpen: () => void;
  onAuthOpen: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  loading,
  onRefresh,
  onCreateOpen,
  onAuthOpen,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Remind Schedule
            </h1>
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Atomic Design + Shadcn UI Base
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-xl"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onCreateOpen}
            className="inline-flex items-center gap-1.5 rounded-xl shadow-sm shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo lời nhắc</span>
          </Button>

          {currentUser ? (
            <UserNav user={currentUser} onLogout={onLogout} />
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onAuthOpen}
              className="inline-flex items-center gap-1.5 rounded-xl"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

