"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, MessageCircle, TrendingUp, type LucideIcon } from "lucide-react";

import { HoneycombSpotlight } from "@/components/hero/honeycomb-spotlight";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { BrandMark } from "@/components/site/brand-mark";
import { Button } from "@/components/ui/button";

export function AboutPageClient() {
  const { messages } = useLocale();

  const pillars: Array<{ title: string; text: string; icon: LucideIcon; accent: string }> = [
    { title: messages.about.storyTitle, text: messages.about.storyText, icon: BookOpen, accent: "#e0850c" },
    { title: messages.about.impactTitle, text: messages.about.impactText, icon: HeartHandshake, accent: "#0e9aa7" },
    { title: messages.about.scaleTitle, text: messages.about.scaleText, icon: TrendingUp, accent: "#8b5cf6" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Editorial hero */}
      <Reveal>
        <section className="panel-amber relative overflow-hidden rounded-[40px] p-8 sm:p-12 lg:p-14">
          <Parallax speed={40} className="pointer-events-none absolute -right-10 -top-10 size-72">
            <div className="honeycomb-texture-light size-full opacity-70 [mask-image:radial-gradient(circle,#000,transparent_70%)]" />
          </Parallax>
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-3">
              <BrandMark className="size-10" />
              <span className="text-sm font-bold uppercase tracking-[0.28em] text-honey-700">
                {messages.about.eyebrow}
              </span>
            </div>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              {messages.about.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">{messages.about.description}</p>
          </div>
        </section>
      </Reveal>

      {/* Pillars — distinct icons + per-pillar accent aura, not a flat grid */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <Reveal key={pillar.title} delay={index * 0.1} className="h-full">
              <article
                style={{ "--accent": pillar.accent } as CSSProperties}
                className="glass-panel group relative flex h-full flex-col overflow-hidden rounded-[30px] p-7 ease-[cubic-bezier(0.22,1,0.36,1)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-e4"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-14 -top-16 size-44 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-500 group-hover:opacity-25"
                  style={{ background: "var(--accent)" }}
                />
                <span className="relative grid size-14 shrink-0 place-items-center">
                  <span className="absolute inset-0 hex-clip" style={{ background: "var(--accent)" }} />
                  <span className="absolute inset-[2px] hex-clip bg-white" />
                  <Icon className="relative size-6" style={{ color: "var(--accent)" }} strokeWidth={2} />
                </span>
                <h2 className="relative mt-5 font-display text-2xl font-semibold text-ink">{pillar.title}</h2>
                <p className="relative mt-3 text-sm leading-7 text-muted">{pillar.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Closing CTA */}
      <Reveal delay={0.1}>
        <section className="relative mt-6 overflow-hidden rounded-[36px] bg-teal-900 p-8 text-center sm:p-12">
          <div className="honeycomb-texture-dark pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(224,133,12,0.22),transparent_60%)]" />
          <HoneycombSpotlight />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance font-display text-3xl font-bold text-white sm:text-4xl">
              {messages.about.impactTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-8 text-teal-50/85">{messages.about.impactText}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/resources">
                <Button size="lg" className="gap-2 px-7">
                  {messages.home.browseDirectory}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2 bg-white/90 px-7 text-teal-800 hover:bg-white"
                >
                  <MessageCircle className="size-4" />
                  {messages.nav.contact}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
