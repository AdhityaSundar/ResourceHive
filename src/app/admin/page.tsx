import { AdminPanelClient } from "@/components/admin/admin-panel-client";
import { getResources } from "@/lib/resource-store";

export default async function AdminPage() {
  const resources = await getResources();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <AdminPanelClient initialResources={resources} />
    </div>
  );
}
