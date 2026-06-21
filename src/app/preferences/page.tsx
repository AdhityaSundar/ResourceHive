import { redirect } from "next/navigation";

import { PreferencesClient } from "@/components/preferences/preferences-client";
import { getResources, getResourcesByOwner } from "@/lib/resource-store";
import { getSessionUser } from "@/lib/supabase/auth";

export default async function PreferencesPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?redirect=/preferences");
  }

  const [owned, globalResources] = await Promise.all([
    getResourcesByOwner(user.id),
    getResources(),
  ]);

  return <PreferencesClient initialOwned={owned} globalResources={globalResources} />;
}
