"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { EmergencyBanner } from "@/components/site/emergency-banner";
import { Button } from "@/components/ui/button";
import { useGlobeCapability } from "@/components/hero/use-globe-capability";
import { GlobeStatic } from "@/components/hero/globe-static";
import type { UserPos } from "@/components/hero/globe-canvas";
import type { GlobeMarker } from "@/lib/geo";

const GlobeCanvas = dynamic(
  () => import("@/components/hero/globe-canvas").then((m) => m.GlobeCanvas),
  { ssr: false, loading: () => null },
);

const HEADLINE_PRE = "Find the ";
const HEADLINE_ACCENT = "help";
const HEADLINE_POST = " you need most.";

function Headline({ id }: { id?: string }) {
  return (
    <h1
      id={id}
      className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.98] tracking-tight text-white text-balance drop-shadow-[0_2px_20px_rgba(7,33,42,0.6)]"
    >
      {HEADLINE_PRE}
      <span className="text-honey-300">{HEADLINE_ACCENT}</span>
      {HEADLINE_POST}
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

/** Deep teal backdrop: honeycomb texture, atmospheric pooling, faint starfield. */
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-teal-900">
      <div className="honeycomb-texture-dark absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(14,124,134,0.45),transparent_55%),radial-gradient(circle_at_30%_80%,rgba(224,133,12,0.16),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,#ffffff22_0.6px,transparent_1.2px),radial-gradient(circle_at_82%_64%,#ffffff18_0.6px,transparent_1.2px),radial-gradient(circle_at_46%_88%,#ffffff14_0.5px,transparent_1px)] bg-[size:240px_240px,300px_300px,180px_180px]" />
    </div>
  );
}

/** Keyboard/AT-accessible list of the same destinations as the on-globe pins. */
function AccessibleMarkerList({ markers }: { markers: GlobeMarker[] }) {
  return (
    <nav aria-label="Service locations" className="sr-only">
      <ul>
        {markers.map((marker) => (
          <li key={marker.city}>
            <Link href={marker.href}>
              {marker.label}: {marker.count} resources
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Animated, scroll-pinned hero. Split into its own component so the
 * useScroll target ref is only ever created while the pinned section is
 * actually mounted in the DOM (avoids framer-motion's "ref not hydrated").
 */
function PinnedGlobeHero({
  mode,
  markers,
  userPos,
}: {
  mode: "full" | "lite";
  markers: GlobeMarker[];
  userPos: UserPos;
}) {
  const router = useRouter();
  const outerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Headline choreography: right (behind) -> arc -> left (in front).
  const xBack = useTransform(scrollYProgress, [0, 1], ["34%", "-28%"]);
  const xFront = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const arcY = useTransform(scrollYProgress, [0, 0.5, 1], ["6%", "-4%", "2%"]);
  const opacityBack = useTransform(scrollYProgress, [0, 0.42, 0.55], [1, 1, 0]);
  const opacityFront = useTransform(scrollYProgress, [0.48, 0.62, 1], [0, 1, 1]);

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

        {/* Headline BEHIND the globe (peeks out right, occluded by the sphere) */}
        <motion.div
          aria-hidden="true"
          style={{ x: xBack, y: arcY, opacity: opacityBack }}
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-6"
        >
          <div className="w-full max-w-2xl">
            <Headline />
          </div>
        </motion.div>

        {/* Globe */}
        <div className="absolute inset-0 z-[2]">
          <GlobeCanvas
            mode={mode}
            markers={markers}
            progress={scrollYProgress}
            userPos={userPos}
            onSelectCity={(href) => router.push(href)}
          />
        </div>

        {/* Headline IN FRONT of the globe (resolves on the left, fully legible) */}
        <motion.div
          style={{ x: xFront, y: arcY, opacity: opacityFront }}
          className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center px-6"
        >
          <div className="w-full max-w-2xl">
            <Headline id="hero-heading" />
          </div>
        </motion.div>

        {/* Primary actions — usable at every stage */}
        <div className="absolute inset-x-0 bottom-10 z-30 mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
          <p className="max-w-md text-base leading-7 text-teal-50/80">
            Real people, real resources, updated daily.
          </p>
          <HeroActions />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-teal-100/50">
            Scroll to explore the hive
          </p>
        </div>
      </div>

      <AccessibleMarkerList markers={markers} />
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
          <Headline id="hero-heading" />
          <p className="mt-6 max-w-lg text-lg leading-8 text-teal-50/85">
            Real people, real resources, updated daily. Browse food, shelter, jobs, and
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
      <AccessibleMarkerList markers={markers} />
    </section>
  );
}

export function GlobeHero({ markers }: { markers: GlobeMarker[] }) {
  const prefersReducedMotion = useReducedMotion();
  const { mode, mounted } = useGlobeCapability();
  const [userPos, setUserPos] = useState<UserPos>(null);

  // Non-blocking geolocation. Used only client-side to orient the globe; never
  // stored or transmitted. Default global drift if denied/unavailable.
  useEffect(() => {
    if (mode === "static") return;
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return;

    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!cancelled) {
          setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
      },
      () => {
        /* denied / dismissed / unavailable — keep default drift, no nagging */
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600_000 },
    );

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const animated = mounted && mode !== "static" && !prefersReducedMotion;

  if (!animated) {
    return <StaticGlobeHero markers={markers} />;
  }

  return (
    <PinnedGlobeHero mode={mode === "lite" ? "lite" : "full"} markers={markers} userPos={userPos} />
  );
}
