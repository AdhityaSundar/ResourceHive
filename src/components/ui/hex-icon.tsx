import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type HexTone = "warm" | "teal";

const toneStyles: Record<
  HexTone,
  { frame: string; inner: string; icon: string }
> = {
  warm: {
    frame: "bg-[linear-gradient(135deg,var(--honey-300),var(--honey-500))]",
    inner: "bg-honey-50",
    icon: "text-honey-700",
  },
  teal: {
    frame: "bg-[linear-gradient(135deg,var(--teal-300),var(--teal-600))]",
    inner: "bg-teal-50",
    icon: "text-teal-700",
  },
};

/**
 * A Lucide icon framed inside a hive hexagon: a colored outer hex with an
 * inset tinted hex and the icon centered. Decorative by default (aria-hidden).
 */
export function HexIcon({
  icon: Icon,
  tone = "warm",
  className,
}: {
  icon: LucideIcon;
  tone?: HexTone;
  className?: string;
}) {
  const styles = toneStyles[tone];

  return (
    <div
      aria-hidden="true"
      className={cn("relative grid size-14 shrink-0 place-items-center", className)}
    >
      <span className={cn("absolute inset-0 hex-clip", styles.frame)} />
      <span className={cn("absolute inset-[2px] hex-clip", styles.inner)} />
      <Icon className={cn("relative size-6", styles.icon)} strokeWidth={2} />
    </div>
  );
}
