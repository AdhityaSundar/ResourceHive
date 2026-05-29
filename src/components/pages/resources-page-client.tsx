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
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
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
  );
}
