"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, Lock, LogIn, Mail, User } from "lucide-react";

import { BrandMark } from "@/components/site/brand-mark";
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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12">
      {/* Airy, on-brand backdrop: warm/teal pooling, faint honeycomb, soft arcs. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(244,190,78,0.20),transparent_46%),radial-gradient(circle_at_12%_88%,rgba(14,124,134,0.16),transparent_42%),radial-gradient(circle_at_88%_82%,rgba(224,133,12,0.12),transparent_42%)]" />
        <div className="honeycomb-texture-light absolute inset-0 opacity-50" />
        <div className="absolute left-1/2 top-1/2 size-[125vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
        <div className="absolute left-1/2 top-1/2 size-[92vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35" />
        <div className="absolute left-1/2 top-1/2 size-[62vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
      </div>

      {/* Brand mark, top-left. */}
      <Link href="/" className="logo-hover absolute left-6 top-6 flex items-center gap-2.5">
        <BrandMark className="size-9" priority />
        <span className="font-display text-lg font-bold tracking-tight text-ink">ResourceHive</span>
      </Link>

      {/* Inline maxWidth: the global `div { max-width: 100% }` rule in globals.css
          (unlayered) overrides Tailwind's max-w-* utility, so cap it inline. */}
      <div
        style={{ maxWidth: "26rem" }}
        className="glass-panel w-full rounded-[34px] p-8 shadow-e4 sm:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-white text-teal-700 shadow-e2 ring-1 ring-[var(--border)]">
            <LogIn className="size-6" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-ink">
            {isSignup ? "Create your account" : "Sign in with email"}
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
            {isSignup
              ? "Join ResourceHive to save resources and manage your own hive."
              : "Welcome back. Sign in to reach your dashboard and saved resources."}
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="mt-8 space-y-3">
          {isSignup ? (
            <Field icon={<User className="size-4" />}>
              <input
                type="text"
                placeholder="Full name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="h-12 w-full bg-transparent pl-11 pr-4 text-sm text-ink outline-none placeholder:text-muted"
              />
            </Field>
          ) : null}

          <Field icon={<Mail className="size-4" />}>
            <input
              type="email"
              placeholder="Email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-12 w-full bg-transparent pl-11 pr-4 text-sm text-ink outline-none placeholder:text-muted"
            />
          </Field>

          <Field icon={<Lock className="size-4" />}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="off"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              className="h-12 w-full bg-transparent pl-11 pr-11 text-sm text-ink outline-none placeholder:text-muted"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </Field>

          {!isSignup ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-teal-700 transition hover:text-honey-600"
              >
                Forgot password?
              </button>
            </div>
          ) : null}

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

          <button
            type="submit"
            disabled={loading}
            className="interactive-glow mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--teal-800),var(--ink))] text-sm font-semibold text-white shadow-e3 transition hover:-translate-y-0.5 hover:shadow-[var(--glow-teal)] disabled:opacity-60"
          >
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {isSignup ? "Get started" : "Sign in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          <span className="h-px flex-1 bg-[var(--border)]" />
          {isSignup ? "Or sign up with" : "Or sign in with"}
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="interactive-glow flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border-strong)] bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white/90"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-muted">
          {isSignup ? "Already have an account? " : "New to ResourceHive? "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-teal-700 hover:text-honey-600"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}

// Input shell with a leading icon — keeps each field visually consistent.
function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-white/70 transition focus-within:border-teal-300 focus-within:ring-4 focus-within:ring-teal-200/50">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
        {icon}
      </span>
      {children}
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
