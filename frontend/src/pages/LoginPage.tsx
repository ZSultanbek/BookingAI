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

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await login(email, password);
        if (response.success) {
          toast.success(t.auth.loginSuccess);
          onNavigate('home');
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : t.auth.invalidCredentials;
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background:
            'linear-gradient(120deg, #1f3ccf 0%, #5b2fc9 50%, #7a1fd1 100%)',
        }}
      >
        <Card className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]" style={{maxWidth: '35%',}}>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f6bff] to-[#7c3aed] text-white font-bold grid place-items-center">
              ✦
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {t.auth.welcomeBack}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t.auth.signIn} to StayAI
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="mb-1.5 block text-gray-700">
                {t.auth.email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  h-11 rounded-lg
                  bg-[#f3f4f6]
                  border border-[#e5e7eb]
                  focus:ring-2 focus:ring-[#6366f1]/40
                "
              />
            </div>
            <br />
            <div>
              <Label htmlFor="password" className="mb-1.5 block text-gray-700">
                {t.auth.password}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  h-11 rounded-lg
                  bg-[#f3f4f6]
                  border border-[#e5e7eb]
                  focus:ring-2 focus:ring-[#6366f1]/40
                "
              />
            </div>
            <br />
            <Button
              type="submit"
              disabled={loading}
              className="
                relative w-full h-12 rounded-xl
                font-semibold
                shadow-lg
                transition-all duration-200
                hover:brightness-110
                active:scale-[0.98]
                disabled:opacity-60
              "
              style={{ color: 'white' }}>
              {loading ? t.common.loading : t.auth.signIn}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {t.auth.needAccount}{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-semibold text-gray-900 hover:underline"
            >
              {t.auth.createOne}
            </button>
          </div>
        </Card>
      </div>
    );
  }
