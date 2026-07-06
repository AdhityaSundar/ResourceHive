"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Clock3,
  Globe,
  GraduationCap,
  HeartPulse,
  Home,
  Info,
  Languages,
  LifeBuoy,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Scale,
  Soup,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { categoryAccent } from "@/lib/category-accent";
import { localizeCategory, localizeLanguage } from "@/lib/i18n";
import type { Resource } from "@/lib/types";
import { formatLocation, formatPhone, getDirectionsUrl, websiteLabel, websiteUrl } from "@/lib/utils";

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Food: Soup,
  Shelter: Home,
  Jobs: BriefcaseBusiness,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Community: Users,
  Legal: Scale,
  Youth: Sparkles,
  Resource: LifeBuoy,
};

// A dark-glass info tile (icon + text), used across the detail page.
function InfoTile({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-white/12 bg-white/[0.05] p-5 backdrop-blur">
      <div className="flex gap-3 text-white/85">
        <Icon className="mt-0.5 size-4 shrink-0 text-teal-300" />
        <span className="leading-6">{children}</span>
      </div>
    </div>
  );
}

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
  const siteHref = websiteUrl(resource.website);
  const languages = resource.languages.map((language) => localizeLanguage(language, locale)).join(", ");
  const services = resource.services.filter(Boolean);
  const tags = resource.tags.filter(Boolean);
  const accent = categoryAccent(resource.category);
  const Icon = CATEGORY_ICON[resource.category] ?? LifeBuoy;

  return (
    <div
      style={{ "--accent": accent } as CSSProperties}
      className="relative min-h-screen overflow-hidden bg-teal-900"
    >
      <div className="honeycomb-texture-dark pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(14,124,134,0.42),transparent_60%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-[32rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-200 transition hover:text-honey-300"
        >
          <ArrowLeft className="size-4" />
          {messages.common.backToDirectory}
        </Link>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.7fr]">
          <section className="relative overflow-hidden rounded-[34px] border border-white/[0.14] bg-white/[0.055] p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(160deg, color-mix(in srgb, var(--accent) 22%, transparent), transparent 48%)" }}
            />
            <div className="relative flex items-center gap-3">
              <span className="relative grid size-12 shrink-0 place-items-center">
                <span className="absolute inset-0 hex-clip" style={{ background: "var(--accent)" }} />
                <span className="absolute inset-[2px] hex-clip bg-[#0c2b31]" />
                <Icon className="relative size-5" style={{ color: "var(--accent)" }} strokeWidth={2} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                {localizeCategory(resource.category, locale)}
              </span>
            </div>

            <h1 className="relative mt-5 text-balance font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              {resource.name}
            </h1>
            {resource.description ? (
              <p className="relative mt-5 max-w-3xl text-base leading-8 text-white/80">{resource.description}</p>
            ) : null}
            {resource.info && resource.info !== resource.description ? (
              <div className="relative mt-5">
                <InfoTile icon={Info}>{resource.info}</InfoTile>
              </div>
            ) : null}

            <div className="relative mt-8 grid gap-4 md:grid-cols-2">
              {location ? <InfoTile icon={MapPin}>{location}</InfoTile> : null}
              {phone ? <InfoTile icon={Phone}>{phone}</InfoTile> : null}
              {resource.hours ? <InfoTile icon={Clock3}>{resource.hours}</InfoTile> : null}
              {languages ? <InfoTile icon={Languages}>{languages}</InfoTile> : null}
              {resource.email ? <InfoTile icon={Mail}>{resource.email}</InfoTile> : null}
              {resource.contactName ? <InfoTile icon={UserRound}>{resource.contactName}</InfoTile> : null}
              {siteHref ? (
                <InfoTile icon={Globe}>
                  <a
                    href={siteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-medium text-teal-200 transition hover:text-honey-300"
                  >
                    {websiteLabel(resource.website)}
                  </a>
                </InfoTile>
              ) : null}
            </div>

            {services.length ? (
              <div className="relative mt-8 rounded-[28px] border border-white/12 bg-white/[0.05] p-5 backdrop-blur">
                <h2 className="text-xl font-bold text-white">{messages.common.services}</h2>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {resource.eligibility ? (
              <div className="relative mt-8 rounded-[28px] border border-white/12 bg-white/[0.05] p-5 backdrop-blur">
                <h2 className="text-xl font-bold text-white">{messages.common.eligibility}</h2>
                <p className="mt-3 text-sm leading-7 text-white/75">{resource.eligibility}</p>
              </div>
            ) : null}

            {tags.length ? (
              <div className="relative mt-8 flex flex-wrap gap-2.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <aside className="space-y-5">
            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.14] bg-white/[0.055] p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white">{messages.common.reachOut}</h2>
              <div className="mt-4 space-y-3">
                {siteHref ? (
                  <a
                    href={siteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-glow flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-teal-900 transition hover:-translate-y-0.5 hover:bg-white/90"
                  >
                    <Globe className="size-4 text-teal-700" />
                    {messages.common.visitWebsite}
                  </a>
                ) : null}
                {phone ? (
                  <a
                    href={`tel:${resource.phone.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <Phone className="size-4 text-teal-300" />
                    {phone}
                  </a>
                ) : null}
                {resource.email ? (
                  <a
                    href={`mailto:${resource.email}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <Mail className="size-4 text-teal-300" />
                    {resource.email}
                  </a>
                ) : null}
                {resource.address ? (
                  <a
                    href={getDirectionsUrl(resource)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <Navigation className="size-4 text-teal-300" />
                    {messages.common.getDirections}
                  </a>
                ) : null}
                {!siteHref && !phone && !resource.email && !resource.address ? (
                  <p className="text-sm leading-7 text-white/70">{messages.common.unavailable}</p>
                ) : null}
              </div>
              {location ? <p className="mt-4 text-sm leading-7 text-white/60">{location}</p> : null}
            </div>

            <div className="rounded-[30px] border border-white/[0.14] bg-white/[0.055] p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white">{messages.common.whyThisMatters}</h2>
              <p className="mt-4 text-sm leading-7 text-white/75">{messages.resourceDetail.whyThisMattersText}</p>
            </div>

            {related.length ? (
              <div className="rounded-[30px] border border-white/[0.14] bg-white/[0.055] p-6 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white">{messages.common.relatedServices}</h2>
                <div className="mt-4 space-y-3">
                  {related.map((item) => (
                    <Link
                      key={item.id}
                      href={`/resource/${item.id}`}
                      className="block rounded-[24px] border border-white/12 bg-white/[0.05] p-4 transition hover:border-white/25 hover:bg-white/10"
                    >
                      <p className="font-bold text-white">{item.name}</p>
                      {formatLocation(item) ? (
                        <p className="mt-1 text-sm text-white/60">{formatLocation(item)}</p>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
