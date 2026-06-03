import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-teal-300 focus:ring-4 focus:ring-teal-200/50",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
