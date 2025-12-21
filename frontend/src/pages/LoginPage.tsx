import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { login } from "../lib/api";
import { toast } from "sonner";

interface LoginPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            <h1 className="m-0 text-xl font-bold text-[#0f172a]">
              Welcome back
            </h1>
            <p className="my-1 mb-5 text-[#6b7280] text-[0.98rem]">
              Sign in to continue your booking journey.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Label
            htmlFor="email"
            className="block my-3.5 mb-1.5 font-semibold text-[0.95rem]"
          >
            Email
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

          <Label
            htmlFor="password"
            className="block my-3.5 mb-1.5 font-semibold text-[0.95rem]"
          >
            Password
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
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {error && <p className="mt-3 text-[#b91c1c] font-semibold">{error}</p>}

        <div className="mt-[18px] text-center text-[#6b7280] text-[0.95rem]">
          <span>
            Need an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("register");
              }}
              className="text-[#030213] no-underline font-bold hover:underline"
            >
              Create one
            </a>
          </span>
        </div>
      </Card>
    </div>
  );
}
