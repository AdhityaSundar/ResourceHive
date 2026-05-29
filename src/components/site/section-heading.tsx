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
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-[#102a2a] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[#526d72]">{description}</p>
    </div>
  );
}
