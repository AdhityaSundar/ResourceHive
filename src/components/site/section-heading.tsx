import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn("h-px w-9 bg-gradient-to-r to-transparent", dark ? "from-honey-300" : "from-honey-400")}
        />
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-[0.32em]",
            dark ? "text-honey-300" : "text-teal-600",
          )}
        >
          {eyebrow}
        </p>
      </div>
      <h2
        className={cn(
          "mt-4 text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      <p className={cn("mt-4 text-base leading-8", dark ? "text-teal-50/80" : "text-muted")}>{description}</p>
    </div>
  );
}
