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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== password2) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    // Validate required fields
    if (!email || !name || !password) {
      setError("Email, name, and password are required.");
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await register(email, name, password, userType);
      if (response.success) {
        toast.success("Account created successfully!");
        onNavigate("home");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
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
      <Card className="w-full max-w-[520px] p-7 border border-gray-200 shadow-xl bg-white rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#030213] to-[#1f1b3a] flex items-center justify-center text-white font-extrabold text-sm tracking-wide shadow-sm">
            AI
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 m-0">{t.auth.createAccount}</h1>
            <p className="text-[0.98rem] text-gray-500 mt-1 mb-0">Join BookingAI to personalize your stays.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <Label htmlFor="email" className="block mb-1.5 mt-3.5 font-semibold text-[0.95rem]">
            {t.auth.email}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-[#f3f3f5] text-base transition-all focus:border-[#a5b4fc] focus:ring-[3px] focus:ring-[rgba(165,180,252,0.35)] focus:outline-none"
          />

          <Label htmlFor="name" className="block mb-1.5 mt-3.5 font-semibold text-[0.95rem]">
            {t.auth.name}
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-[#f3f3f5] text-base transition-all focus:border-[#a5b4fc] focus:ring-[3px] focus:ring-[rgba(165,180,252,0.35)] focus:outline-none"
          />

          <Label htmlFor="password" className="block mb-1.5 mt-3.5 font-semibold text-[0.95rem]">
            {t.auth.password}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-[#f3f3f5] text-base transition-all focus:border-[#a5b4fc] focus:ring-[3px] focus:ring-[rgba(165,180,252,0.35)] focus:outline-none"
          />

          <Label htmlFor="password2" className="block mb-1.5 mt-3.5 font-semibold text-[0.95rem]">
            {t.auth.confirmPassword}
          </Label>
          <Input
            id="password2"
            type="password"
            placeholder="Repeat password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-[#f3f3f5] text-base transition-all focus:border-[#a5b4fc] focus:ring-[3px] focus:ring-[rgba(165,180,252,0.35)] focus:outline-none"
          />

          <Label htmlFor="user_type" className="block mb-1.5 mt-3.5 font-semibold text-[0.95rem]">
            {t.auth.accountType}
          </Label>
          <Select
            value={userType}
            onValueChange={(value: "guest" | "host") => setUserType(value)}
          >
            <SelectTrigger
              id="user_type"
              className="w-full h-11 px-3 py-3 rounded-xl border border-gray-200 bg-[#f3f3f5] text-base transition-all focus:border-[#a5b4fc] focus:ring-[3px] focus:ring-[rgba(165,180,252,0.35)] focus:outline-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="guest">{t.auth.guest}</SelectItem>
              <SelectItem value="host">{t.auth.host}</SelectItem>
            </SelectContent>
          </Select>

          {error && (
            <p className="mt-3 text-[#b91c1c] font-semibold text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-3.5 px-3.5 bg-[#030213] text-white rounded-xl font-bold text-base hover:bg-[#11112a] transition-all active:translate-y-[1px] disabled:opacity-50"
          >
            {loading ? t.common.loading : t.auth.createAccount}
          </Button>
        </form>

        <div className="mt-4.5 text-center text-gray-500 text-[0.95rem]">
          <span>{t.auth.alreadyHaveAccount}{' '}
            <button
              onClick={() => onNavigate("login")}
              className="text-[#030213] font-bold no-underline hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              {t.auth.signInHere}
            </button>
          </span>
        </div>
      </Card>
    </div>
  );
}
