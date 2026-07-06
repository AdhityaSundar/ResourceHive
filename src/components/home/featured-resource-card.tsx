"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  HeartPulse,
  Home,
  LifeBuoy,
  MapPin,
  Scale,
  Soup,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { categoryAccent } from "@/lib/category-accent";
import { localizeCategory } from "@/lib/i18n";
import type { Resource } from "@/lib/types";

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

export function FeaturedResourceCard({ resource }: { resource: Resource }) {
  const { locale, messages } = useLocale();
  const accent = categoryAccent(resource.category);
  const Icon = CATEGORY_ICON[resource.category] ?? LifeBuoy;

  return (
    <Link
      href={`/resource/${resource.id}`}
      style={{ "--accent": accent } as CSSProperties}
      className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border border-white/[0.14] bg-white/[0.055] p-6 shadow-[0_18px_44px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-white/25 hover:bg-white/[0.09]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(158deg, color-mix(in srgb, var(--accent) 24%, transparent), transparent 55%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ background: "var(--accent)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: "linear-gradient(90deg, var(--accent), transparent 78%)" }}
      />

      <div className="relative flex items-center justify-between gap-3">
        <span className="relative grid size-12 shrink-0 place-items-center">
          <span className="absolute inset-0 hex-clip" style={{ background: "var(--accent)" }} />
          <span className="absolute inset-[2px] hex-clip bg-[#0c2b31]" />
          <Icon className="relative size-5" style={{ color: "var(--accent)" }} strokeWidth={2} />
        </span>
        <div className="flex gap-2">
          <Badge tone="open">{messages.common.open}</Badge>
          <Badge tone="free">{messages.common.free}</Badge>
        </div>
      </div>

      <p className="relative mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
        {localizeCategory(resource.category, locale)}
      </p>
      <h3 className="relative mt-1.5 text-pretty font-display text-2xl font-semibold leading-tight text-white">
        {resource.name}
      </h3>

      {resource.description ? (
        <p className="relative mt-3 flex-1 text-sm leading-7 text-white/75 line-clamp-3">
          {resource.description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="relative mt-5 flex items-center gap-2 text-sm font-medium text-white/80">
        <MapPin className="size-4 shrink-0 text-teal-300" />
        {resource.city}
        {resource.state ? `, ${resource.state}` : ""}
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-white/12 pt-4">
        <div className="flex flex-wrap gap-2">
          {resource.services.slice(0, 2).map((service) => (
            <span
              key={service}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80"
            >
              {service}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-200 transition-all group-hover:gap-2">
          {messages.common.viewDetails}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
