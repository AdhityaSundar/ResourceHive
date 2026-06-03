const partners = [
  "Sunrise Community Food Bank",
  "Harbor Night Shelter",
  "Open Door Skills Lab",
  "Hope Harvest Pantry",
  "Cornerstone Health Clinic",
  "Bright Futures Education",
];

export function Partners() {
  return (
    <div className="glass-panel rounded-[32px] px-6 py-8 sm:px-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-muted">
        Trusted by community organizations across North Texas
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {partners.map((partner) => (
          <span
            key={partner}
            className="font-display text-base font-semibold tracking-tight text-ink/55 transition hover:text-ink"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
}
