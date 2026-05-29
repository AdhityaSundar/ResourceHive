"use client";

import { LocaleProvider, useLocale } from "@/components/providers/locale-provider";
import type { Locale } from "@/lib/i18n";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}

export function useLanguage(): {
  lang: Locale;
  setLang: (locale: Locale) => void;
  t: ReturnType<typeof useLocale>["messages"];
} {
  const { locale, setLocale, messages } = useLocale();

  return {
    lang: locale,
    setLang: setLocale,
    t: messages,
  };
}
