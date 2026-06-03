"use client";

import { useState } from "react";
import { LoaderCircle, WandSparkles } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { ResourceCard } from "@/components/resources/resource-card";
import { Button } from "@/components/ui/button";
import { HexIcon } from "@/components/ui/hex-icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatLocalizedMessage, localizeNeed } from "@/lib/i18n";
import type { RecommendationResponse, ResourceNeed } from "@/lib/types";

const needs: ResourceNeed[] = ["food", "shelter", "jobs", "healthcare", "education"];

export function RecommendationBuilder() {
  const { locale, messages } = useLocale();
  const [selectedNeeds, setSelectedNeeds] = useState<ResourceNeed[]>(["food", "shelter"]);
  const [city, setCity] = useState("Dallas");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  async function submit() {
    setLoading(true);
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ needs: selectedNeeds, city }),
    });
    const data = (await response.json()) as RecommendationResponse;
    setResult(data);
    setLoading(false);
  }

  const localizedNeeds = selectedNeeds.map((need) => localizeNeed(need, locale)).join(" + ");
  const cityFragment = city
    ? formatLocalizedMessage(messages.recommendation.cityFragment, { city })
    : "";
  const recommendationSummary = result
    ? result.matches.length > 0
      ? formatLocalizedMessage(messages.recommendation.summaryFound, {
          needs: localizedNeeds,
          city: cityFragment,
        })
      : formatLocalizedMessage(messages.recommendation.summaryEmpty, {
          needs: localizedNeeds,
          city: cityFragment,
        })
    : "";

  return (
    <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="glass-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <HexIcon icon={WandSparkles} tone="teal" className="size-12" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl font-semibold text-ink">{messages.recommendation.title}</h3>
              <span className="rounded-full border border-honey-200 bg-honey-50 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-honey-700">
                AI
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{messages.recommendation.description}</p>
          </div>
        </div>

        <div role="group" aria-label={messages.recommendation.title} className="mt-6 flex flex-wrap gap-2.5">
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
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-teal-700 text-white shadow-e2"
                    : "border border-teal-200 bg-white/70 text-teal-700 hover:bg-teal-50",
                )}
              >
                {localizeNeed(need, locale)}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <Input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder={messages.common.preferredCity}
            aria-label={messages.common.preferredCity}
          />
        </div>

        <Button
          size="lg"
          className="mt-6 w-full gap-2"
          onClick={submit}
          disabled={loading || selectedNeeds.length === 0}
        >
          {loading ? <LoaderCircle className="size-4 animate-spin" /> : <WandSparkles className="size-4" />}
          {messages.common.getRecommendations}
        </Button>
      </div>

      <div className="space-y-5" aria-live="polite">
        {result ? (
          <>
            <div className="glass-panel rounded-[30px] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">
                {messages.common.recommendationSummary}
              </p>
              <p className="mt-3 text-lg leading-8 text-ink-soft">{recommendationSummary}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {result.matches.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </>
        ) : (
          <div className="glass-panel flex min-h-[360px] items-center justify-center rounded-[30px] p-6 text-center text-muted">
            {messages.common.chooseNeedsPrompt}
          </div>
        )}
      </div>
    </section>
  );
}
