"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Heart, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { categoryAccent } from "@/lib/category-accent";
import { localizeCategory } from "@/lib/i18n";
import type { Resource } from "@/lib/types";
import { formatLocation, formatPhone } from "@/lib/utils";

export function ResourceCard({ resource }: { resource: Resource }) {
  const { saved, toggleSaved, recordView } = useAuth();
  const { locale, messages } = useLocale();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const isSaved = saved.some((item) => item.resourceId === resource.id);
  const location = formatLocation(resource);
  const phone = formatPhone(resource.phone);

  return (
    <motion.article
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ "--accent": categoryAccent(resource.category) } as CSSProperties}
      className="card-steel group relative flex h-full flex-col overflow-hidden rounded-[30px] p-6 transition duration-300"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
        style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone="teal" hex>
            {localizeCategory(resource.category, locale)}
          </Badge>
          <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{resource.name}</h3>
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(resource.id)}
          aria-pressed={isSaved}
          className="interactive-glow rounded-full border border-[var(--border)] bg-white/70 p-2 text-muted transition hover:border-honey-300 hover:text-honey-600"
          aria-label={messages.common.saveResource}
        >
          <Heart className={`size-5 ${isSaved ? "fill-honey-500 text-honey-600" : ""}`} />
        </button>
      </div>

      {resource.description ? (
        <p className="mt-4 flex-1 leading-7 text-muted">{resource.description}</p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-5 space-y-3 text-sm text-muted">
        {location ? (
          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-teal-500" />
            <span>{location}</span>
          </div>
        ) : null}
        {phone ? (
          <div className="flex gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-teal-500" />
            <span>{phone}</span>
          </div>
        ) : null}
        {resource.email ? (
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-teal-500" />
            <span>{resource.email}</span>
          </div>
        ) : null}
        {resource.contactName ? (
          <div className="flex gap-3">
            <UserRound className="mt-0.5 size-4 shrink-0 text-teal-500" />
            <span>{resource.contactName}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex gap-3 border-t border-[var(--border)] pt-5">
        <button
          type="button"
          onClick={() => {
            recordView(resource.id);
            router.push(`/resource/${resource.id}`);
          }}
          className="interactive-glow inline-flex h-12 items-center justify-center rounded-full bg-teal-700 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-600"
        >
          {messages.common.viewDetails}
        </button>
      </div>
    </motion.article>
  );
}
