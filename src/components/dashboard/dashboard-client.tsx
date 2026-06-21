"use client";

import Link from "next/link";
import { BellRing, BookOpen, Heart, MapPinned, TrendingUp } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { localizeCategory } from "@/lib/i18n";
import type { Resource } from "@/lib/types";

export function DashboardClient({ resources }: { resources: Resource[] }) {
  const { user, saved, history } = useAuth();
  const { locale, messages } = useLocale();
  const savedResources = resources.filter((resource) => saved.some((item) => item.resourceId === resource.id));
  const viewedResources = history
    .map((item) => resources.find((resource) => resource.id === item.resourceId))
    .filter((resource): resource is Resource => Boolean(resource));
  const cityCount = new Set(resources.map((resource) => resource.city)).size;
  const stats = [
    {
      label: messages.dashboard.savedResources,
      value: saved.length,
      icon: Heart,
      frame: "border-honey-200 bg-[linear-gradient(145deg,var(--honey-50),rgba(244,190,78,0.35))]",
      iconFrame: "bg-honey-500 text-white shadow-[0_14px_28px_rgba(224,133,12,0.25)]",
      valueColor: "text-honey-700",
      bar: "from-honey-400 to-orange-500",
    },
    {
      label: messages.dashboard.recentViews,
      value: history.length,
      icon: BookOpen,
      frame: "border-teal-200 bg-[linear-gradient(145deg,var(--teal-50),rgba(95,184,188,0.28))]",
      iconFrame: "bg-teal-600 text-white shadow-[0_14px_28px_rgba(14,124,134,0.22)]",
      valueColor: "text-teal-700",
      bar: "from-teal-400 to-teal-700",
    },
    {
      label: messages.dashboard.nearbyCities,
      value: cityCount,
      icon: MapPinned,
      frame: "border-[rgba(232,101,10,0.26)] bg-[linear-gradient(145deg,#fff7ed,rgba(232,101,10,0.22))]",
      iconFrame: "bg-orange-500 text-white shadow-[0_14px_28px_rgba(232,101,10,0.22)]",
      valueColor: "text-orange-500",
      bar: "from-orange-500 to-honey-300",
    },
    {
      label: messages.dashboard.weeklyUpdates,
      value: 7,
      icon: TrendingUp,
      frame: "border-teal-200 bg-[linear-gradient(145deg,#f0fdfa,rgba(14,124,134,0.20),rgba(244,190,78,0.24))]",
      iconFrame: "bg-ink text-white shadow-[0_14px_28px_rgba(10,47,56,0.20)]",
      valueColor: "text-ink",
      bar: "from-teal-700 via-honey-400 to-orange-500",
    },
  ];
  const alerts = [
    { text: messages.dashboard.alert1, frame: "border-honey-200 bg-honey-50/80", dot: "bg-honey-500" },
    { text: messages.dashboard.alert2, frame: "border-teal-200 bg-teal-50/80", dot: "bg-teal-500" },
    { text: messages.dashboard.alert3, frame: "border-[rgba(232,101,10,0.24)] bg-[rgba(232,101,10,0.08)]", dot: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-panel overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_0%_0%,rgba(244,190,78,0.25),transparent_34%),radial-gradient(circle_at_96%_10%,rgba(14,124,134,0.18),transparent_34%),rgba(255,255,255,0.76)] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-honey-600">
              {messages.dashboard.welcomeBack}
            </p>
            <h1 className="mt-4 text-4xl font-bold text-ink">
              {user ? `${user.name} · ${messages.dashboard.defaultTitle}` : messages.dashboard.defaultTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
              {messages.dashboard.description}
            </p>
          </div>
          {!user ? (
            <Link href="/login?redirect=/dashboard">
              <Button size="lg">{messages.shell.demoLogin}</Button>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className={`relative overflow-hidden rounded-[28px] border p-6 shadow-e3 ${item.frame}`}>
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.bar}`} />
            <div className={`inline-flex rounded-2xl p-3 ${item.iconFrame}`}>
              <item.icon className="size-5" />
            </div>
            <div className={`mt-5 text-4xl font-bold ${item.valueColor}`}>{item.value}</div>
            <p className="mt-2 text-sm font-semibold text-ink-soft">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-[30px] bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(255,248,236,0.72))] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink">{messages.dashboard.savedResources}</h2>
            <Badge>{savedResources.length}</Badge>
          </div>
          <div className="mt-5 space-y-4">
            {savedResources.length > 0 ? (
              savedResources.map((resource) => (
                <div key={resource.id} className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/70 p-4 shadow-e1">
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-honey-400" />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-ink">{resource.name}</h3>
                      <p className="mt-1 text-sm text-muted">{resource.city}</p>
                    </div>
                    <Link href={`/resource/${resource.id}`} className="text-sm font-semibold text-teal-600 transition hover:text-honey-600">
                      {messages.dashboard.open}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-3xl border border-honey-200 bg-honey-50/80 p-4 text-sm leading-7 text-honey-800">
                {messages.dashboard.saveHint}
              </p>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[30px] bg-[linear-gradient(145deg,rgba(236,248,248,0.82),rgba(255,255,255,0.76))] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-teal-700 p-3 text-white shadow-[0_14px_28px_rgba(14,124,134,0.20)]">
              <BellRing className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink">{messages.dashboard.communityAlerts}</h2>
              <p className="text-sm text-muted">{messages.dashboard.alertsSubtitle}</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {alerts.map((item) => (
              <div key={item.text} className={`flex gap-3 rounded-3xl border p-4 shadow-e1 ${item.frame}`}>
                <span aria-hidden="true" className={`mt-2 size-2.5 shrink-0 rounded-full ${item.dot}`} />
                <p className="text-sm leading-7 text-ink-soft">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[30px] bg-[radial-gradient(circle_at_8%_0%,rgba(14,124,134,0.14),transparent_30%),radial-gradient(circle_at_92%_12%,rgba(244,190,78,0.18),transparent_28%),rgba(255,255,255,0.72)] p-6">
        <h2 className="text-2xl font-bold text-ink">{messages.dashboard.recentHistory}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {viewedResources.length > 0 ? (
            viewedResources.map((resource) => (
              <Link key={resource.id} href={`/resource/${resource.id}`} className="rounded-3xl border border-teal-100 bg-white/75 p-4 shadow-e1 transition hover:-translate-y-0.5 hover:border-honey-200 hover:bg-white">
                <p className="font-bold text-ink">{resource.name}</p>
                <p className="mt-1 text-sm text-muted">{localizeCategory(resource.category, locale)} · {resource.city}</p>
              </Link>
            ))
          ) : (
            <p className="rounded-3xl border border-teal-200 bg-teal-50/80 p-4 text-sm leading-7 text-teal-800 md:col-span-2 xl:col-span-3">
              {messages.dashboard.historyHint}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
