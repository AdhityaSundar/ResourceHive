"use client";

import { useRouter } from "next/navigation";
import { Heart, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { localizeCategory } from "@/lib/i18n";
import type { Resource } from "@/lib/types";
import { formatLocation, formatPhone } from "@/lib/utils";

export function ResourceCard({ resource }: { resource: Resource }) {
  const { saved, toggleSaved, recordView } = useAuth();
  const { locale, messages } = useLocale();
  const router = useRouter();
  const isSaved = saved.some((item) => item.resourceId === resource.id);
  const location = formatLocation(resource);
  const phone = formatPhone(resource.phone);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-panel group interactive-glow flex h-full flex-col rounded-[30px] border border-white/40 p-6 transition duration-300 hover:shadow-[0_24px_56px_rgba(168,85,247,0.14)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge className="border-fuchsia-200 bg-fuchsia-50/80 text-fuchsia-500">
            {localizeCategory(resource.category, locale)}
          </Badge>
          <h3 className="mt-4 text-2xl font-bold text-[#2a1833]">{resource.name}</h3>
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(resource.id)}
          className="interactive-glow rounded-full border border-white/50 bg-white/55 p-2 text-[#8a7696] transition hover:border-fuchsia-200 hover:text-fuchsia-500"
          aria-label={messages.common.saveResource}
        >
          <Heart className={`size-5 ${isSaved ? "fill-fuchsia-500 text-fuchsia-500" : ""}`} />
        </button>
      </div>

      {resource.description ? (
        <p className="mt-4 flex-1 leading-7 text-[#526d72]">{resource.description}</p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-5 space-y-3 text-sm text-[#526d72]">
        {location ? (
          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <span>{location}</span>
          </div>
        ) : null}
        {phone ? (
          <div className="flex gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <span>{phone}</span>
          </div>
        ) : null}
        {resource.email ? (
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <span>{resource.email}</span>
          </div>
        ) : null}
        {resource.contactName ? (
          <div className="flex gap-3">
            <UserRound className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <span>{resource.contactName}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex gap-3 border-t border-white/40 pt-5">
        <button
          type="button"
          onClick={() => {
            recordView(resource.id);
            router.push(`/resource/${resource.id}`);
          }}
          className="interactive-glow inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#a855f7,#ec4899)] px-5 text-sm font-semibold text-white transition"
        >
          {messages.common.viewDetails}
        </button>
      </div>
    </motion.article>
  );
}
