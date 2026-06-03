import { cn } from "@/lib/utils";

/**
 * Zero-JS static globe used for the reduced-motion and no-WebGL fallbacks.
 * A CSS sphere built from the day texture with a terminator shadow and a teal
 * atmosphere ring — reads as a planet without any canvas/animation.
 */
export function GlobeStatic({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative aspect-square w-full max-w-[min(80vw,520px)]", className)}
      role="img"
      aria-label="Globe showing ResourceHive service locations across Texas"
    >
      {/* Atmosphere glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(95,184,188,0.45),transparent_62%)] blur-xl" />
      {/* The planet */}
      <div
        className="absolute inset-[6%] rounded-full bg-cover bg-center shadow-[inset_-22px_-18px_60px_rgba(7,33,42,0.85),inset_14px_10px_40px_rgba(95,184,188,0.25)]"
        style={{ backgroundImage: "url(/textures/earth_atmos_2048.jpg)" }}
      />
      {/* Rim light */}
      <div className="absolute inset-[6%] rounded-full ring-1 ring-teal-200/30" />
      {/* A single amber service pin for brand identity */}
      <span className="absolute left-[52%] top-[44%] size-3 -translate-x-1/2 rounded-full bg-honey-400 shadow-[0_0_14px_4px_rgba(239,164,23,0.65)]" />
    </div>
  );
}
