import { Quote } from "lucide-react";

import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "I found a pantry open that same evening. It took two minutes instead of two hours.",
    name: "Maria T.",
    role: "Parent · Dallas",
    initials: "MT",
    tone: "warm" as const,
  },
  {
    quote:
      "We point every family we work with to ResourceHive now. The listings are current and the map just works.",
    name: "James O.",
    role: "Social worker · Fort Worth",
    initials: "JO",
    tone: "teal" as const,
  },
  {
    quote:
      "Listing our shelter took minutes, and we control our own hours and availability.",
    name: "Priya N.",
    role: "Shelter coordinator · Irving",
    initials: "PN",
    tone: "warm" as const,
  },
];

const toneClasses = {
  warm: "bg-[linear-gradient(135deg,var(--honey-300),var(--honey-500))] text-honey-900",
  teal: "bg-[linear-gradient(135deg,var(--teal-300),var(--teal-600))] text-white",
};

export function Testimonials() {
  return (
    <div>
      <SectionHeading
        eyebrow="Stories from the community"
        title="Built for the moments that matter"
        description="Families, social workers, and local organizations use ResourceHive to close the gap between a need and the help nearby."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {testimonials.map((item) => (
          <figure
            key={item.name}
            className="glass-panel flex h-full flex-col rounded-[32px] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-e4"
          >
            <Quote className="size-7 text-honey-400" aria-hidden="true" />
            <blockquote className="mt-4 flex-1 text-base leading-8 text-ink-soft">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-10 place-items-center hex-clip text-sm font-bold",
                  toneClasses[item.tone],
                )}
              >
                {item.initials}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{item.name}</span>
                <span className="block text-xs text-muted">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
