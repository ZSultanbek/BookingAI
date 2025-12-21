import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { login } from '../lib/api';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        toast.success("Welcome back!");
        onNavigate("home");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid email or password";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-8"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(3, 2, 19, 0.04), transparent 30%), radial-gradient(circle at 80% 0%, rgba(3, 2, 19, 0.05), transparent 32%), #f8f9fb",
      }}
    >
      <Card className="w-full max-w-[420px] bg-white border border-[#e5e7eb] rounded-xl shadow-[0_20px_70px_rgba(3,2,19,0.08)] p-7">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#030213] grid place-items-center text-white font-extrabold text-sm tracking-wide">
            AI
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 m-0">{t.auth.welcomeBack}</h1>
            <p className="text-[0.98rem] text-gray-500 mt-1 mb-0">Sign in to continue your booking journey.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <Label htmlFor="email" className="block mb-1.5 mt-3.5 font-semibold text-[0.95rem]">
            {t.auth.email}
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-xl border border-[#e5e7eb] bg-[#f3f3f5] text-base transition-all duration-150 focus:outline-none focus:border-[#a5b4fc] focus:ring-[3px] focus:ring-[rgba(165,180,252,0.35)]"
          />

          <Label htmlFor="password" className="block mb-1.5 mt-3.5 font-semibold text-[0.95rem]">
            {t.auth.password}
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl border border-[#e5e7eb] bg-[#f3f3f5] text-base transition-all duration-150 focus:outline-none focus:border-[#a5b4fc] focus:ring-[3px] focus:ring-[rgba(165,180,252,0.35)]"
          />

          <Button
            type="submit"
            disabled={loading}
            className="mt-[18px] w-full py-[13px] px-3.5 bg-[#030213] text-white border-none rounded-xl font-bold text-base cursor-pointer transition-all duration-150 hover:bg-[#11112a] active:translate-y-[1px] disabled:opacity-50"
          >
            {loading ? t.common.loading : t.auth.signIn}
          </Button>
        </form>

        <div className="mt-4.5 text-center text-gray-500 text-[0.95rem]">
          <span>{t.auth.needAccount}{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-[#030213] font-bold no-underline hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              {t.auth.createOne}
            </button>
          </span>
        </div>
      </Card>
    </div>
  );
}
