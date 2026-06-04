"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { BrandMark } from "@/components/site/brand-mark";
import { LanguageToggle } from "@/components/site/language-toggle";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { messages } = useLocale();
  const { user, logout } = useAuth();
  const mounted = useMounted();
  const navLinks = [
    { href: "/", label: messages.nav.home },
    { href: "/about", label: messages.nav.about },
    { href: "/resources", label: messages.nav.resources },
    { href: "/map", label: messages.nav.map },
    { href: "/faq", label: messages.nav.faq },
    { href: "/contact", label: messages.nav.contact },
    { href: "/dashboard", label: messages.nav.dashboard },
    { href: "/admin", label: messages.nav.admin },
  ];

  return (
    <div className="relative min-h-screen overflow-x-clip bg-cream text-ink">
      <div className="honeycomb-texture-light pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(14,124,134,0.12),_transparent_52%)]" />
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark className="size-10 sm:size-11" priority />
            <div>
              <div className="font-display text-lg font-bold tracking-tight text-ink">{messages.shell.brandName}</div>
              <div className="text-xs text-muted">{messages.shell.brandSubtitle}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted transition hover:text-teal-600">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {mounted ? (
              <>
                <LanguageToggle />
                <ThemeToggle />
                {user ? (
                  <Button variant="secondary" size="sm" onClick={() => logout()}>
                    {messages.shell.signOut}
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button size="sm">{messages.shell.demoLogin}</Button>
                  </Link>
                )}
              </>
            ) : null}
          </div>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/60 ring-1 ring-white/50 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={messages.shell.menuToggleAria}
          >
            <Menu className="size-5" />
          </button>
        </div>

        <div className={cn("border-t border-white/40 px-4 py-4 lg:hidden", open ? "block" : "hidden")}>
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-2 text-sm font-medium text-ink-soft hover:bg-white/55 hover:text-teal-600">
                {link.label}
              </Link>
            ))}
            {mounted ? (
              <>
                <div className="mt-3 flex gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
                {user ? (
                  <Button size="sm" onClick={() => logout()}>
                    {messages.shell.signOut}
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button size="sm" className="w-full">
                      {messages.shell.demoLogin}
                    </Button>
                  </Link>
                )}
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="relative">{children}</main>

      <footer className="relative border-t border-[var(--border)] bg-white/60">
        <div className="honeycomb-texture-light pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 text-sm text-muted sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <BrandMark className="size-11" />
                <div>
                  <div className="font-display text-xl font-semibold text-ink">{messages.shell.brandName}</div>
                  <div className="text-xs text-muted">{messages.shell.brandSubtitle}</div>
                </div>
              </Link>
              <p className="mt-4 max-w-md leading-7">{messages.shell.footerDescription}</p>
            </div>
            <div>
              <h4 className="font-display text-base font-semibold text-ink">{messages.shell.platform}</h4>
              <ul className="mt-4 space-y-2.5">
                {navLinks.slice(0, 6).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-teal-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-base font-semibold text-ink">{messages.shell.needSupport}</h4>
              <div className="mt-4 space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full border border-honey-300/80 bg-honey-50 px-3 py-1.5 font-semibold text-honey-800">
                  <span aria-hidden="true" className="grid size-5 place-items-center hex-clip bg-honey-400 text-[0.65rem] font-bold text-honey-900">!</span>
                  {messages.shell.emergencyLine}
                </p>
                <p>{messages.shell.email}</p>
                <p>{messages.shell.volunteerDesk}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} {messages.shell.brandName} · {messages.shell.brandSubtitle}
            </p>
            <p className="text-xs text-muted">{messages.shell.volunteerDesk}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
