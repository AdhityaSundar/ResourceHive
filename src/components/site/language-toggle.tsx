"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

export function LanguageToggle() {
  const { locale, setLocale, messages } = useLocale();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => setLocale(locale === "en" ? "es" : "en")}
      aria-label={messages.common.languageLabel}
      className="gap-2"
    >
      <Languages className="size-4" />
      {locale === "en" ? "ES" : "EN"}
    </Button>
  );
}
