import { redirect } from "next/navigation";

import { AdminPanelClient } from "@/components/admin/admin-panel-client";
import { getResources } from "@/lib/resource-store";
import { getAuthContext } from "@/lib/supabase/auth";

export default async function AdminPage() {
  const { user, isAdmin } = await getAuthContext();
  if (!user) {
    redirect("/login?redirect=/admin");
  }
  if (!isAdmin) {
    redirect("/preferences");
  }

  const resources = await getResources();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <AdminPanelClient initialResources={resources} />
    </div>
  );
}
