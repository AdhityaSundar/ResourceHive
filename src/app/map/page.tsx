import { MapPageClient } from "@/components/pages/map-page-client";
import { getResources } from "@/lib/resource-store";

export default async function MapPage() {
  const resources = await getResources();

  return <MapPageClient resources={resources} />;
}
