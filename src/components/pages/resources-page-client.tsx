"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { ResourceDirectoryClient } from "@/components/resources/resource-directory-client";
import { SectionHeading } from "@/components/site/section-heading";
import type { Resource, ResourceSearchResult } from "@/lib/types";

export function ResourcesPageClient({
  initialResources,
  initialResult,
  initialCategory,
  initialCity,
  initialQuery,
  initialNeeds,
}: {
  initialResult: ResourceSearchResult & { filters?: { categories: string[]; cities: string[] } };
  initialResources: Resource[];
  initialCategory?: string;
  initialCity?: string;
  initialQuery?: string;
  initialNeeds?: string[];
}) {
  const { messages } = useLocale();

  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-teal-900">
      <div className="honeycomb-texture-dark pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(14,124,134,0.42),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(224,133,12,0.12),transparent_46%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow={messages.resourcesPage.eyebrow}
          title={messages.resourcesPage.title}
          description={messages.resourcesPage.description}
        />
        <div className="mt-10">
          <ResourceDirectoryClient
            initialResources={initialResources}
            initialResult={initialResult}
            initialCategory={initialCategory ?? ""}
            initialCity={initialCity ?? ""}
            initialQuery={initialQuery ?? ""}
            initialNeeds={initialNeeds}
          />
        </div>
      </div>
    </div>
  );
}
