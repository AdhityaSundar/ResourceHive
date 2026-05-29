"use client";

import { Search } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { localizeCategory, localizeNeed } from "@/lib/i18n";
import type { Resource, ResourceFilters, ResourceNeed } from "@/lib/types";

const needOptions: ResourceNeed[] = ["food", "shelter", "jobs", "healthcare", "education"];

export function ResourceFiltersPanel({
  filters,
  onChange,
  resources,
  options,
}: {
  filters: ResourceFilters;
  onChange: (filters: ResourceFilters) => void;
  resources: Resource[];
  options?: {
    categories: string[];
    cities: string[];
  };
}) {
  const { locale, messages } = useLocale();
  const uniqueCities = options?.cities ?? Array.from(new Set(resources.map((resource) => resource.city))).sort();
  const categories =
    options?.categories ?? Array.from(new Set(resources.map((resource) => resource.category))).sort();
  const suggestions = resources
    .filter((resource) => resource.name.toLowerCase().includes(filters.query.toLowerCase()) && filters.query)
    .slice(0, 5);

  return (
    <div className="glass-panel rounded-[30px] p-5">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_0.8fr_0.8fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-4 size-4 text-[#9c7aaa]" />
          <Input
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder={messages.common.searchByOrgServiceNeed}
            className="pl-11"
          />
          {filters.query && suggestions.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-3xl border border-white/50 bg-white/88 p-2 shadow-[0_24px_60px_rgba(14,165,233,0.12)] backdrop-blur">
              {suggestions.map((resource) => (
                <button
                  key={resource.id}
                  type="button"
                  onClick={() => onChange({ ...filters, query: resource.name })}
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm transition hover:bg-sky-50/70"
                >
                  <span className="font-semibold text-[#102a2a]">{resource.name}</span>
                  <span className="text-[#647b80]">{resource.city}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <Select value={filters.category} onChange={(event) => onChange({ ...filters, category: event.target.value })}>
          <option value="">{messages.common.allCategories}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {localizeCategory(category, locale)}
            </option>
          ))}
        </Select>

        <Select value={filters.city} onChange={(event) => onChange({ ...filters, city: event.target.value })}>
          <option value="">{messages.common.allLocations}</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {needOptions.map((need) => {
          const active = filters.needs?.includes(need) ?? false;
          return (
            <button
              key={need}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  needs: active
                    ? (filters.needs ?? []).filter((item) => item !== need)
                    : [...(filters.needs ?? []), need],
                })
              }
              className={`interactive-glow rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[linear-gradient(135deg,#16a34a,#0ea5e9)] text-white"
                  : "bg-white/55 text-[#315963] hover:bg-white/75"
              }`}
            >
              {localizeNeed(need, locale)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

