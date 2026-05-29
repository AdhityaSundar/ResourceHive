"use client";

import { GoogleResourceMap } from "@/components/maps/google-resource-map";
import type { Resource } from "@/lib/types";

export function ResourcePreviewMap({ resource }: { resource: Resource }) {
  return <GoogleResourceMap resources={[resource]} activeId={resource.id} className="h-60" />;
}
