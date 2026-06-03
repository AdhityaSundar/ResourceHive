import { Compass, PhoneCall, Search } from "lucide-react";

import { HexIcon } from "@/components/ui/hex-icon";
import { SectionHeading } from "@/components/site/section-heading";

const steps = [
  {
    icon: Search,
    tone: "warm" as const,
    title: "Tell us what you need",
    text: "Pick a need — food, shelter, a clinic — or just type it. No account, no forms.",
  },
  {
    icon: Compass,
    tone: "teal" as const,
    title: "See what's open nearby",
    text: "Browse verified listings with real hours, eligibility, and location — on a map or in a list.",
  },
  {
    icon: PhoneCall,
    tone: "warm" as const,
    title: "Reach out with confidence",
    text: "Call, get directions, or save it for later — every detail you need before you go.",
  },
];

export function HowItWorks() {
  return (
    <div>
      <SectionHeading
        eyebrow="How it works"
        title="Help in three simple steps"
        description="No sign-ups or jargon — just the fastest path from a need to real, local support."
      />
      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="glass-panel relative rounded-[32px] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-e4"
          >
            <span className="absolute right-6 top-6 font-display text-5xl font-extrabold text-ink/5">
              {index + 1}
            </span>
            <HexIcon icon={step.icon} tone={step.tone} className="size-14" />
            <h3 className="mt-5 font-display text-xl font-semibold text-ink">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
