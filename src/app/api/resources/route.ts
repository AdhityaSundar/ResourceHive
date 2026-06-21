import { NextResponse } from "next/server";

import {
  getResourceFilterOptions,
  searchResources,
  upsertResource,
} from "@/lib/resource-store";
import { normalizeResource } from "@/lib/resource-normalization";
import { getAuthContext } from "@/lib/supabase/auth";
import type { Resource, ResourceSearchParams } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParams: ResourceSearchParams = {
    query: searchParams.get("query") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    needs: searchParams.getAll("need"),
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
  };

  const [results, filters] = await Promise.all([searchResources(queryParams), getResourceFilterOptions()]);

  return NextResponse.json({
    ...results,
    filters,
  });
}

// Creates/updates a GLOBAL (public-directory) resource — admins only.
export async function POST(request: Request) {
  const { isAdmin } = await getAuthContext();
  if (!isAdmin) {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }

  const payload = (await request.json()) as Resource;
  // Force global ownership regardless of what the client sends.
  const resource = await upsertResource(
    normalizeResource({ ...payload, ownerId: undefined, ownerEmail: undefined }),
  );
  return NextResponse.json(resource, { status: 201 });
}
