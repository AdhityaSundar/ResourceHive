import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "interactive-glow inline-flex items-center justify-center rounded-full font-display font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Warm "invite" CTA: amber gradient with dark ink — high contrast (AA) and on-brand honey.
        primary:
          "bg-[linear-gradient(135deg,var(--honey-300),var(--honey-500))] text-ink shadow-e3 hover:-translate-y-0.5 hover:shadow-[var(--glow-warm)]",
        // Calm "focus" CTA for search/results/clinical areas: deep teal, white text.
        teal:
          "bg-teal-700 text-white shadow-e2 hover:-translate-y-0.5 hover:bg-teal-600 hover:shadow-[var(--glow-teal)]",
        secondary:
          "bg-white/75 text-teal-700 ring-1 ring-[var(--border-strong)] backdrop-blur hover:bg-white hover:-translate-y-0.5",
        ghost: "bg-transparent text-ink-soft hover:bg-white/55",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-5 text-sm",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
