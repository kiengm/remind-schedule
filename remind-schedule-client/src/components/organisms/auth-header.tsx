import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../atoms/button';
import { MaterialIcon } from '../atoms/material-icon';
import { LanguageSwitcher } from '../molecules/language-switcher';
import { cn } from '@/lib/utils';

export interface AuthHeaderProps {
  mode?: 'login' | 'signup';
  onToggleMode?: (mode: 'login' | 'signup') => void;
  className?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  mode = 'login',
  onToggleMode,
  className,
}) => {
  const { t } = useTranslation();
  const isLogin = mode === 'login';

  return (
    <header
      className={cn(
        'w-full px-6 py-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-20 transition-all',
        className
      )}
    >
      {/* Brand Logo & Name (Bên trái) */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
            <MaterialIcon name="calendar_month" size={22} filled />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            {t('common.appName')}
          </span>
        </a>
      </div>

      {/* Switch Mode Prompt & Button + Language Switcher (Bên phải) */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        <span className="text-sm text-muted-foreground hidden sm:inline-block">
          {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onToggleMode?.(isLogin ? 'signup' : 'login')}
          className="rounded-full px-5 font-medium border-primary/40 text-primary hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
        >
          {isLogin ? t('auth.signUpBtn') : t('auth.signInBtn')}
        </Button>
      </div>
    </header>
  );
};


