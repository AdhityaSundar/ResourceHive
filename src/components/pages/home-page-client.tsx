"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { GlobeHero } from "@/components/hero/globe-hero";
import { CountUp } from "@/components/home/count-up";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedResourceCard } from "@/components/home/featured-resource-card";
import { VolunteerDonate } from "@/components/home/volunteer-donate";
import { HeroSearchExperience } from "@/components/resources/hero-search-experience";
import { HoneycombDivider } from "@/components/site/honeycomb-divider";
import { SectionHeading } from "@/components/site/section-heading";
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
  const { messages } = useLocale();
  const featuredResources = resources.slice(0, 3);

  const stats = [
    { label: messages.home.statsResources, value: resources.length },
    { label: messages.home.statsCategories, value: new Set(resources.map((item) => item.category)).size },
    { label: messages.home.statsPartners, value: partnerCount },
  ];

  return (
    <div className="pb-20">
      <GlobeHero />

      <Reveal className="relative mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroSearchExperience initialResources={resources} cityOptions={cityOptions} />
      </Reveal>

      <Reveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="glass-panel rounded-[28px] p-6 transition hover:-translate-y-1 hover:shadow-e4">
              <div className="font-display text-4xl font-semibold text-ink">
                <CountUp value={item.value} />
              </div>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <HoneycombDivider />

      <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={messages.home.categoriesEyebrow}
          title={messages.home.categoriesTitle}
          description={messages.home.categoriesDescription}
        />
        <FeaturedCategories />
      </Reveal>

      <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={messages.home.featuredResourcesEyebrow}
          title={messages.home.featuredResourcesTitle}
          description={messages.home.featuredResourcesDescription}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredResources.map((resource) => (
            <FeaturedResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </Reveal>

      <HoneycombDivider />

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

      <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <VolunteerDonate />
      </Reveal>
    </div>
  );
}
