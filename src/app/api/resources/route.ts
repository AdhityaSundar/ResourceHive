import { NextResponse } from "next/server";

import {
  getResourceFilterOptions,
  searchResources,
  upsertResource,
} from "@/lib/resource-store";
import { normalizeResource } from "@/lib/resource-normalization";
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

export async function POST(request: Request) {
  const payload = (await request.json()) as Resource;
  const resource = await upsertResource(normalizeResource(payload));
  return NextResponse.json(resource, { status: 201 });
}
