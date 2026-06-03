"use client";

import Link from "next/link";
import { LifeBuoy, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { useLocale } from "@/components/providers/locale-provider";

export function EmergencyBanner() {
  const { messages } = useLocale();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      role="region"
      aria-label="Urgent support"
      initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-3 rounded-2xl border border-honey-300/80 bg-white px-4 py-3.5 shadow-e3 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center hex-clip bg-[linear-gradient(135deg,var(--honey-300),var(--honey-500))]"
          >
            <LifeBuoy className="size-5 text-honey-800" />
          </span>
          <p className="text-sm font-semibold leading-snug text-teal-900">
            {messages.common.emergencyBanner}
          </p>
        </div>
        <Link
          href="/resources?category=Shelter"
          className="interactive-glow inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-600"
        >
          <Phone className="size-4" />
          {messages.common.emergencyAction}
        </Link>
      </div>
    </motion.div>
  );
}
