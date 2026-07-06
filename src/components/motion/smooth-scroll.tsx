"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Buttery inertial wheel scrolling (Lenis). Native scroll position still
 * updates, so framer-motion's useScroll and the sticky globe hero keep working.
 * Fully disabled under prefers-reduced-motion (native scroll takes over).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
