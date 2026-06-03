import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
  {
    variants: {
      tone: {
        neutral: "border-[var(--border)] bg-white/70 text-ink-soft",
        warm: "border-honey-200 bg-honey-50 text-honey-700",
        teal: "border-teal-200 bg-teal-50 text-teal-700",
        // Resource status pills
        open: "border-teal-200 bg-teal-50 text-teal-700",
        free: "border-honey-200 bg-honey-50 text-honey-700",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
  /** Prepend a small hive hexagon glyph for brand accent. */
  hex?: boolean;
}

export function Badge({ className, children, tone, hex = false }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)}>
      {hex ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-2.5 fill-current opacity-80">
          <path d="M6 2h12l6 10-6 10H6L0 12z" />
        </svg>
      ) : null}
      {children}
    </span>
  );
}
