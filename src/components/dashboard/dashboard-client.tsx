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
  const { user, saved, history, login } = useAuth();
  const { locale, messages } = useLocale();
  const savedResources = resources.filter((resource) => saved.some((item) => item.resourceId === resource.id));
  const viewedResources = history
    .map((item) => resources.find((resource) => resource.id === item.resourceId))
    .filter((resource): resource is Resource => Boolean(resource));

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[32px] p-8">
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
            <Button
              size="lg"
              onClick={() => login({ email: "demo@resourcehive.org", name: messages.shell.demoUserName })}
            >
              {messages.shell.demoLogin}
            </Button>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: messages.dashboard.savedResources, value: saved.length, icon: Heart, tint: "border border-teal-100 bg-white/70 text-teal-600" },
          { label: messages.dashboard.recentViews, value: history.length, icon: BookOpen, tint: "border border-teal-100 bg-white/70 text-teal-600" },
          { label: messages.dashboard.nearbyCities, value: new Set(resources.map((resource) => resource.city)).size, icon: MapPinned, tint: "border border-teal-100 bg-white/70 text-teal-600" },
          { label: messages.dashboard.weeklyUpdates, value: 7, icon: TrendingUp, tint: "border border-teal-100 bg-white/70 text-teal-600" },
        ].map((item) => (
          <div key={item.label} className="glass-panel rounded-[28px] p-6">
            <div className={`inline-flex rounded-2xl p-3 ${item.tint}`}>
              <item.icon className="size-5" />
            </div>
            <div className="mt-5 text-4xl font-bold text-ink">{item.value}</div>
            <p className="mt-2 text-sm text-muted">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-[30px] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink">{messages.dashboard.savedResources}</h2>
            <Badge>{savedResources.length}</Badge>
          </div>
          <div className="mt-5 space-y-4">
            {savedResources.length > 0 ? (
              savedResources.map((resource) => (
                <div key={resource.id} className="rounded-3xl border border-white/40 bg-white/55 p-4">
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
              <p className="text-sm leading-7 text-muted">
                {messages.dashboard.saveHint}
              </p>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[30px] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-teal-100 bg-white/70 p-3 text-teal-600">
              <BellRing className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink">{messages.dashboard.communityAlerts}</h2>
              <p className="text-sm text-muted">{messages.dashboard.alertsSubtitle}</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {[messages.dashboard.alert1, messages.dashboard.alert2, messages.dashboard.alert3].map((item) => (
              <div key={item} className="rounded-3xl border border-white/40 bg-white/55 p-4">
                <p className="text-sm leading-7 text-ink-soft">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[30px] p-6">
        <h2 className="text-2xl font-bold text-ink">{messages.dashboard.recentHistory}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {viewedResources.length > 0 ? (
            viewedResources.map((resource) => (
              <Link key={resource.id} href={`/resource/${resource.id}`} className="rounded-3xl border border-white/40 bg-white/55 p-4 transition hover:-translate-y-0.5 hover:bg-white/75">
                <p className="font-bold text-ink">{resource.name}</p>
                <p className="mt-1 text-sm text-muted">{localizeCategory(resource.category, locale)} · {resource.city}</p>
              </Link>
            ))
          ) : (
            <p className="text-sm leading-7 text-muted">
              {messages.dashboard.historyHint}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

