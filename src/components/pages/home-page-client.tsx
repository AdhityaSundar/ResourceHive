"use client";

import Link from "next/link";

import { useLocale } from "@/components/providers/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { GlobeHero } from "@/components/hero/globe-hero";
import { HeroSearchExperience } from "@/components/resources/hero-search-experience";
import { RecommendationBuilder } from "@/components/resources/recommendation-builder";
import { SectionHeading } from "@/components/site/section-heading";
import { resourceCategories } from "@/lib/categories";
import { localizeCategory, localizeCategoryDescription } from "@/lib/i18n";
import { buildMarkersFromResources } from "@/lib/geo";
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
  const markers = buildMarkersFromResources(resources);

  return (
    <div className="pb-20">
      <GlobeHero markers={markers} />

      <Reveal className="relative mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroSearchExperience initialResources={resources} cityOptions={cityOptions} />
      </Reveal>

      <Reveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: messages.home.statsResources, value: `${resources.length}` },
            { label: messages.home.statsCategories, value: `${new Set(resources.map((item) => item.category)).size}` },
            { label: messages.home.statsPartners, value: `${partnerCount}` },
          ].map((item) => (
            <div key={item.label} className="glass-panel rounded-[28px] p-5 transition hover:-translate-y-1">
              <div className="font-display text-3xl font-semibold text-ink">{item.value}</div>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,124,134,0.08),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(224,133,12,0.08),transparent_32%)]" />
              <div className="relative">
                <div className="inline-flex rounded-2xl border border-white/50 bg-white/65 p-3 text-teal-600 shadow-[0_18px_40px_rgba(14,124,134,0.08)]">
                  <item.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{localizeCategory(item.category, locale)}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {localizeCategoryDescription(item.category, locale)}
                </p>
                <Link href={`/resources?category=${item.category}`} className="mt-5 inline-flex text-sm font-semibold text-teal-600 transition hover:text-honey-600">
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
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-teal-600">
                {localizeCategory(resource.category, locale)}
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{resource.name}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{resource.description}</p>
              <p className="mt-6 text-sm font-medium text-ink-soft">{resource.city}, {resource.state}</p>
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
              <h3 className="font-display text-2xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{item.text}</p>
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
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-600">
                {messages.home.volunteerEyebrow}
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold text-ink">{messages.home.volunteerTitle}</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
                {messages.home.volunteerDescription}
              </p>
            </div>
            <div className="grid gap-4">
              {[messages.home.volunteerPoint1, messages.home.volunteerPoint2, messages.home.volunteerPoint3].map((item) => (
                <div key={item} className="rounded-[28px] border border-white/40 bg-white/55 p-5">
                  <p className="text-sm leading-7 text-ink-soft">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
