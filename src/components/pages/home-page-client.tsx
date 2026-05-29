"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { HeroSearchExperience } from "@/components/resources/hero-search-experience";
import { RecommendationBuilder } from "@/components/resources/recommendation-builder";
import { BrandMark } from "@/components/site/brand-mark";
import { EmergencyBanner } from "@/components/site/emergency-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { resourceCategories } from "@/lib/categories";
import { localizeCategory, localizeCategoryDescription } from "@/lib/i18n";
import type { Resource } from "@/lib/types";

export function HomePageClient({
  resources,
  cityOptions,
  partnerCount,
}: {
  resources: Resource[];
  cityOptions: string[];
  partnerCount: number;
}) {
  const { locale, messages } = useLocale();
  const featuredResources = resources.slice(0, 3);

  return (
    <div className="pb-20">
      <EmergencyBanner />

      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.16),transparent_32%),radial-gradient(circle_at_80%_16%,rgba(14,165,233,0.14),transparent_26%),radial-gradient(circle_at_58%_72%,rgba(250,204,21,0.12),transparent_28%)]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal className="max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/50 bg-white/60 px-4 py-2 text-sm font-semibold text-emerald-600 shadow-[0_18px_50px_rgba(14,165,233,0.12)] backdrop-blur">
              <BrandMark className="size-10 sm:size-11" priority />
              {messages.home.heroBadge}
            </div>
            <h1 className="mt-8 max-w-4xl text-balance text-5xl font-black leading-[0.95] tracking-tight text-[#102a2a] sm:text-6xl lg:text-7xl">
              {messages.home.heroTitleStart}{" "}
              <span className="bg-[linear-gradient(135deg,#16a34a,#0ea5e9)] bg-clip-text text-transparent">
                {messages.home.heroTitleAccent}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#526d72] sm:text-lg">
              {messages.home.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/resources">
                <Button size="lg" className="gap-2">
                  {messages.home.browseDirectory}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/map">
                <Button variant="secondary" size="lg">
                  {messages.common.openMap}
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="relative">
            <div className="glass-panel rounded-[36px] border border-white/40 p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {featuredResources.map((resource) => (
                  <div key={resource.id} className="rounded-[28px] border border-white/40 bg-white/60 p-4 shadow-[0_20px_40px_rgba(14,165,233,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{messages.home.previewLabel}</p>
                    <h3 className="mt-3 text-lg font-bold text-[#102a2a]">{resource.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#526d72]">{resource.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{messages.common.open}</span>
                      <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">{messages.common.free}</span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-[#647b80]">{resource.city}, {resource.state}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="relative mx-auto mt-10 max-w-7xl">
          <HeroSearchExperience initialResources={resources} cityOptions={cityOptions} />
        </Reveal>
      </section>

      <Reveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: messages.home.statsResources, value: `${resources.length}` },
            { label: messages.home.statsCategories, value: `${new Set(resources.map((item) => item.category)).size}` },
            { label: messages.home.statsPartners, value: `${partnerCount}` },
          ].map((item) => (
            <div key={item.label} className="glass-panel rounded-[28px] p-5 transition hover:-translate-y-1">
              <div className="text-3xl font-black text-[#102a2a]">{item.value}</div>
              <p className="mt-1 text-sm text-[#647b80]">{item.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={messages.home.categoriesEyebrow}
          title={messages.home.categoriesTitle}
          description={messages.home.categoriesDescription}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resourceCategories.map((item) => (
            <div key={item.category} className="glass-panel relative overflow-hidden rounded-[32px] p-6 transition hover:-translate-y-1">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_32%)]" />
              <div className="relative">
                <div className="inline-flex rounded-2xl border border-white/50 bg-white/65 p-3 text-sky-600 shadow-[0_18px_40px_rgba(14,165,233,0.08)]">
                  <item.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-[#102a2a]">{localizeCategory(item.category, locale)}</h3>
                <p className="mt-3 text-sm leading-7 text-[#526d72]">
                  {localizeCategoryDescription(item.category, locale)}
                </p>
                <Link href={`/resources?category=${item.category}`} className="mt-5 inline-flex text-sm font-semibold text-emerald-600 transition hover:text-sky-600">
                  {messages.home.exploreCategory} {localizeCategory(item.category, locale)}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={messages.home.featuredResourcesEyebrow}
          title={messages.home.featuredResourcesTitle}
          description={messages.home.featuredResourcesDescription}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredResources.map((resource) => (
            <div key={resource.id} className="glass-panel rounded-[32px] p-6 transition hover:-translate-y-1">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-600">
                {localizeCategory(resource.category, locale)}
              </p>
              <h3 className="mt-4 text-2xl font-bold text-[#102a2a]">{resource.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[#526d72]">{resource.description}</p>
              <p className="mt-6 text-sm font-medium text-[#647b80]">{resource.city}, {resource.state}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={messages.home.strategyEyebrow}
          title={messages.home.strategyTitle}
          description={messages.home.strategyDescription}
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            { title: messages.home.execSummary, text: messages.home.execSummaryText },
            { title: messages.home.marketUsers, text: messages.home.marketUsersText },
            { title: messages.home.growthFeatures, text: messages.home.growthFeaturesText },
          ].map((item) => (
            <div key={item.title} className="glass-panel rounded-[30px] p-6 transition hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-[#102a2a]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#526d72]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <RecommendationBuilder />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-[36px] p-8 transition sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
                {messages.home.volunteerEyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-black text-[#102a2a]">{messages.home.volunteerTitle}</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#526d72]">
                {messages.home.volunteerDescription}
              </p>
            </div>
            <div className="grid gap-4">
              {[messages.home.volunteerPoint1, messages.home.volunteerPoint2, messages.home.volunteerPoint3].map((item) => (
                <div key={item} className="rounded-[28px] border border-white/40 bg-white/55 p-5">
                  <p className="text-sm leading-7 text-[#264653]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
