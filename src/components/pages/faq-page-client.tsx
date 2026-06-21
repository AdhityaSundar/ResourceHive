"use client";

import { useLocale } from "@/components/providers/locale-provider";

export function FaqPageClient() {
  const { messages } = useLocale();
  const faqs = [
    {
      question: messages.faq.q1,
      answer: messages.faq.a1,
      accent: "from-honey-400 to-orange-500",
      badge: "bg-honey-500 text-white",
      panel: "border-honey-200 bg-[linear-gradient(145deg,var(--honey-50),rgba(244,190,78,0.22),rgba(255,255,255,0.78))]",
    },
    {
      question: messages.faq.q2,
      answer: messages.faq.a2,
      accent: "from-teal-400 to-teal-700",
      badge: "bg-teal-600 text-white",
      panel: "border-teal-200 bg-[linear-gradient(145deg,var(--teal-50),rgba(95,184,188,0.20),rgba(255,255,255,0.78))]",
    },
    {
      question: messages.faq.q3,
      answer: messages.faq.a3,
      accent: "from-orange-500 to-honey-300",
      badge: "bg-orange-500 text-white",
      panel: "border-[rgba(232,101,10,0.26)] bg-[linear-gradient(145deg,#fff7ed,rgba(232,101,10,0.14),rgba(255,255,255,0.78))]",
    },
    {
      question: messages.faq.q4,
      answer: messages.faq.a4,
      accent: "from-teal-700 via-honey-400 to-orange-500",
      badge: "bg-ink text-white",
      panel: "border-teal-200 bg-[linear-gradient(145deg,#f0fdfa,rgba(244,190,78,0.18),rgba(255,255,255,0.78))]",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="glass-panel overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_0%_0%,rgba(244,190,78,0.26),transparent_32%),radial-gradient(circle_at_100%_0%,rgba(14,124,134,0.18),transparent_34%),rgba(255,255,255,0.76)] p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-honey-600">{messages.faq.eyebrow}</p>
        <h1 className="mt-4 text-5xl font-bold text-ink">{messages.faq.title}</h1>
      </section>

      <div className="mt-8 grid gap-4">
        {faqs.map((item, index) => (
          <details key={item.question} className={`group relative overflow-hidden rounded-[28px] border p-6 shadow-e3 ${item.panel}`}>
            <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.accent}`} />
            <summary className="flex cursor-pointer list-none items-start gap-4 text-lg font-bold text-ink">
              <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-2xl font-display text-sm font-extrabold shadow-e1 ${item.badge}`}>
                {index + 1}
              </span>
              <span className="flex-1">{item.question}</span>
              <span className="text-2xl leading-none text-teal-700 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 text-sm leading-7 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
