"use client";

import { useEffect, useState } from "react";

export type GlobeMode = "full" | "lite" | "static";

type NavigatorConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * Decides how heavy a globe the device should render:
 *  - "static": prefers-reduced-motion or no WebGL — a frozen, non-animated globe.
 *  - "lite":   mobile / small viewport / few CPU cores / Save-Data / slow network
 *              — a low-segment globe with no clouds or atmosphere shader.
 *  - "full":   everything else — textured Earth, clouds, atmosphere, hi-DPR.
 *
 * Returns "static" until mounted so first paint never blocks on detection.
 */
export function useGlobeCapability(): { mode: GlobeMode; mounted: boolean } {
  const [mode, setMode] = useState<GlobeMode>("static");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !detectWebGL()) {
      setMode("static");
      return;
    }

    const connection = (navigator as Navigator & { connection?: NavigatorConnection })
      .connection;
    const cores = navigator.hardwareConcurrency ?? 8;
    const constrained =
      window.innerWidth < 768 ||
      cores <= 4 ||
      connection?.saveData === true ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");

    setMode(constrained ? "lite" : "full");

    // React to reduced-motion changes (e.g. user toggles the OS setting live).
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mq.matches) setMode("static");
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return { mode, mounted };
}
