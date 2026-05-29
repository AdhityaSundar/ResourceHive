import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-[#18333a] outline-none transition placeholder:text-[#647b80] focus:border-sky-300 focus:ring-4 focus:ring-sky-200/50",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
