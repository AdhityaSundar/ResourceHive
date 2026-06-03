"use client";

import { useLocale } from "@/components/providers/locale-provider";

export function FaqPageClient() {
  const { messages } = useLocale();
  const faqs = [
    { question: messages.faq.q1, answer: messages.faq.a1 },
    { question: messages.faq.q2, answer: messages.faq.a2 },
    { question: messages.faq.q3, answer: messages.faq.a3 },
    { question: messages.faq.q4, answer: messages.faq.a4 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-bold text-ink">{messages.faq.title}</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((item) => (
          <details key={item.question} className="glass-panel rounded-[28px] p-6">
            <summary className="cursor-pointer list-none text-lg font-bold text-ink">
              {item.question}
            </summary>
            <p className="mt-4 text-sm leading-7 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
