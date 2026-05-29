import { NextResponse } from "next/server";

import { deleteResource, getResourceById, upsertResource } from "@/lib/resource-store";
import { normalizeResource } from "@/lib/resource-normalization";
import type { Resource } from "@/lib/types";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const resource = await getResourceById(id);

  if (!resource) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(resource);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const payload = (await request.json()) as Resource;
  const resource = await upsertResource(normalizeResource({ ...payload, id }));
  return NextResponse.json(resource);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await deleteResource(id);
  return NextResponse.json({ ok: true });
}
