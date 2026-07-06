"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { BrandMark } from "@/components/site/brand-mark";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { messages } = useLocale();
  const { user, isAdmin, logout } = useAuth();
  const mounted = useMounted();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Condense the header once the page has scrolled a little.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const underlineTransition = prefersReduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 32 };

  // Auth pages render full-screen without the site chrome (header/footer).
  if (pathname === "/login" || pathname === "/signup") {
    return <>{children}</>;
  }
  // First six are the public links (also reused in the footer). Account links are
  // appended only when signed in: admins manage the shared directory, everyone
  // else manages their own resources.
  const navLinks = [
    { href: "/", label: messages.nav.home },
    { href: "/about", label: messages.nav.about },
    { href: "/resources", label: messages.nav.resources },
    { href: "/faq", label: messages.nav.faq },
    { href: "/contact", label: messages.nav.contact },
    ...(user ? [{ href: "/dashboard", label: messages.nav.dashboard }] : []),
    ...(user ? [{ href: "/preferences", label: messages.nav.preferences }] : []),
    ...(user && isAdmin ? [{ href: "/admin", label: messages.nav.admin }] : []),
  ];

  return (
    <div className="relative min-h-screen overflow-x-clip bg-cream text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-e3"
      >
        {messages.shell.skipToContent}
      </a>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-[linear-gradient(90deg,var(--honey-400),var(--teal-500))]"
      />
      <div className="honeycomb-texture-light pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(14,124,134,0.12),_transparent_52%)]" />
      <header
        className={cn(
          "sticky top-0 z-40 border-b ease-[cubic-bezier(0.22,1,0.36,1)] backdrop-blur-2xl transition-all duration-500",
          scrolled
            ? "border-[var(--border)] bg-white/80 shadow-e2"
            : "border-white/40 bg-white/55",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 ease-[cubic-bezier(0.22,1,0.36,1)] transition-all duration-500 sm:px-6 lg:px-8",
            scrolled ? "py-2.5" : "py-4",
          )}
        >
          <Link href="/" className="logo-hover flex items-center gap-3">
            <BrandMark className="size-10 sm:size-11" priority />
            <div>
              <div className="font-display text-lg font-bold tracking-tight text-ink">{messages.shell.brandName}</div>
              <div className="text-xs text-muted">{messages.shell.brandSubtitle}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-sm font-medium transition-colors hover:text-teal-600",
                    active ? "text-teal-700" : "text-muted",
                  )}
                >
                  {link.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      transition={underlineTransition}
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-[linear-gradient(90deg,var(--teal-500),var(--honey-400))]"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {mounted ? (
              user ? (
                <Button variant="secondary" size="sm" onClick={() => logout()}>
                  {messages.shell.signOut}
                </Button>
              ) : (
                <Link href="/login">
                  <Button size="sm">{messages.shell.demoLogin}</Button>
                </Link>
              )
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
              user ? (
                <Button size="sm" onClick={() => logout()}>
                  {messages.shell.signOut}
                </Button>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="w-full">
                    {messages.shell.demoLogin}
                  </Button>
                </Link>
              )
            ) : null}
          </div>
        </div>
      </header>

      <main id="main-content" className="relative">{children}</main>

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
                {navLinks.slice(0, 5).map((link) => (
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
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} {messages.shell.brandName} · {messages.shell.brandSubtitle}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
