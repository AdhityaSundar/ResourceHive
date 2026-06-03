"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { EmergencyBanner } from "@/components/site/emergency-banner";
import { Button } from "@/components/ui/button";
import { useGlobeCapability } from "@/components/hero/use-globe-capability";
import { GlobeStatic } from "@/components/hero/globe-static";
import { HoneycombSpotlight } from "@/components/hero/honeycomb-spotlight";
import type { GlobeMarker } from "@/lib/geo";

const GlobeCanvas = dynamic(
  () => import("@/components/hero/globe-canvas").then((m) => m.GlobeCanvas),
  { ssr: false, loading: () => null },
);

const ACCENT = "text-honey-300 accent-glow";
const HEADLINE_CLASS =
  "font-display text-[clamp(2rem,4.6vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white drop-shadow-[0_2px_24px_rgba(7,33,42,0.7)]";

/** Initial frame: the whole sentence on one line. */
function HeadlineOneLine() {
  return (
    <h1 aria-hidden="true" className={`${HEADLINE_CLASS} whitespace-nowrap`}>
      Find the <span className={ACCENT}>help</span> you need <span className={ACCENT}>most</span>.
    </h1>
  );
}

/** Final frame: the sentence hard-broken into three stacked lines. */
function HeadlineStacked({ id }: { id?: string }) {
  return (
    <h1 id={id} className={HEADLINE_CLASS}>
      Find the <span className={ACCENT}>help</span>
      <br />
      you need
      <br />
      <span className={ACCENT}>most</span>.
    </h1>
  );
}

function HeroActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/resources">
        <Button size="lg" className="gap-2 px-8 text-base shadow-e4">
          Browse directory
          <ArrowRight className="size-4" />
        </Button>
      </Link>
      <Link href="/map">
        <Button
          variant="secondary"
          size="lg"
          className="gap-2 bg-white px-8 text-base text-teal-800 shadow-e3 hover:bg-white"
        >
          <MapPin className="size-4" />
          Open map
        </Button>
      </Link>
    </div>
  );
}

/** Replaces the clumped on-globe pins: clear, labelled chips that link to each
 *  location's filtered directory. Also serves as the accessible locations nav. */
function CityChips({ markers }: { markers: GlobeMarker[] }) {
  if (markers.length === 0) return null;
  return (
    <nav aria-label="Browse resources by city" className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100/60">
        Find help in
      </span>
      {markers.map((marker) => (
        <Link
          key={marker.city}
          href={marker.href}
          className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-honey-300/60 hover:bg-white/20"
        >
          {marker.label}
        </Link>
      ))}
    </nav>
  );
}

/** Deep teal backdrop: honeycomb texture, warm glow, faint starfield. */
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-teal-900">
      <div className="honeycomb-texture-dark absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(14,124,134,0.45),transparent_55%),radial-gradient(circle_at_30%_80%,rgba(224,133,12,0.16),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,#ffffff22_0.6px,transparent_1.2px),radial-gradient(circle_at_82%_64%,#ffffff18_0.6px,transparent_1.2px),radial-gradient(circle_at_46%_88%,#ffffff14_0.5px,transparent_1px)] bg-[size:240px_240px,300px_300px,180px_180px]" />
      <HoneycombSpotlight />
    </div>
  );
}

/**
 * Animated, scroll-pinned hero. In its own component so the useScroll target
 * ref is only ever created while the pinned section is mounted.
 */
function PinnedGlobeHero({ mode, markers }: { mode: "full" | "lite"; markers: GlobeMarker[] }) {
  const outerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Headline lives on the right. It starts as one line (initial frame) and, as
  // the globe spins with scroll, cross-fades into the stacked three-line block
  // (final frame). A gentle vertical parallax + a static scrim keep it readable.
  const headlineY = useTransform(scrollYProgress, [0, 0.5, 1], ["6%", "-2%", "2%"]);
  const oneLineOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const stackedOpacity = useTransform(scrollYProgress, [0.35, 0.8], [0, 1]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={outerRef}
      aria-labelledby="hero-heading"
      className="relative"
      style={{ height: "280vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <HeroBackdrop />

        {/* Urgent banner stays pinned + visible through the whole sequence */}
        <div className="relative z-30 pt-20">
          <EmergencyBanner />
        </div>

        {/* Globe — nudged down so it doesn't crowd the urgent banner */}
        <div className="absolute inset-0 z-[1] translate-y-[7vh]">
          <GlobeCanvas mode={mode} progress={scrollYProgress} />
        </div>

        {/* Headline on the right: one line -> stacked three lines as you scroll */}
        <motion.div
          style={{ y: headlineY }}
          className="pointer-events-none absolute inset-0 z-[3]"
        >
          {/* static scrim keeps the text legible over the globe/background */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-[52%] bg-[radial-gradient(ellipse_60%_45%_at_72%_50%,rgba(7,33,42,0.65),transparent_72%)] blur-2xl"
          />
          <motion.div
            style={{ opacity: oneLineOpacity }}
            className="absolute inset-0 flex items-center justify-end px-6 sm:pr-[6%]"
          >
            <HeadlineOneLine />
          </motion.div>
          <motion.div
            style={{ opacity: stackedOpacity }}
            className="absolute inset-0 flex items-center justify-end px-6 sm:pr-[6%]"
          >
            <HeadlineStacked id="hero-heading" />
          </motion.div>
        </motion.div>

        {/* Actions + locations — usable at every stage */}
        <div className="absolute inset-x-0 bottom-12 z-30 mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
          <p className="max-w-md text-base leading-7 text-teal-50/85">
            Real people, real resources, updated daily.
          </p>
          <HeroActions />
          <CityChips markers={markers} />
        </div>

        {/* Scroll hint */}
        <motion.p
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute right-6 top-1/2 z-20 text-xs font-semibold uppercase tracking-[0.24em] text-teal-100/40"
        >
          Scroll
        </motion.p>
      </div>
    </section>
  );
}

/** Static / reduced-motion / no-WebGL / first-paint layout. */
function StaticGlobeHero({ markers }: { markers: GlobeMarker[] }) {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-teal-900">
      <HeroBackdrop />
      <EmergencyBanner />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <HeadlineStacked id="hero-heading" />
          <p className="mt-6 max-w-lg text-lg leading-8 text-teal-50/85">
            Real people, real resources, updated daily. Find food, shelter, jobs, and
            care near you.
          </p>
          <div className="mt-8 flex flex-col gap-5">
            <HeroActions />
            <CityChips markers={markers} />
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <GlobeStatic />
        </div>
      </div>
    </section>
  );
}

export function GlobeHero({ markers }: { markers: GlobeMarker[] }) {
  const prefersReducedMotion = useReducedMotion();
  const { mode, mounted } = useGlobeCapability();

  const animated = mounted && mode !== "static" && !prefersReducedMotion;

  if (!animated) {
    return <StaticGlobeHero markers={markers} />;
  }

  return <PinnedGlobeHero mode={mode === "lite" ? "lite" : "full"} markers={markers} />;
}
