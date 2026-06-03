"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { HexIcon } from "@/components/ui/hex-icon";
import { resourceCategories } from "@/lib/categories";
import { localizeCategory, localizeCategoryDescription } from "@/lib/i18n";

// Warm "invite" categories vs calm "focus" categories — the hive duality.
const toneByCategory: Record<string, "warm" | "teal"> = {
  Food: "warm",
  Community: "warm",
  Education: "warm",
  Shelter: "teal",
  Jobs: "teal",
  Healthcare: "teal",
};

export function FeaturedCategories() {
  const { locale, messages } = useLocale();

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {resourceCategories.map((item) => {
        const tone = toneByCategory[item.category] ?? "warm";
        const title = localizeCategory(item.category, locale);
        return (
          <Link
            key={item.category}
            href={`/resources?category=${item.category}`}
            className="group glass-panel relative overflow-hidden rounded-[32px] p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-e4"
          >
            <div
              aria-hidden="true"
              className="honeycomb-texture-light pointer-events-none absolute -right-8 -top-8 size-36 opacity-60 [mask-image:radial-gradient(circle,#000,transparent_70%)]"
            />
            <div className="relative">
              <HexIcon
                icon={item.icon}
                tone={tone}
                className="size-16 transition-transform duration-300 group-hover:scale-[1.06]"
              />
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {localizeCategoryDescription(item.category, locale)}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-all group-hover:gap-2.5 group-hover:text-honey-600">
                {messages.home.exploreCategory} {title}
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
