"use client";

import { Mail, MapPin, PhoneCall } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactPageClient() {
  const { messages } = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-[32px] p-8">
          <h1 className="text-5xl font-bold text-ink">{messages.contact.title}</h1>
          <p className="mt-5 text-base leading-8 text-muted">
            {messages.contact.description}
          </p>

          <div className="mt-8 space-y-4 text-sm text-ink-soft">
            <div className="flex gap-3">
              <Mail className="mt-1 size-4 text-honey-600" />
              hello@resourcehive.org
            </div>
            <div className="flex gap-3">
              <PhoneCall className="mt-1 size-4 text-honey-600" />
              (800) 555-0211
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-1 size-4 text-honey-600" />
              {messages.contact.hub}
            </div>
          </div>
        </div>

        <form className="glass-panel rounded-[32px] p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder={messages.common.fullName} />
            <Input placeholder={messages.common.emailAddress} />
            <div className="md:col-span-2">
              <Input placeholder={messages.common.organization} />
            </div>
            <div className="md:col-span-2">
              <textarea
                className="min-h-40 w-full rounded-[28px] border border-[var(--border)] bg-white/70 p-4 text-sm text-ink outline-none transition focus:border-teal-300 focus:ring-4 focus:ring-teal-200/50"
                placeholder={messages.common.helpPrompt}
              />
            </div>
          </div>
          <Button size="lg" className="mt-6 w-full">
            {messages.common.sendMessage}
          </Button>
        </form>
      </div>
    </div>
  );
}
