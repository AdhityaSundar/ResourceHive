import { ResourcesPageClient } from "@/components/pages/resources-page-client";
import { getResources, searchResources } from "@/lib/resource-store";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; city?: string; query?: string; need?: string | string[] }>;
}) {
  const resources = await getResources();
  const params = await searchParams;
  const needs = Array.isArray(params.need) ? params.need : params.need ? [params.need] : [];
  const initialResult = await searchResources({
    category: params.category,
    city: params.city,
    query: params.query,
    needs,
    page: 1,
    pageSize: 9,
  });

  return (
    <ResourcesPageClient
      initialResources={resources}
      initialResult={initialResult}
      initialCategory={params.category ?? ""}
      initialCity={params.city ?? ""}
      initialQuery={params.query ?? ""}
      initialNeeds={needs}
    />
  );
}
