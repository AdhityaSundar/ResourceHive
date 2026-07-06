"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Grid2X2, List, LoaderCircle } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { LoadingCard } from "@/components/resources/loading-card";
import { ResourceCard } from "@/components/resources/resource-card";
import { ResourceFiltersPanel } from "@/components/resources/resource-filters";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Resource, ResourceFilters, ResourceSearchResult } from "@/lib/types";

export function ResourceDirectoryClient({
  initialResult,
  initialResources,
  initialCategory = "",
  initialCity = "",
  initialQuery = "",
  initialNeeds = [],
}: {
  initialResult: ResourceSearchResult & { filters?: { categories: string[]; cities: string[] } };
  initialResources: Resource[];
  initialCategory?: string;
  initialCity?: string;
  initialQuery?: string;
  initialNeeds?: string[];
}) {
  const { messages } = useLocale();
  const { saved } = useAuth();
  const [filters, setFilters] = useState<ResourceFilters>({
    query: initialQuery,
    category: initialCategory,
    city: initialCity,
    needs: initialNeeds as ResourceFilters["needs"],
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [result, setResult] = useState(initialResult);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isPending, startSearchTransition] = useTransition();
  const debouncedQuery = useDebouncedValue(filters.query, 250);

  // Float the user's hearted favorites to the top. With no active filters we
  // also pull in favorites that aren't on the current page (so they always lead
  // the default view); when filtering, we only reorder what already matched.
  const hasFilters = Boolean(
    filters.query || filters.category || filters.city || filters.needs?.length,
  );
  const displayItems = useMemo(() => {
    const savedIds = new Set(saved.map((item) => item.resourceId));
    if (savedIds.size === 0) return result.items;

    if (hasFilters) {
      const favorites = result.items.filter((resource) => savedIds.has(resource.id));
      const rest = result.items.filter((resource) => !savedIds.has(resource.id));
      return [...favorites, ...rest];
    }

    const byId = new Map(initialResources.map((resource) => [resource.id, resource]));
    const favorites = saved
      .map((item) => byId.get(item.resourceId))
      .filter((resource): resource is Resource => Boolean(resource));
    const favIds = new Set(favorites.map((resource) => resource.id));
    const rest = result.items.filter((resource) => !favIds.has(resource.id));
    return [...favorites, ...rest];
  }, [saved, result.items, hasFilters, initialResources]);

  useEffect(() => {
    const controller = new AbortController();

    startSearchTransition(async () => {
      try {
        const params = new URLSearchParams();
        if (debouncedQuery) params.set("query", debouncedQuery);
        if (filters.category) params.set("category", filters.category);
        if (filters.city) params.set("city", filters.city);
        (filters.needs ?? []).forEach((need) => params.append("need", need));
        params.set("page", "1");
        params.set("pageSize", String(result.pageSize || 9));

        const response = await fetch(`/api/resources?${params.toString()}`, { signal: controller.signal });
        const data = (await response.json()) as ResourceSearchResult & {
          filters: { categories: string[]; cities: string[] };
        };
        setResult(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResult((current) => ({ ...current, items: [], total: 0, hasMore: false }));
        }
      }
    });

    return () => controller.abort();
  }, [debouncedQuery, filters.category, filters.city, filters.needs, result.pageSize, startSearchTransition]);

  async function loadMore() {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("query", debouncedQuery);
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    (filters.needs ?? []).forEach((need) => params.append("need", need));
    params.set("page", String(result.page + 1));
    params.set("pageSize", String(result.pageSize));

    setLoadingMore(true);
    const response = await fetch(`/api/resources?${params.toString()}`);
    const data = (await response.json()) as ResourceSearchResult & {
      filters: { categories: string[]; cities: string[] };
    };
    setResult((current) => ({
      ...data,
      items: [...current.items, ...data.items],
    }));
    setLoadingMore(false);
  }

  return (
    <div className="space-y-6">
      <ResourceFiltersPanel
        filters={filters}
        onChange={setFilters}
        resources={initialResources}
        options={result.filters}
      />
      <div className="flex items-center justify-between text-sm text-teal-50/70">
        <p>
          {result.total} {messages.resourcesPage.matched} Â· {result.counts.totalResources} {messages.resourcesPage.totalInDirectory}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label={messages.common.viewGrid}
            className={`interactive-glow rounded-full p-2 transition ${
              view === "grid"
                ? "bg-white/15 text-white"
                : "bg-white/5 text-teal-50/55 hover:text-white"
            }`}
          >
            <Grid2X2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-label={messages.common.viewList}
            className={`interactive-glow rounded-full p-2 transition ${
              view === "list"
                ? "bg-white/15 text-white"
                : "bg-white/5 text-teal-50/55 hover:text-white"
            }`}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {isPending && result.items.length === 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      ) : displayItems.length > 0 ? (
        <div className={view === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
          {displayItems.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="rounded-[30px] border border-white/12 bg-white/[0.05] p-8 text-center text-teal-50/75 backdrop-blur">
          {messages.common.noResultsFound}
        </div>
      )}

      {result.hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="interactive-glow inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--honey-300),var(--honey-500))] px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
          >
            {loadingMore ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {messages.common.loadMoreResources}
          </button>
        </div>
      ) : null}
    </div>
  );
}

