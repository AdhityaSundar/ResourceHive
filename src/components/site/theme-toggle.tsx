"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { messages } = useLocale();
  const mounted = useMounted();

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={messages.shell.themeToggleAria}
    >
      {resolvedTheme === "dark" ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
    </Button>
  );
}
