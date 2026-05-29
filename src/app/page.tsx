import { HomePageClient } from "@/components/pages/home-page-client";
import { getResources } from "@/lib/resource-store";

export default async function Home() {
  const resources = await getResources();
  const cityOptions = Array.from(new Set(resources.map((resource) => resource.city))).sort();
  const partnerCount = new Set(resources.map((resource) => resource.sourceRef || resource.name)).size;

  return <HomePageClient resources={resources} cityOptions={cityOptions} partnerCount={partnerCount} />;
}
