import { cn } from "@/lib/utils";

/**
 * Zero-JS static globe used for the reduced-motion and no-WebGL fallbacks.
 * A CSS sphere built from the day texture with a terminator shadow and a warm
 * amber atmosphere ring — reads as a planet without any canvas/animation.
 */
export function GlobeStatic({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative aspect-square w-full max-w-[min(80vw,460px)]", className)}
      role="img"
      aria-label="Globe representing ResourceHive's reach"
    >
      {/* Warm atmosphere glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(244,190,78,0.5),transparent_62%)] blur-xl" />
      {/* The planet */}
      <div
        className="absolute inset-[6%] rounded-full bg-cover bg-center shadow-[inset_-22px_-18px_60px_rgba(7,33,42,0.8),inset_14px_10px_40px_rgba(244,190,78,0.28)]"
        style={{ backgroundImage: "url(/textures/earth_atmos_2048.jpg)" }}
      />
      {/* Rim light */}
      <div className="absolute inset-[6%] rounded-full ring-1 ring-honey-200/40" />
    </div>
  );
}
