"use client";

import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <SmoothScroll />
          {children}
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
