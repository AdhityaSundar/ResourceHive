"use client";

import { motion, useReducedMotion } from "framer-motion";

// Signature easing — a slow, confident settle (same curve the reference design
// uses throughout). Shared so every entrance in the app feels deliberate.
const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  // Respect prefers-reduced-motion: render statically, no transform/opacity animation.
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  );
}
