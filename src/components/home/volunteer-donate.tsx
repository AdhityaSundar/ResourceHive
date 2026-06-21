"use client";

import Link from "next/link";
import { Heart, HeartHandshake } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";

function HexBullet() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-1 size-3 shrink-0 fill-honey-500">
      <path d="M6 2h12l6 10-6 10H6L0 12z" />
    </svg>
  );
}

export function VolunteerDonate() {
  const { messages } = useLocale();

  const points = [
    messages.home.volunteerPoint1,
    messages.home.volunteerPoint2,
    messages.home.volunteerPoint3,
  ];

  return (
    <div className="panel-amber relative overflow-hidden rounded-[36px] p-8 sm:p-10">
      {/* Subtle honeycomb texture over the amber gloss */}
      <div
        aria-hidden="true"
        className="honeycomb-texture-light pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-honey-300 bg-white/85 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-honey-800">
            <HeartHandshake className="size-3.5" />
            {messages.home.volunteerEyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-ink">
            {messages.home.volunteerTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            {messages.home.volunteerDescription}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/contact">
              <Button size="lg" className="gap-2">
                <Heart className="size-4" />
                {messages.home.becomeVolunteer}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                {messages.home.donate}
              </Button>
            </Link>
          </div>
        </div>

        <ul className="grid gap-4 self-center">
          {points.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-[24px] border border-[var(--border)] bg-white/70 p-5 shadow-e1"
            >
              <HexBullet />
              <p className="text-sm leading-7 text-ink-soft">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
