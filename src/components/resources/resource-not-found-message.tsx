"use client";

import { useLocale } from "@/components/providers/locale-provider";

export function ResourceNotFoundMessage() {
  const { messages } = useLocale();

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">{messages.common.resourceNotFound}</h1>
    </div>
  );
}
