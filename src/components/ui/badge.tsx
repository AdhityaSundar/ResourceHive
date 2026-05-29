import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-sky-100/70 bg-white/60 px-3 py-1 text-xs font-semibold text-[#315963]",
        className,
      )}
    >
      {children}
    </span>
  );
}
