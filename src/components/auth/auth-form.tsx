"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { BrandMark } from "@/components/site/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const NOT_CONNECTED =
  "Sign-in isn't connected yet — add your Supabase keys to .env.local to enable accounts.";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!isSupabaseConfigured) {
      setError(NOT_CONNECTED);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (isSignup) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });
      if (signUpError) setError(signUpError.message);
      else setNotice("Check your email to confirm your account, then sign in.");
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(signInError.message);
      else {
        router.push(redirect);
        router.refresh();
      }
    }

    setLoading(false);
  }

  async function handleGoogle() {
    setError("");
    if (!isSupabaseConfigured) {
      setError(NOT_CONNECTED);
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
      },
    });
  }

  async function handleForgotPassword() {
    setError("");
    setNotice("");
    if (!isSupabaseConfigured) {
      setError(NOT_CONNECTED);
      return;
    }
    if (!email) {
      setError("Enter your email above first, then tap reset.");
      return;
    }
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/dashboard`,
    });
    if (resetError) setError(resetError.message);
    else setNotice("If that email exists, a password reset link is on its way.");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14">
      <div className="glass-panel rounded-[32px] p-8">
        <div className="flex items-center gap-3">
          <BrandMark className="size-10" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted">
              {isSignup ? "Save resources and manage your hive." : "Sign in to ResourceHive."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="interactive-glow mt-7 flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border-strong)] bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white/90"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          <span className="h-px flex-1 bg-[var(--border)]" />
          or
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignup ? (
            <Input
              type="text"
              placeholder="Full name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          ) : null}
          <Input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          {error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm text-teal-800">
              {notice}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {isSignup ? "Create account" : "Sign in"}
          </Button>
        </form>

        {!isSignup ? (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="mt-4 text-sm font-medium text-teal-600 transition hover:text-honey-600"
          >
            Forgot password?
          </button>
        ) : null}

        <p className="mt-6 border-t border-[var(--border)] pt-5 text-sm text-muted">
          {isSignup ? "Already have an account? " : "New to ResourceHive? "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-teal-700 hover:text-honey-600"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs leading-6 text-muted">
        Browsing the directory never requires an account — sign in only to save
        resources and manage listings.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
