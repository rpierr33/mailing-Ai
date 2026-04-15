"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Send, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. For demo, use any email with password: demo");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: "demo@mailflow.ai",
      password: "demo",
      redirect: false,
    });
    if (result?.error) {
      setError("Demo login failed. Please try again.");
      setLoading(false);
      return;
    }
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">MailFlow</span>
            <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full font-semibold">
              AI
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 gradient-bg text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-foreground text-sm font-medium hover:bg-secondary transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            Try Demo (No Account Needed)
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            AI writes your emails. You hit send.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Generate complete email campaigns from a single sentence. Subject lines,
            preview text, body copy — all optimized for engagement.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["AR", "PS", "JC", "MK"].map((initials) => (
                <div
                  key={initials}
                  className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-bold"
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/70">
              Joined by 2,000+ marketers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
