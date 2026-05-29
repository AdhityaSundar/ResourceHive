import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "interactive-glow inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.98] hover:scale-[1.01] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(135deg,#16a34a,#0ea5e9)] text-white shadow-[0_14px_36px_rgba(14,165,233,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(34,197,94,0.18)]",
        secondary:
          "bg-white/55 text-[#18333a] ring-1 ring-sky-100/70 backdrop-blur hover:bg-white/75",
        ghost:
          "bg-transparent text-[#315963] hover:bg-white/45",
      },
      size: {
        sm: "h-10 px-4",
        md: "h-12 px-5",
        lg: "h-14 px-6 text-base",
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
