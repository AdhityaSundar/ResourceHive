"use client";

import { Compass, PhoneCall, Search } from "lucide-react";

import { HexIcon } from "@/components/ui/hex-icon";
import { SectionHeading } from "@/components/site/section-heading";
import { useLocale } from "@/components/providers/locale-provider";

export function HowItWorks() {
  const { messages } = useLocale();
  const localizedSteps = [
    {
      icon: Search,
      tone: "warm" as const,
      title: messages.home.step1Title,
      text: messages.home.step1Text,
    },
    {
      icon: Compass,
      tone: "teal" as const,
      title: messages.home.step2Title,
      text: messages.home.step2Text,
    },
    {
      icon: PhoneCall,
      tone: "warm" as const,
      title: messages.home.step3Title,
      text: messages.home.step3Text,
    },
  ];

  return (
    <div>
      <SectionHeading
        eyebrow={messages.home.howItWorksEyebrow}
        title={messages.home.howItWorksTitle}
        description={messages.home.howItWorksDescription}
      />
      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        {localizedSteps.map((step, index) => (
          <li
            key={step.title}
            className="glass-panel relative rounded-[32px] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-e4"
          >
            <span className="absolute right-6 top-6 font-display text-5xl font-extrabold text-honey-700/35 drop-shadow-sm">
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
