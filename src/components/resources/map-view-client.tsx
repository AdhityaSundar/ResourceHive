"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useLocale } from "@/components/providers/locale-provider";
import { GoogleResourceMap } from "@/components/maps/google-resource-map";
import { ResourceFiltersPanel } from "@/components/resources/resource-filters";
import { localizeCategory } from "@/lib/i18n";
import type { Resource, ResourceFilters } from "@/lib/types";
import { formatLocation } from "@/lib/utils";

export function MapViewClient({ resources }: { resources: Resource[] }) {
  const { locale, messages } = useLocale();
  const [filters, setFilters] = useState<ResourceFilters>({ query: "", category: "", city: "", needs: [] });
  const [activeId, setActiveId] = useState(resources[0]?.id ?? "");

  const filteredResources = useMemo(
    () =>
      resources.filter((resource) => {
        const matchesQuery =
          !filters.query ||
          `${resource.name} ${resource.description} ${resource.tags.join(" ")}`
            .toLowerCase()
            .includes(filters.query.toLowerCase());
        const matchesCategory = !filters.category || resource.category === filters.category;
        const matchesCity = !filters.city || resource.city === filters.city;
        return matchesQuery && matchesCategory && matchesCity;
      }),
    [filters, resources],
  );

  const resolvedActiveId = useMemo(() => {
    if (activeId && filteredResources.some((resource) => resource.id === activeId)) {
      return activeId;
    }

    return filteredResources[0]?.id ?? "";
  }, [activeId, filteredResources]);

  const activeResource =
    filteredResources.find((resource) => resource.id === resolvedActiveId) ?? filteredResources[0] ?? null;
  const activeLocation = activeResource ? formatLocation(activeResource) : "";

  return (
    <div className="space-y-6">
      <ResourceFiltersPanel filters={filters} onChange={setFilters} resources={resources} />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="glass-panel min-h-[420px] overflow-hidden rounded-[32px] p-3 sm:min-h-[560px]">
          <GoogleResourceMap
            resources={filteredResources}
            activeId={activeResource?.id}
            onActiveChange={setActiveId}
            className="h-[420px] sm:h-[560px]"
          />
        </div>

        <div className="space-y-4">
          {activeResource ? (
            <>
              <div className="glass-panel rounded-[30px] p-6">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-fuchsia-500">
                  {messages.common.selectedResource}
                </p>
                <h2 className="mt-4 text-2xl font-bold text-[#2a1833]">{activeResource.name}</h2>
                {activeResource.description ? (
                  <p className="mt-3 text-sm leading-7 text-[#7c6b88]">
                    {activeResource.description}
                  </p>
                ) : null}
                {activeResource.info && activeResource.info !== activeResource.description ? (
                  <p className="mt-3 text-sm leading-7 text-[#7c6b88]">
                    {activeResource.info}
                  </p>
                ) : null}
                {activeLocation ? (
                  <p className="mt-3 text-sm leading-7 text-[#7c6b88]">{activeLocation}</p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/resource/${activeResource.id}`}
                    className="interactive-glow inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#a855f7,#ec4899)] px-5 text-sm font-semibold text-white"
                  >
                    {messages.common.viewDetails}
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                {filteredResources.slice(0, 4).map((resource) => (
                  <button
                    key={resource.id}
                    type="button"
                    onClick={() => setActiveId(resource.id)}
                    className={`interactive-glow flex w-full items-start justify-between rounded-[24px] border px-4 py-4 text-left transition ${
                      resource.id === activeResource.id
                        ? "border-fuchsia-200 bg-fuchsia-50/80"
                        : "border-white/40 bg-white/55 hover:bg-white/75"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-[#2a1833]">{resource.name}</p>
                      <p className="mt-1 text-sm text-[#8a7696]">
                        {[localizeCategory(resource.category, locale), formatLocation(resource)].filter(Boolean).join(" | ")}
                      </p>
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#6b5177]">
                      {messages.common.select}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-[30px] p-6 text-[#7c6b88]">
              {messages.common.noMapResults}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
