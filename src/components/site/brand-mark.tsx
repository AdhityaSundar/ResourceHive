"use client";

import Image from "next/image";

import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const { messages } = useLocale();

  return (
    <div className={cn("logo-hover relative inline-flex size-11 shrink-0 items-center justify-center", className)}>
      <Image
        src="/logo.png"
        alt={messages.shell.brandLogoAlt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 40px, (max-width: 1024px) 56px, 120px"
        className="object-contain"
      />
    </div>
  );
}
