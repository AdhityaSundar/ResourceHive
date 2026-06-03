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
      <p className="text-sm font-bold uppercase tracking-[0.28em] text-teal-600">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-muted">{description}</p>
    </div>
  );
}
