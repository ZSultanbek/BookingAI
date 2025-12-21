import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { register } from '../lib/api';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

interface RegisterPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [userType, setUserType] = useState<'guest' | 'host'>('guest');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name || !password || !password2) {
      toast.error(t.auth.fillRequired);
      return;
    }

    if (password !== password2) {
      toast.error(t.auth.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const response = await register(email, name, password, userType);
      if (response.success) {
        toast.success(t.auth.registrationSuccess);
        onNavigate('home');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.auth.register;
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
              {t.auth.createAccount}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Join BookingAI to personalize your stays.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="mb-1.5 block text-gray-700">
              {t.auth.name}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 rounded-lg bg-[#f3f4f6] border border-[#e5e7eb] focus:ring-2 focus:ring-[#6366f1]/40"
            />
          </div>
          <br />
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
              className="h-11 rounded-lg bg-[#f3f4f6] border border-[#e5e7eb] focus:ring-2 focus:ring-[#6366f1]/40"
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
              className="h-11 rounded-lg bg-[#f3f4f6] border border-[#e5e7eb] focus:ring-2 focus:ring-[#6366f1]/40"
            />
          </div>
          <br />

          <div>
            <Label htmlFor="password2" className="mb-1.5 block text-gray-700">
              {t.auth.confirmPassword}
            </Label>
            <Input
              id="password2"
              type="password"
              placeholder="••••••••"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className="h-11 rounded-lg bg-[#f3f4f6] border border-[#e5e7eb] focus:ring-2 focus:ring-[#6366f1]/40"
            />
          </div>
          <br />

          <div>
            <Label htmlFor="user_type" className="mb-1.5 block text-gray-700">
              {t.auth.accountType}
            </Label>
            <Select
              value={userType}
              onValueChange={(value: "guest" | "host") => setUserType(value)}
            >
              <SelectTrigger
                id="user_type"
                className="h-11 rounded-lg bg-[#f3f4f6] border border-[#e5e7eb] focus:ring-2 focus:ring-[#6366f1]/40"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guest">{t.auth.guest}</SelectItem>
                <SelectItem value="host">{t.auth.host}</SelectItem>
              </SelectContent>
            </Select>
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
            style={{ color: 'white' }}
          >
            {loading ? t.common.loading : t.auth.createAccount}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {t.auth.alreadyHaveAccount}{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-semibold text-gray-900 hover:underline"
          >
            {t.auth.signInHere}
          </button>
        </div>
      </Card>
    </div>
  );
}
