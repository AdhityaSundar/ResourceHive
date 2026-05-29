"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

import { useLocale } from "@/components/providers/locale-provider";

export function EmergencyBanner() {
  const { messages } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="glass-panel flex flex-col gap-4 rounded-[28px] border border-white/40 bg-[linear-gradient(120deg,rgba(255,255,255,0.52),rgba(252,231,243,0.42))] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl bg-sky-100 p-2 text-emerald-600">
            <AlertTriangle className="size-5" />
          </div>
          <p className="max-w-3xl text-sm font-medium text-[#264653]">{messages.common.emergencyBanner}</p>
        </div>
        <Link href="/resources?category=Shelter" className="text-sm font-semibold text-emerald-600 hover:text-sky-500">
          {messages.common.emergencyAction}
        </Link>
      </div>
    </motion.div>
  );
}

