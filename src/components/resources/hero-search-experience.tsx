"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useEffect, useState, useTransition } from "react";
import { ArrowRight, LoaderCircle, Search } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { localizeCategory, localizeNeed } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Resource, ResourceNeed, ResourceSearchResult } from "@/lib/types";

const needs: ResourceNeed[] = ["food", "shelter", "jobs", "healthcare", "education"];

export function HeroSearchExperience({
  initialResources,
  cityOptions,
}: {
  initialResources: Resource[];
  cityOptions: string[];
}) {
  const { locale, messages } = useLocale();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState<ResourceNeed[]>(["food"]);
  const [results, setResults] = useState<Resource[]>(initialResources.slice(0, 4));
  const [isPending, startSearchTransition] = useTransition();
  const debouncedQuery = useDebouncedValue(query, 250);

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
    <div className="glass-panel rounded-[36px] border border-white/40 p-6 shadow-[0_30px_80px_rgba(168,85,247,0.12)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.88fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-500">
            {messages.common.searchNeeds}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#9c7aaa]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={messages.heroSearch.placeholder}
              className="h-16 rounded-full border-white/45 bg-white/60 pl-14 text-base shadow-[0_10px_30px_rgba(168,85,247,0.08)]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="h-14 rounded-full border border-white/45 bg-white/60 px-5 text-sm text-[#372042] outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-200/50"
            >
              <option value="">{messages.common.allLocations}</option>
              {cityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {isPending ? (
              <div className="inline-flex h-14 items-center justify-center rounded-full border border-white/45 bg-white/60 px-5 text-fuchsia-500">
                <LoaderCircle className="size-5 animate-spin" />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            {needs.map((need) => {
              const active = selectedNeeds.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  onClick={() =>
                    setSelectedNeeds((current) =>
                      active ? current.filter((item) => item !== need) : [...current, need],
                    )
                  }
                  className={`interactive-glow rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[linear-gradient(135deg,#a855f7,#ec4899)] text-white"
                      : "bg-white/55 text-[#6b5177] hover:bg-white/75"
                  }`}
                >
                  {localizeNeed(need, locale)}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={resourceSearchHref}
              className={cn(
                "interactive-glow inline-flex h-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#a855f7,#ec4899)] px-6 text-base font-semibold text-white shadow-[0_14px_36px_rgba(168,85,247,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]",
                "gap-2",
              )}
            >
              {messages.common.exploreResults}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/map"
              className="interactive-glow inline-flex h-14 items-center justify-center rounded-full bg-white/55 px-6 text-base font-semibold text-[#4c3559] ring-1 ring-white/50 backdrop-blur transition-all duration-200 hover:scale-[1.01] hover:bg-white/75"
            >
              {messages.common.openMap}
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((resource) => (
              <Link
                key={resource.id}
                href={`/resource/${resource.id}`}
                className="glass-panel block rounded-[28px] border border-white/45 p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(168,85,247,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-[#2a1833]">{resource.name}</p>
                    <p className="mt-1 text-sm text-[#8a7696]">{resource.city}</p>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[#7c6b88]">{resource.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className="border-emerald-100 bg-emerald-50/80 text-emerald-600">{messages.common.open}</Badge>
                      <Badge className="border-amber-100 bg-amber-50/80 text-amber-600">{messages.common.free}</Badge>
                      {resource.services.slice(0, 2).map((service) => (
                        <Badge key={service}>{service}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className="border-fuchsia-200 bg-fuchsia-50/80 text-fuchsia-500">
                    {localizeCategory(resource.category, locale)}
                  </Badge>
                </div>
              </Link>
            ))
          ) : (
            <div className="glass-panel rounded-[28px] border border-dashed border-fuchsia-200 bg-white/50 p-6 text-sm text-[#7c6b88]">
              {messages.common.noHeroResults}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
