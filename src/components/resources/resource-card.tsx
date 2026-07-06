"use client";

import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Globe,
  HeartPulse,
  Home,
  Heart,
  LifeBuoy,
  Mail,
  MapPin,
  Phone,
  Scale,
  Soup,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { categoryAccent } from "@/lib/category-accent";
import { localizeCategory } from "@/lib/i18n";
import type { Resource } from "@/lib/types";
import { formatLocation, formatPhone, websiteLabel, websiteUrl } from "@/lib/utils";

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

/**
 * Frosted-glass resource card, designed to sit on a DARK surface: translucent
 * white pane + backdrop blur, washed with the category's accent colour, with a
 * matching glow. Light text throughout (AA on the dark glass).
 */
export function ResourceCard({ resource }: { resource: Resource }) {
  const { saved, toggleSaved, recordView } = useAuth();
  const { locale, messages } = useLocale();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const isSaved = saved.some((item) => item.resourceId === resource.id);
  const location = formatLocation(resource);
  const phone = formatPhone(resource.phone);
  const siteHref = websiteUrl(resource.website);
  const accent = categoryAccent(resource.category);
  const Icon = CATEGORY_ICON[resource.category] ?? LifeBuoy;

  function open() {
    recordView(resource.id);
    router.push(`/resource/${resource.id}`);
  }

  return (
    <motion.article
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ "--accent": accent } as CSSProperties}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/[0.14] bg-white/[0.055] p-6 shadow-[0_18px_44px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/25 hover:bg-white/[0.09]"
    >
      {/* accent wash + glow + top edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(158deg, color-mix(in srgb, var(--accent) 24%, transparent), transparent 55%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -top-16 size-44 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ background: "var(--accent)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: "linear-gradient(90deg, var(--accent), transparent 78%)" }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative grid size-11 shrink-0 place-items-center">
            <span className="absolute inset-0 hex-clip" style={{ background: "var(--accent)" }} />
            <span className="absolute inset-[2px] hex-clip bg-[#0c2b31]" />
            <Icon className="relative size-5" style={{ color: "var(--accent)" }} strokeWidth={2} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
            {localizeCategory(resource.category, locale)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(resource.id)}
          aria-pressed={isSaved}
          className="interactive-glow -mr-1 -mt-1 rounded-full border border-white/20 bg-white/10 p-2 text-white/70 transition hover:border-honey-300 hover:text-honey-300"
          aria-label={messages.common.saveResource}
        >
          <Heart className={`size-5 ${isSaved ? "fill-honey-400 text-honey-300" : ""}`} />
        </button>
      </div>

      <h3 className="relative mt-4 text-pretty font-display text-[1.35rem] font-semibold leading-tight text-white">
        {resource.name}
      </h3>

      {resource.description ? (
        <p className="relative mt-3 flex-1 text-sm leading-7 text-white/75 line-clamp-3">
          {resource.description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="relative mt-5 space-y-2.5 text-sm text-white/75">
        {location ? (
          <div className="flex gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-teal-300" />
            <span className="leading-6">{location}</span>
          </div>
        ) : null}
        {phone ? (
          <div className="flex gap-2.5">
            <Phone className="mt-0.5 size-4 shrink-0 text-teal-300" />
            <span className="leading-6">{phone}</span>
          </div>
        ) : null}
        {resource.email ? (
          <div className="flex gap-2.5">
            <Mail className="mt-0.5 size-4 shrink-0 text-teal-300" />
            <span className="break-all leading-6">{resource.email}</span>
          </div>
        ) : null}
        {resource.contactName ? (
          <div className="flex gap-2.5">
            <UserRound className="mt-0.5 size-4 shrink-0 text-teal-300" />
            <span className="leading-6">{resource.contactName}</span>
          </div>
        ) : null}
        {siteHref ? (
          <div className="flex gap-2.5">
            <Globe className="mt-0.5 size-4 shrink-0 text-teal-300" />
            <a
              href={siteHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="break-all font-medium leading-6 text-teal-200 transition hover:text-honey-300"
            >
              {websiteLabel(resource.website)}
            </a>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={open}
        className="relative mt-6 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/15"
      >
        {messages.common.viewDetails}
        <ArrowRight className="size-4 text-teal-300 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </motion.article>
  );
}
