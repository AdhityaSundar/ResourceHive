import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, placeholder, "aria-label": ariaLabel, ...props }, ref) => (
    <input
      ref={ref}
      placeholder={placeholder}
      // Placeholders are not accessible labels — fall back to the placeholder as
      // the accessible name so every field has one (WCAG 1.3.1 / 4.1.2).
      aria-label={ariaLabel ?? (typeof placeholder === "string" ? placeholder : undefined)}
      className={cn(
        "h-12 w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-teal-300 focus:ring-4 focus:ring-teal-200/50",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
