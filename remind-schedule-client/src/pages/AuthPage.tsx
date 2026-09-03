import * as React from 'react';
import { useState } from 'react';
import { AuthHeader } from '@/components/organisms/auth-header';
import { Button } from '@/components/atoms/button';
import { Checkbox } from '@/components/atoms/checkbox';
import { MaterialIcon } from '@/components/atoms/material-icon';
import { authApi } from '@/features/auth/api/auth.api';
import { User } from '@/types/auth';

export interface AuthPageProps {
  onSuccess: (user: User, token: string) => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccess,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isLogin) {
        const res = await authApi.login({ email, password });
        onSuccess(res.user, res.accessToken);
      } else {
        const res = await authApi.register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        });
        onSuccess(res.user, res.accessToken);
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || 'Đã có lỗi xảy ra, vui lòng thử lại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-foreground">
      {/* 1. Header (sp-header theo mẫu login.html) */}
      <AuthHeader
        mode={mode}
        onToggleMode={(newMode) => {
          setMode(newMode);
          setErrorMessage(null);
        }}
      />

      {/* 2. Main Content (Căn giữa dọc và ngang theo mẫu auth-page) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[420px] mx-auto">
          {/* Card Form Wrapper */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm transition-all">
            {/* Title & Subtitle */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1.5">
                {isLogin ? 'Sign in to Remind Schedule' : 'Create an account'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? 'Enter your details below'
                  : 'Enter your information to get started'}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl animate-fadeIn">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Họ tên (chỉ xuất hiện ở Sign Up) */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium leading-none text-slate-700">
                    Họ và tên <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
                      <MaterialIcon name="person" size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none text-slate-700">
                  Email address <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
                    <MaterialIcon name="mail" size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                  />
                </div>
              </div>

              {/* Số điện thoại (chỉ xuất hiện ở Sign Up) */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium leading-none text-slate-700">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
                      <MaterialIcon name="call" size={18} />
                    </div>
                    <input
                      type="tel"
                      placeholder="0912345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none text-slate-700">
                    Password <span className="text-destructive">*</span>
                  </label>
                  {isLogin && (
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Chức năng khôi phục mật khẩu đang được phát triển');
                      }}
                      className="text-xs text-primary hover:underline font-medium transition-colors"
                    >
                      forgot password ?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
                    <MaterialIcon name="lock" size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter pwd"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                  />
                </div>
              </div>

              {/* Checkbox: Keep me logged in (theo mẫu login.html) */}
              {isLogin && (
                <div className="pt-1">
                  <Checkbox
                    id="keep-logged-in"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    label="Keep me logged in"
                  />
                </div>
              )}

              {/* Submit Button (Bo tròn btn-rounded theo mẫu login.html) */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full text-base font-semibold shadow-md shadow-primary/20 gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <span>Đang xử lý...</span>
                  ) : isLogin ? (
                    <>
                      <span>Sign In</span>
                      <MaterialIcon name="arrow_forward" size={18} />
                    </>
                  ) : (
                    <>
                      <span>Sign Up</span>
                      <MaterialIcon name="arrow_forward" size={18} />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer switcher trên mobile */}
            <div className="mt-6 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground sm:hidden">
              <span>{isLogin ? "Don't have an account? " : 'Already have an account? '}</span>
              <button
                type="button"
                onClick={() => setMode(isLogin ? 'signup' : 'login')}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
