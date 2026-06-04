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

// The headline as three atomic phrases. On a wide container they sit on one
// line; as the container narrows they wrap cleanly to three lines.
const HEADLINE_PHRASES = (
  <>
    <span className="whitespace-nowrap">
      Find the <span className={ACCENT}>help</span>
    </span>{" "}
    <span className="whitespace-nowrap">you need</span>{" "}
    <span className="whitespace-nowrap">
      <span className={ACCENT}>most</span>.
    </span>
  </>
);

/** Static version (reduced-motion / no-WebGL): the final stacked three lines. */
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

  // Headline + globe share one leftward travel (same rate), so the globe moves
  // WITH the text. Both start shifted right (headline = one readable line on the
  // right, globe right-of-centre) and slide to x:0 — the headline reflowing into
  // three left-aligned lines, the globe landing centred. The final frame (x:0,
  // maxW 11ch) is unchanged; only the starting offset moved (22vw, in frame).
  const SHARED_X: [string, string] = ["22vw", "0vw"];
  const headlineY = useTransform(scrollYProgress, [0, 0.5, 1], ["6%", "-2%", "2%"]);
  const headlineX = useTransform(scrollYProgress, [0, 1], SHARED_X);
  const globeX = useTransform(scrollYProgress, [0, 1], SHARED_X);
  const headlineMaxW = useTransform(scrollYProgress, [0, 1], ["34ch", "11ch"]);

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

        {/* Globe — nudged down (banner clearance) + travels left with the text */}
        <div className="absolute inset-0 z-[1] translate-y-[7vh]">
          <motion.div style={{ x: globeX }} className="absolute inset-0">
            <GlobeCanvas mode={mode} />
          </motion.div>
        </div>

        {/* Headline: one line on the right that travels left and breaks into
            three lines as it narrows (driven entirely by scroll). */}
        <motion.div
          style={{ y: headlineY }}
          className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-start px-6 sm:pl-[6%]"
        >
          <motion.div style={{ x: headlineX }} className="relative">
            {/* scrim rides with the text so it stays legible over the globe */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-12 -inset-y-8 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(7,33,42,0.72),rgba(7,33,42,0.35)_45%,transparent_72%)] blur-2xl"
            />
            <motion.h1
              id="hero-heading"
              style={{ maxWidth: headlineMaxW }}
              className={`${HEADLINE_CLASS} w-fit`}
            >
              {HEADLINE_PHRASES}
            </motion.h1>
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
