import * as React from 'react';
import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../atoms/button';

export interface ErrorModalProps {
  isOpen: boolean;
  title?: string | null;
  message: string | null;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, title, message, onClose }) => {
  const { t } = useTranslation();

  // Đóng khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !message) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-destructive/30 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header với icon cảnh báo lỗi */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {title || t('feedback.errorTitle')}
              </h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-xl"
            title={t('common.cancel')}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Nội dung thông báo lỗi */}
        <div className="px-6 py-4">
          <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl max-h-60 overflow-y-auto font-medium leading-relaxed">
            {message}
          </div>
        </div>

        {/* Footer nút hành động */}
        <div className="flex items-center justify-end px-6 py-4 bg-muted/30 border-t border-border">
          <Button
            variant="default"
            onClick={onClose}
            className="w-full sm:w-auto min-w-[100px] bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-medium shadow-sm shadow-destructive/20"
          >
            {t('feedback.closeBtn')}
          </Button>
        </div>
      </div>
    </div>
  );
};
