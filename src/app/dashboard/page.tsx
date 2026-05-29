import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getResources } from "@/lib/resource-store";

export default async function DashboardPage() {
  const resources = await getResources();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <DashboardClient resources={resources} />
    </div>
  );
}
