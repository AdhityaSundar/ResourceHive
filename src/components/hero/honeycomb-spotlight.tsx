"use client";

import { useEffect, useRef } from "react";

/**
 * A honeycomb layer where the cells near the cursor light up in warm amber.
 * Tracks the pointer via a window listener (so it works even though the layer
 * is non-interactive) and writes the position to CSS variables on each frame.
 */
export function HoneycombSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="honeycomb-spotlight pointer-events-none absolute inset-0"
    />
  );
}
