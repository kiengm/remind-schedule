import * as React from 'react';
import { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { Button } from '../atoms/button';
import { FormField } from '../molecules/form-field';
import { authApi } from '@/features/auth/api/auth.api';
import { User } from '@/types/auth';
import { cn } from '@/lib/utils';

export interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await authApi.login({ email, password });
        onSuccess(res.user, res.accessToken);
        onClose();
      } else {
        const res = await authApi.register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        });
        onSuccess(res.user, res.accessToken);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-card rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-border">
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage(null);
              }}
              className={cn(
                'pb-2 text-base font-semibold border-b-2 transition-colors flex items-center gap-1.5',
                tab === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMessage(null);
              }}
              className={cn(
                'pb-2 text-base font-semibold border-b-2 transition-colors flex items-center gap-1.5',
                tab === 'register'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <UserPlus className="w-4 h-4" />
              Đăng ký
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-xl -mt-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
              {errorMessage}
            </div>
          )}

          {tab === 'register' && (
            <FormField
              label="Họ và tên"
              required
              icon={<UserIcon className="w-4 h-4" />}
              inputProps={{
                type: 'text',
                required: true,
                placeholder: 'Nguyễn Văn A',
                value: name,
                onChange: (e) => setName(e.target.value),
              }}
            />
          )}

          <FormField
            label="Email"
            required
            icon={<Mail className="w-4 h-4" />}
            inputProps={{
              type: 'email',
              required: true,
              placeholder: 'name@example.com',
              value: email,
              onChange: (e) => setEmail(e.target.value),
            }}
          />

          {tab === 'register' && (
            <FormField
              label="Số điện thoại (phone)"
              icon={<Phone className="w-4 h-4" />}
              inputProps={{
                type: 'tel',
                placeholder: '0912345678',
                value: phone,
                onChange: (e) => setPhone(e.target.value),
              }}
            />
          )}

          <FormField
            label="Mật khẩu"
            required
            icon={<Lock className="w-4 h-4" />}
            inputProps={{
              type: 'password',
              required: true,
              minLength: 6,
              placeholder: '••••••••',
              value: password,
              onChange: (e) => setPassword(e.target.value),
            }}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 gap-2 shadow-sm shadow-primary/20"
          >
            {loading ? (
              <span>Đang xử lý...</span>
            ) : tab === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Tạo tài khoản</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

