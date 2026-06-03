"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { EmergencyBanner } from "@/components/site/emergency-banner";
import { Bee } from "@/components/hero/bee";
import { Button } from "@/components/ui/button";
import { useGlobeCapability } from "@/components/hero/use-globe-capability";
import { GlobeStatic } from "@/components/hero/globe-static";

const GlobeCanvas = dynamic(
  () => import("@/components/hero/globe-canvas").then((m) => m.GlobeCanvas),
  { ssr: false, loading: () => null },
);

function Headline({ id }: { id?: string }) {
  return (
    <h1
      id={id}
      className="font-display text-[clamp(2.5rem,5.4vw,4.75rem)] font-bold leading-[1.02] tracking-tight text-ink text-balance"
    >
      Find the <span className="text-orange-600">help</span> you need most.
    </h1>
  );
}

function HeroActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/resources">
        <Button size="lg" className="gap-2">
          Browse directory
          <ArrowRight className="size-4" />
        </Button>
      </Link>
      <Link href="/map">
        <Button variant="secondary" size="lg" className="gap-2">
          <MapPin className="size-4" />
          Open map
        </Button>
      </Link>
    </div>
  );
}

/** Warm sunrise backdrop: cream on the left (where the text lands, keeping dark
 *  ink AA-legible), amber on the right (behind the globe). */
function WarmBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(100deg,#fffaf0_0%,#fff1d8_30%,#fbd182_68%,#f1a73a_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_46%,rgba(244,176,63,0.55),transparent_52%)]" />
      <div className="honeycomb-texture-light absolute inset-0 opacity-50" />
    </div>
  );
}

/**
 * Animated, scroll-pinned hero. In its own component so the useScroll target
 * ref is only ever created while the pinned section is mounted.
 */
function PinnedGlobeHero({ mode }: { mode: "full" | "lite" }) {
  const outerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Globe: shrinks a little and drifts right as you scroll.
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.62]);
  const globeX = useTransform(scrollYProgress, [0, 1], ["0%", "23%"]);

  // Headline block: travels in from the right and resolves on the left,
  // staying fully in front of the globe (never occluded).
  const textX = useTransform(scrollYProgress, [0, 0.9, 1], ["46vw", "0vw", "0vw"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.28, 0.72], [0, 0.5, 1]);

  // Bee: flies from top-right to bottom-left across the globe.
  const beeLeft = useTransform(scrollYProgress, [0, 1], ["64%", "34%"]);
  const beeTop = useTransform(scrollYProgress, [0, 1], ["12%", "80%"]);
  const beeRotate = useTransform(scrollYProgress, [0, 1], [22, -12]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={outerRef}
      aria-labelledby="hero-heading"
      className="relative"
      style={{ height: "280vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <WarmBackdrop />

        {/* Urgent banner stays pinned + visible through the whole sequence */}
        <div className="relative z-30 pt-20">
          <EmergencyBanner />
        </div>

        {/* Globe (shrinks + moves right) with the bee flying across it */}
        <motion.div
          style={{ scale: globeScale, x: globeX }}
          className="absolute inset-0 z-[1] origin-center"
        >
          <div className="absolute inset-0">
            <GlobeCanvas mode={mode} progress={scrollYProgress} />
          </div>
          <motion.div
            aria-hidden="true"
            style={{ left: beeLeft, top: beeTop, rotate: beeRotate }}
            className="absolute z-[2] w-9 sm:w-11"
          >
            <Bee className="w-full animate-[float_2.6s_ease-in-out_infinite]" />
          </motion.div>
        </motion.div>

        {/* Headline block travels right -> left, resolving fully readable on the left */}
        <motion.div
          style={{ x: textX, opacity: textOpacity }}
          className="absolute inset-y-0 left-[6%] z-[3] flex max-w-[42ch] flex-col justify-center"
        >
          <Headline id="hero-heading" />
          <p className="mt-5 max-w-md text-lg leading-8 text-ink-soft">
            Real people, real resources, updated daily. Find food, shelter, jobs, and
            care near you.
          </p>
          <div className="mt-8">
            <HeroActions />
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.p
          style={{ opacity: hintOpacity }}
          className="absolute inset-x-0 bottom-8 z-30 text-center text-xs font-semibold uppercase tracking-[0.24em] text-honey-800/70"
        >
          Scroll to explore the hive
        </motion.p>
      </div>
    </section>
  );
}

/** Static / reduced-motion / no-WebGL / first-paint layout (text left, globe right). */
function StaticGlobeHero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <WarmBackdrop />
      <EmergencyBanner />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <Headline id="hero-heading" />
          <p className="mt-6 max-w-lg text-lg leading-8 text-ink-soft">
            Real people, real resources, updated daily. Find food, shelter, jobs, and
            care near you.
          </p>
          <div className="mt-8">
            <HeroActions />
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <GlobeStatic />
        </div>
      </div>
    </section>
  );
}

export function GlobeHero() {
  const prefersReducedMotion = useReducedMotion();
  const { mode, mounted } = useGlobeCapability();

  const animated = mounted && mode !== "static" && !prefersReducedMotion;

  if (!animated) {
    return <StaticGlobeHero />;
  }

  return <PinnedGlobeHero mode={mode === "lite" ? "lite" : "full"} />;
}
