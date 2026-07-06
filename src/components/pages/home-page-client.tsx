"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { GlobeHero } from "@/components/hero/globe-hero";
import { CountUp } from "@/components/home/count-up";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedResourceCard } from "@/components/home/featured-resource-card";
import { HowItWorks } from "@/components/home/how-it-works";
import { VolunteerDonate } from "@/components/home/volunteer-donate";
import { HeroSearchExperience } from "@/components/resources/hero-search-experience";
import { HoneycombDivider } from "@/components/site/honeycomb-divider";
import { SectionHeading } from "@/components/site/section-heading";
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
  const { messages } = useLocale();
  const markers = buildMarkersFromResources(resources);

  // Feature three resources from distinct categories so the cards lead with a
  // colourful mix rather than three of the same colour.
  const featuredResources = (() => {
    const seen = new Set<string>();
    const picks: Resource[] = [];
    for (const resource of resources) {
      if (picks.length >= 3) break;
      if (seen.has(resource.category)) continue;
      seen.add(resource.category);
      picks.push(resource);
    }
    return picks.length >= 3 ? picks : resources.slice(0, 3);
  })();

  const stats = [
    { label: messages.home.statsResources, value: resources.length },
    { label: messages.home.statsCategories, value: new Set(resources.map((item) => item.category)).size },
    { label: messages.home.statsPartners, value: partnerCount },
  ];

  return (
    <div className="pb-20">
      <GlobeHero markers={markers} />

      <Reveal className="relative mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroSearchExperience initialResources={resources} cityOptions={cityOptions} />
      </Reveal>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.08} className="h-full">
              <div className="glass-panel h-full rounded-[28px] p-6 ease-[cubic-bezier(0.22,1,0.36,1)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-e4">
                <div className="font-display text-4xl font-semibold text-ink">
                  <CountUp value={item.value} />
                </div>
                <p className="mt-1 text-sm text-muted">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

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
        <HowItWorks />
      </Reveal>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[40px] bg-teal-900 p-7 sm:p-10 lg:p-12">
          <div className="honeycomb-texture-dark pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-5%,rgba(14,124,134,0.4),transparent_60%),radial-gradient(circle_at_90%_120%,rgba(224,133,12,0.16),transparent_50%)]" />
          <div className="relative">
            <Reveal>
              <SectionHeading
                dark
                eyebrow={messages.home.featuredResourcesEyebrow}
                title={messages.home.featuredResourcesTitle}
                description={messages.home.featuredResourcesDescription}
              />
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {featuredResources.map((resource, index) => (
                <Reveal key={resource.id} delay={index * 0.1} className="h-full">
                  <FeaturedResourceCard resource={resource} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HoneycombDivider />

      <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <VolunteerDonate />
      </Reveal>
    </div>
  );
}
