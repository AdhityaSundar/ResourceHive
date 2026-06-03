import { cn } from "@/lib/utils";

/**
 * A small bumblebee mark (on-brand for the hive). Decorative. The hero drives
 * its flight path across the globe; this just renders the bee with a faint
 * idle bob and translucent wings.
 */
export function Bee({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("drop-shadow-[0_0_14px_rgba(244,190,78,0.75)]", className)}
    >
      {/* wings */}
      <g className="origin-center">
        <ellipse cx="26" cy="20" rx="11" ry="7" fill="#ffffff" opacity="0.78" transform="rotate(-24 26 20)" />
        <ellipse cx="40" cy="20" rx="11" ry="7" fill="#ffffff" opacity="0.78" transform="rotate(24 40 20)" />
      </g>
      {/* body */}
      <g transform="rotate(18 32 36)">
        <ellipse cx="32" cy="36" rx="15.5" ry="11.5" fill="#3a2a12" />
        <ellipse cx="32" cy="36" rx="15" ry="11" fill="#2b2118" />
        <path d="M22 30c4 5 16 5 20 0l-2-3c-3 3.5-13 3.5-16 0z" fill="#f5b301" />
        <path d="M19 36c6 5 20 5 26 0v3c-6 5-20 5-26 0z" fill="#f5b301" />
        <path d="M22 42c4 4 14 4 18 0l-1 3c-4 3-12 3-16 0z" fill="#f5b301" />
        {/* stinger + head */}
        <circle cx="47" cy="34" r="4.5" fill="#1f2937" />
        <circle cx="48.5" cy="32.5" r="1" fill="#ffffff" opacity="0.85" />
      </g>
    </svg>
  );
}
