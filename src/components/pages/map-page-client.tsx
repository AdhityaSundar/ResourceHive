"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { MapViewClient } from "@/components/resources/map-view-client";
import { SectionHeading } from "@/components/site/section-heading";
import type { Resource } from "@/lib/types";

export function MapPageClient({ resources }: { resources: Resource[] }) {
  const { messages } = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={messages.mapPage.eyebrow}
        title={messages.mapPage.title}
        description={messages.mapPage.description}
      />
      <div className="mt-10">
        <MapViewClient resources={resources} />
      </div>
    </div>
  );
}
