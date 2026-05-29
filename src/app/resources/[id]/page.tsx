import { ResourceNotFoundMessage } from "@/components/resources/resource-not-found-message";
import { ResourceDetailView } from "@/components/resources/resource-detail-view";
import { getResourceById, getResources } from "@/lib/resource-store";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = await getResourceById(id);
  const related = (await getResources())
    .filter((item) => item.category === resource?.category && item.id !== resource?.id)
    .slice(0, 3);

  if (!resource) {
    return <ResourceNotFoundMessage />;
  }

  return <ResourceDetailView resource={resource} related={related} />;
}
