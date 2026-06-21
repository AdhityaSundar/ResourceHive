"use client";

import Link from "next/link";
import { useMemo, type CSSProperties } from "react";
import { useEffect, useState, useTransition } from "react";
import { ArrowRight, LoaderCircle, Search } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { categoryAccent } from "@/lib/category-accent";
import { localizeCategory, localizeNeed } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Resource, ResourceNeed, ResourceSearchResult } from "@/lib/types";

const needs: ResourceNeed[] = ["food", "shelter", "jobs", "healthcare", "education"];

function HexGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("fill-current", className)}>
      <path d="M6 2h12l6 10-6 10H6L0 12z" />
    </svg>
  );
}

export function HeroSearchExperience({
  initialResources,
  cityOptions,
}: {
  initialResources: Resource[];
  cityOptions: string[];
}) {
  const { locale, messages } = useLocale();
  const { saved } = useAuth();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState<ResourceNeed[]>(["food"]);
  const [results, setResults] = useState<Resource[]>(initialResources.slice(0, 4));
  const [isPending, startSearchTransition] = useTransition();
  const debouncedQuery = useDebouncedValue(query, 250);

  // Surface the user's hearted favorites first, then fill with search results.
  const displayResults = useMemo(() => {
    const savedIds = new Set(saved.map((item) => item.resourceId));
    const byId = new Map(initialResources.map((resource) => [resource.id, resource]));
    const favorites = saved
      .map((item) => byId.get(item.resourceId))
      .filter((resource): resource is Resource => Boolean(resource));
    const rest = results.filter((resource) => !savedIds.has(resource.id));
    return [...favorites, ...rest].slice(0, 6);
  }, [saved, initialResources, results]);

  const resourceSearchHref = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (city) params.set("city", city);
    selectedNeeds.forEach((need) => params.append("need", need));
    const serialized = params.toString();
    return serialized ? `/resources?${serialized}` : "/resources";
  }, [city, query, selectedNeeds]);

  useEffect(() => {
    const controller = new AbortController();

    startSearchTransition(async () => {
      try {
        const params = new URLSearchParams();
        if (debouncedQuery) params.set("query", debouncedQuery);
        if (city) params.set("city", city);
        selectedNeeds.forEach((need) => params.append("need", need));
        params.set("pageSize", "4");

        const response = await fetch(`/api/resources?${params.toString()}`, { signal: controller.signal });
        const data = (await response.json()) as ResourceSearchResult;
        setResults(data.items);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
        }
      }
    });

    return () => controller.abort();
  }, [city, debouncedQuery, selectedNeeds, startSearchTransition]);

  return (
    <div className="panel-amber rounded-[36px] p-6 sm:p-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
            <HexGlyph className="size-3 opacity-80" />
            {messages.common.searchNeeds}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-teal-500" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={messages.heroSearch.placeholder}
              aria-label={messages.heroSearch.placeholder}
              className="h-16 rounded-full border-[var(--border)] bg-white/80 pl-14 text-base text-ink shadow-e2 focus:border-teal-300 focus:ring-4 focus:ring-teal-200/50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              aria-label={messages.common.allLocations}
              className="h-14 rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm text-ink outline-none transition focus:border-teal-300 focus:ring-4 focus:ring-teal-200/50"
            >
              <option value="">{messages.common.allLocations}</option>
              {cityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {isPending ? (
              <div className="inline-flex h-14 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-teal-600">
                <LoaderCircle className="size-5 animate-spin" />
              </div>
            ) : null}
          </div>

          <div role="group" aria-label={messages.common.searchNeeds} className="flex flex-wrap justify-center gap-2.5">
            {needs.map((need) => {
              const active = selectedNeeds.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setSelectedNeeds((current) =>
                      active ? current.filter((item) => item !== need) : [...current, need],
                    )
                  }
                  className={cn(
                    "interactive-glow inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-teal-700 text-white shadow-e2"
                      : "border border-teal-200 bg-white/70 text-teal-700 hover:bg-teal-50",
                  )}
                >
                  <HexGlyph className={cn("size-2.5", active ? "opacity-90" : "opacity-60")} />
                  {localizeNeed(need, locale)}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={resourceSearchHref}
              className="interactive-glow inline-flex h-14 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 text-base font-semibold text-white shadow-e2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-600"
            >
              {messages.common.exploreResults}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-4xl gap-4 sm:grid-cols-2" aria-live="polite">
          {displayResults.length > 0 ? (
            displayResults.map((resource) => (
              <Link
                key={resource.id}
                href={`/resource/${resource.id}`}
                style={{ "--accent": categoryAccent(resource.category) } as CSSProperties}
                className="card-steel group relative block overflow-hidden rounded-[28px] p-5 transition hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
                  style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
                />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-ink">{resource.name}</p>
                    <p className="mt-1 text-sm text-muted">{resource.city}</p>
                    <p className="mt-3 max-w-md text-sm leading-6 text-muted">{resource.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="open" hex>{messages.common.open}</Badge>
                      <Badge tone="free">{messages.common.free}</Badge>
                      {resource.services.slice(0, 2).map((service) => (
                        <Badge key={service} tone="neutral">{service}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge tone="teal">{localizeCategory(resource.category, locale)}</Badge>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-teal-200 bg-white/60 p-6 text-center text-sm text-muted sm:col-span-2">
              {messages.common.noHeroResults}
            </div>
          )}
        </div>
    </div>
  );
}
