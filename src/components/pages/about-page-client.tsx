"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { SectionHeading } from "@/components/site/section-heading";

export function AboutPageClient() {
  const { messages } = useLocale();
  const items = [
    { title: messages.about.storyTitle, text: messages.about.storyText },
    { title: messages.about.impactTitle, text: messages.about.impactText },
    { title: messages.about.scaleTitle, text: messages.about.scaleText },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={messages.about.eyebrow}
        title={messages.about.title}
        description={messages.about.description}
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-bold text-ink">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
