"use client";

import Link from "next/link";
import { ArrowLeft, Clock3, Info, Languages, Mail, MapPin, Phone, UserRound } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { ResourcePreviewMap } from "@/components/maps/resource-preview-map";
import { Badge } from "@/components/ui/badge";
import { localizeCategory, localizeLanguage } from "@/lib/i18n";
import type { Resource } from "@/lib/types";
import { formatLocation, formatPhone } from "@/lib/utils";

export function ResourceDetailView({
  resource,
  related,
}: {
  resource: Resource;
  related: Resource[];
}) {
  const { locale, messages } = useLocale();
  const location = formatLocation(resource);
  const phone = formatPhone(resource.phone);
  const languages = resource.languages.map((language) => localizeLanguage(language, locale)).join(", ");
  const services = resource.services.filter(Boolean);
  const tags = resource.tags.filter(Boolean);
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-500">
        <ArrowLeft className="size-4" />
        {messages.common.backToDirectory}
      </Link>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <section className="glass-panel rounded-[34px] p-8">
          <Badge tone="teal">{localizeCategory(resource.category, locale)}</Badge>
          <h1 className="mt-5 text-5xl font-bold text-ink">{resource.name}</h1>
          {resource.description ? (
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{resource.description}</p>
          ) : null}
          {resource.info && resource.info !== resource.description ? (
            <div className="mt-5 rounded-[28px] border border-white/40 bg-white/55 p-5">
              <div className="flex gap-3 text-ink-soft"><Info className="mt-1 size-4 text-teal-500" /><span>{resource.info}</span></div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {location ? (
              <div className="rounded-[28px] border border-white/40 bg-white/55 p-5">
                <div className="flex gap-3 text-ink-soft"><MapPin className="mt-1 size-4 text-teal-500" /><span>{location}</span></div>
              </div>
            ) : null}
            {phone ? (
              <div className="rounded-[28px] border border-white/40 bg-white/55 p-5">
                <div className="flex gap-3 text-ink-soft"><Phone className="mt-1 size-4 text-teal-500" /><span>{phone}</span></div>
              </div>
            ) : null}
            {resource.hours ? (
              <div className="rounded-[28px] border border-white/40 bg-white/55 p-5">
                <div className="flex gap-3 text-ink-soft"><Clock3 className="mt-1 size-4 text-teal-500" /><span>{resource.hours}</span></div>
              </div>
            ) : null}
            {languages ? (
              <div className="rounded-[28px] border border-white/40 bg-white/55 p-5">
                <div className="flex gap-3 text-ink-soft"><Languages className="mt-1 size-4 text-teal-500" /><span>{languages}</span></div>
              </div>
            ) : null}
            {resource.email ? (
              <div className="rounded-[28px] border border-white/40 bg-white/55 p-5">
                <div className="flex gap-3 text-ink-soft"><Mail className="mt-1 size-4 text-teal-500" /><span>{resource.email}</span></div>
              </div>
            ) : null}
            {resource.contactName ? (
              <div className="rounded-[28px] border border-white/40 bg-white/55 p-5">
                <div className="flex gap-3 text-ink-soft"><UserRound className="mt-1 size-4 text-teal-500" /><span>{resource.contactName}</span></div>
              </div>
            ) : null}
          </div>

          {services.length ? (
            <div className="mt-8 rounded-[28px] border border-white/40 bg-white/55 p-5">
              <h2 className="text-xl font-bold text-ink">{messages.common.services}</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {services.map((service) => (
                  <Badge key={service} tone="teal">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {resource.eligibility ? (
            <div className="mt-8 rounded-[28px] border border-white/40 bg-white/55 p-5">
              <h2 className="text-xl font-bold text-ink">{messages.common.eligibility}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{resource.eligibility}</p>
            </div>
          ) : null}

          {tags.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}

        </section>

        <aside className="space-y-5">
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-bold text-ink">{messages.common.mapPreview}</h2>
            <div className="mt-4 overflow-hidden rounded-[26px]">
              <ResourcePreviewMap resource={resource} />
            </div>
            {location ? <p className="mt-4 text-sm leading-7 text-muted">{location}</p> : null}
          </div>
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-bold text-ink">{messages.common.whyThisMatters}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              {messages.resourceDetail.whyThisMattersText}
            </p>
          </div>
          <div className="glass-panel rounded-[30px] p-6">
            <h2 className="text-2xl font-bold text-ink">{messages.common.relatedServices}</h2>
            <div className="mt-4 space-y-3">
              {related.map((item) => (
                <Link key={item.id} href={`/resource/${item.id}`} className="block rounded-[24px] border border-[var(--border)] bg-white/60 p-4 transition hover:border-teal-200 hover:bg-white">
                  <p className="font-bold text-ink">{item.name}</p>
                  {formatLocation(item) ? <p className="mt-1 text-sm text-muted">{formatLocation(item)}</p> : null}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

