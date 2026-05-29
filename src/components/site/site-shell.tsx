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
  const { user, login, logout } = useAuth();
  const mounted = useMounted();
  const demoUser = { email: "demo@resourcehive.org", name: messages.shell.demoUserName };
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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ecfdf5_0%,#e0f2fe_48%,#fef9c3_100%)] text-[#102a2a]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] bg-[size:84px_84px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_52%)]" />
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark className="size-10 sm:size-11" priority />
            <div>
              <div className="text-lg font-black tracking-tight text-[#102a2a]">{messages.shell.brandName}</div>
              <div className="text-xs text-[#647b80]">{messages.shell.brandSubtitle}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-[#526d72] transition hover:text-emerald-600">
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
                  <Button variant="secondary" size="sm" onClick={logout}>
                    {messages.shell.signOut}
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => login(demoUser)}>
                    {messages.shell.demoLogin}
                  </Button>
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
              <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-2 text-sm font-medium text-[#315963] hover:bg-white/55 hover:text-emerald-600">
                {link.label}
              </Link>
            ))}
            {mounted ? (
              <>
                <div className="mt-3 flex gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
                <Button size="sm" onClick={() => (user ? logout() : login(demoUser))}>
                  {user ? messages.shell.signOut : messages.shell.demoLogin}
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="relative">{children}</main>

      <footer className="border-t border-white/40 bg-white/45">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm text-[#526d72] sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
          <div>
            <h3 className="text-lg font-bold text-[#102a2a]">{messages.shell.brandName}</h3>
            <p className="mt-3 max-w-lg leading-7">{messages.shell.footerDescription}</p>
          </div>
          <div>
            <h4 className="font-semibold text-[#102a2a]">{messages.shell.platform}</h4>
            <div className="mt-3 space-y-2">
              {navLinks.slice(0, 6).map((link) => (
                <Link key={link.href} href={link.href} className="block hover:text-emerald-600">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#102a2a]">{messages.shell.needSupport}</h4>
            <div className="mt-3 space-y-2">
              <p>{messages.shell.emergencyLine}</p>
              <p>{messages.shell.email}</p>
              <p>{messages.shell.volunteerDesk}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
