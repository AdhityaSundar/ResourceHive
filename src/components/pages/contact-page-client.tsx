"use client";

import { Mail, MapPin, PhoneCall } from "lucide-react";
import { useState, type FormEvent } from "react";

import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTACT_EMAIL } from "@/lib/contact";
import { formatLocalizedMessage } from "@/lib/i18n";

type ContactStatus = {
  tone: "success" | "error";
  message: string;
};

export function ContactPageClient() {
  const { messages } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<ContactStatus | null>(null);
  const [draftHref, setDraftHref] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setIsSubmitting(true);
    setStatus(null);
    setDraftHref("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as { code?: string; message?: string } | null;

      if (response.ok) {
        form.reset();
        setStatus({ tone: "success", message: messages.common.contactMessageSent });
        return;
      }

      const subject = encodeURIComponent(`ResourceHive contact: ${payload.name || "New message"}`);
      const body = encodeURIComponent(
        [
          `${messages.common.fullName}: ${payload.name}`,
          `${messages.common.emailAddress}: ${payload.email}`,
          `${messages.common.organization}: ${payload.organization || messages.common.notProvided}`,
          "",
          payload.message,
        ].join("\n"),
      );
      setDraftHref(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);

      if (data?.code === "missing_config") {
        setStatus({ tone: "error", message: messages.common.contactMessageSetupRequired });
        return;
      }

      if (data?.code === "invalid_api_key") {
        setStatus({ tone: "error", message: messages.common.contactMessageInvalidApiKey });
        return;
      }

      if (data?.code === "sender_not_verified") {
        setStatus({ tone: "error", message: messages.common.contactMessageSenderNotVerified });
        return;
      }

      setStatus({
        tone: "error",
        message: data?.message
          ? `${messages.common.contactMessageFailed} ${data.message}`
          : messages.common.contactMessageFailed,
      });
    } catch {
      setStatus({ tone: "error", message: messages.common.contactMessageFailed });
    } finally {
      setIsSubmitting(false);
    }
  }

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
              {CONTACT_EMAIL}
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

        <form onSubmit={handleSubmit} className="glass-panel rounded-[32px] p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="name" placeholder={messages.common.fullName} autoComplete="name" required />
            <Input
              name="email"
              type="email"
              placeholder={messages.common.emailAddress}
              autoComplete="email"
              required
            />
            <div className="md:col-span-2">
              <Input name="organization" placeholder={messages.common.organization} autoComplete="organization" />
            </div>
            <div className="md:col-span-2">
              <textarea
                name="message"
                aria-label={messages.common.helpPrompt}
                className="min-h-40 w-full rounded-[28px] border border-[var(--border)] bg-white/70 p-4 text-sm text-ink outline-none transition focus:border-teal-300 focus:ring-4 focus:ring-teal-200/50"
                placeholder={messages.common.helpPrompt}
                required
              />
            </div>
          </div>

          {status ? (
            <div
              className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                status.tone === "success"
                  ? "border-teal-200 bg-teal-50 text-teal-700"
                  : "border-honey-200 bg-honey-50 text-honey-800"
              }`}
              role="status"
              aria-live="polite"
            >
              <p>{status.message}</p>
              {draftHref ? (
                <a href={draftHref} className="mt-2 inline-flex font-semibold underline underline-offset-4">
                  {formatLocalizedMessage(messages.common.emailDirectly, { email: CONTACT_EMAIL })}
                </a>
              ) : null}
            </div>
          ) : null}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? messages.common.sendingMessage : messages.common.sendMessage}
          </Button>
        </form>
      </div>
    </div>
  );
}
