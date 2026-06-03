"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { localizeCategory } from "@/lib/i18n";
import type { Resource } from "@/lib/types";

export function FeaturedResourceCard({ resource }: { resource: Resource }) {
  const { locale, messages } = useLocale();

  return (
    <Link
      href={`/resource/${resource.id}`}
      className="group glass-panel flex h-full flex-col rounded-[32px] p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-e4"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge tone="teal" hex>
          {localizeCategory(resource.category, locale)}
        </Badge>
        <div className="flex gap-2">
          <Badge tone="open">{messages.common.open}</Badge>
          <Badge tone="free">{messages.common.free}</Badge>
        </div>
      </div>

      <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-ink">
        {resource.name}
      </h3>

      {resource.description ? (
        <p className="mt-3 flex-1 text-sm leading-7 text-muted line-clamp-3">
          {resource.description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-ink-soft">
        <MapPin className="size-4 shrink-0 text-teal-500" />
        {resource.city}
        {resource.state ? `, ${resource.state}` : ""}
      </div>

      {resource.services.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
          {resource.services.slice(0, 3).map((service) => (
            <Badge key={service} tone="neutral">
              {service}
            </Badge>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
