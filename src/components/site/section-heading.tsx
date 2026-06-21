export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-px w-9 bg-gradient-to-r from-honey-400 to-transparent"
        />
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-teal-600">{eyebrow}</p>
      </div>
      <h2 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-muted">{description}</p>
    </div>
  );
}
