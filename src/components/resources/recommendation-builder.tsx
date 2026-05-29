"use client";

import { useState } from "react";
import { LoaderCircle, WandSparkles } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { ResourceCard } from "@/components/resources/resource-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          <div className="rounded-2xl border border-white/50 bg-white/60 p-3 text-emerald-600">
            <WandSparkles className="size-5" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#102a2a]">{messages.recommendation.title}</h3>
            <p className="mt-1 text-sm text-[#526d72]">{messages.recommendation.description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
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
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
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

        <div className="mt-6">
          <Input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder={messages.common.preferredCity}
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

      <div className="space-y-5">
        {result ? (
          <>
            <div className="glass-panel rounded-[30px] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
                {messages.common.recommendationSummary}
              </p>
              <p className="mt-3 text-lg leading-8 text-[#264653]">{recommendationSummary}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {result.matches.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </>
        ) : (
          <div className="glass-panel flex min-h-[360px] items-center justify-center rounded-[30px] p-6 text-center text-[#526d72]">
            {messages.common.chooseNeedsPrompt}
          </div>
        )}
      </div>
    </section>
  );
}

