import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '../atoms/button';
import { cn } from '@/lib/utils';
import { setAppLanguage, SupportedLanguage } from '@/i18n';

export interface LanguageSwitcherProps {
  className?: string;
  variant?: 'outline' | 'ghost' | 'default';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  variant = 'outline',
  size = 'sm',
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language?.startsWith('en') ? 'en' : 'vi') as SupportedLanguage;

  const toggleLanguage = () => {
    const nextLang: SupportedLanguage = currentLang === 'vi' ? 'en' : 'vi';
    setAppLanguage(nextLang);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={toggleLanguage}
      className={cn(
        'rounded-xl px-2.5 py-1 text-xs font-semibold gap-1.5 transition-all duration-200 border-border/80 hover:bg-accent hover:text-accent-foreground select-none',
        className
      )}
      title={currentLang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
    >
      <Globe className="w-3.5 h-3.5 text-primary" />
      <span className="flex items-center gap-1">
        {currentLang === 'vi' ? (
          <>
            <span role="img" aria-label="Vietnam" className="text-sm leading-none">🇻🇳</span>
            <span>VI</span>
          </>
        ) : (
          <>
            <span role="img" aria-label="United Kingdom" className="text-sm leading-none">🇬🇧</span>
            <span>EN</span>
          </>
        )}
      </span>
    </Button>
  );
};

