import { Parallax } from "@/components/motion/parallax";
import { cn } from "@/lib/utils";

/**
 * A thin honeycomb band used to separate major homepage sections. Purely
 * decorative; fades out at both edges so it reads as texture, not a rule, and
 * drifts on a gentle parallax as the reader scrolls past.
 */
export function HoneycombDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative mx-auto h-10 w-full max-w-7xl px-4", className)}>
      <Parallax speed={22} className="absolute inset-x-4 inset-y-0">
        <div className="honeycomb-texture-light size-full opacity-70 [mask-image:linear-gradient(90deg,transparent,#000_22%,#000_78%,transparent)]" />
      </Parallax>
    </div>
  );
}
