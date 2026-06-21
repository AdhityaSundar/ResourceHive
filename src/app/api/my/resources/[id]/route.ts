import { NextResponse } from "next/server";

import { deleteResource, getResourceById, upsertResource } from "@/lib/resource-store";
import { normalizeResource } from "@/lib/resource-normalization";
import { getSessionUser } from "@/lib/supabase/auth";
import type { Resource } from "@/lib/types";

// Edit/remove one of the signed-in user's OWN personal resources. Ownership is
// verified server-side: you can only touch resources whose ownerId is yours.

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getResourceById(id);
  if (!existing || existing.ownerId !== user.id) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const payload = (await request.json()) as Resource;
  const resource = await upsertResource(
    normalizeResource({
      ...payload,
      id,
      ownerId: user.id,
      ownerEmail: user.email ?? undefined,
      sourceType: "manual",
      sourceRef: existing.sourceRef || "my-resources",
      updatedAt: new Date().toISOString(),
    }),
  );
  return NextResponse.json(resource);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getResourceById(id);
  if (!existing || existing.ownerId !== user.id) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  await deleteResource(id);
  return NextResponse.json({ ok: true });
}
