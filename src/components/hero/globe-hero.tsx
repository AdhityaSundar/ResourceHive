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
      className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-bold leading-[1.04] tracking-tight text-white text-balance drop-shadow-[0_2px_24px_rgba(7,33,42,0.55)]"
    >
      Find the <span className="text-honey-300">help</span> you need most.
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

/** Deep teal backdrop: honeycomb texture, warm glow behind the globe, faint stars. */
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-teal-900">
      <div className="honeycomb-texture-dark absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_44%,rgba(239,164,23,0.28),transparent_46%),radial-gradient(circle_at_20%_70%,rgba(14,124,134,0.4),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,#ffffff22_0.6px,transparent_1.2px),radial-gradient(circle_at_82%_64%,#ffffff18_0.6px,transparent_1.2px),radial-gradient(circle_at_46%_88%,#ffffff14_0.5px,transparent_1px)] bg-[size:240px_240px,300px_300px,180px_180px]" />
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

  // Globe: shrinks a little and settles into the right half.
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.72]);
  const globeX = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  // Headline block: travels in from the right and resolves on the left, always
  // in front of the globe and confined to the left half (never overlapping it).
  const textX = useTransform(scrollYProgress, [0, 0.9, 1], ["40vw", "0vw", "0vw"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25, 0.6], [0, 0.6, 1]);

  // Bee: flies in from the top-right and circles down across the globe.
  const beeLeft = useTransform(scrollYProgress, [0, 1], ["88%", "64%"]);
  const beeTop = useTransform(scrollYProgress, [0, 1], ["8%", "62%"]);
  const beeRotate = useTransform(scrollYProgress, [0, 1], [25, -10]);

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

        {/* Globe (shrinks + settles right) */}
        <motion.div
          style={{ scale: globeScale, x: globeX }}
          className="absolute inset-0 z-[1] origin-center"
        >
          <GlobeCanvas mode={mode} progress={scrollYProgress} />
        </motion.div>

        {/* Bee flies over the globe (its own layer so it stays crisp + visible) */}
        <motion.div
          aria-hidden="true"
          style={{ left: beeLeft, top: beeTop, rotate: beeRotate }}
          className="absolute z-[2] w-12 sm:w-16"
        >
          <Bee className="w-full animate-[float_2.6s_ease-in-out_infinite]" />
        </motion.div>

        {/* Headline block travels right -> left, confined to the left half */}
        <motion.div
          style={{ x: textX, opacity: textOpacity }}
          className="absolute inset-y-0 left-[6%] z-[3] flex w-[min(40rem,44vw)] flex-col justify-center"
        >
          <Headline id="hero-heading" />
          <p className="mt-5 max-w-md text-lg leading-8 text-teal-50/85">
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
          className="absolute inset-x-0 bottom-8 z-30 text-center text-xs font-semibold uppercase tracking-[0.24em] text-teal-100/50"
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
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-teal-900">
      <HeroBackdrop />
      <EmergencyBanner />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <Headline id="hero-heading" />
          <p className="mt-6 max-w-lg text-lg leading-8 text-teal-50/85">
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
