import { NextResponse } from "next/server";

import { deleteResource, getResourceById, upsertResource } from "@/lib/resource-store";
import { normalizeResource } from "@/lib/resource-normalization";
import { getAuthContext } from "@/lib/supabase/auth";
import type { Resource } from "@/lib/types";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const resource = await getResourceById(id);

  if (!resource) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(resource);
}

// Editing/removing GLOBAL directory resources — admins only. Users edit their
// own resources through /api/my/resources/[id].
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await getAuthContext();
  if (!isAdmin) {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await getResourceById(id);
  if (existing?.ownerId) {
    return NextResponse.json({ message: "Not a directory resource." }, { status: 403 });
  }

  const payload = (await request.json()) as Resource;
  const resource = await upsertResource(
    normalizeResource({ ...payload, id, ownerId: undefined, ownerEmail: undefined }),
  );
  return NextResponse.json(resource);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { isAdmin } = await getAuthContext();
  if (!isAdmin) {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await getResourceById(id);
  if (existing?.ownerId) {
    return NextResponse.json({ message: "Not a directory resource." }, { status: 403 });
  }

  await deleteResource(id);
  return NextResponse.json({ ok: true });
}
