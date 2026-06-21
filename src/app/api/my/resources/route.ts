import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { getResourcesByOwner, upsertResource } from "@/lib/resource-store";
import { normalizeResource } from "@/lib/resource-normalization";
import { getSessionUser } from "@/lib/supabase/auth";
import type { Resource } from "@/lib/types";

// Personal resources: each signed-in user's own list. These never appear in the
// public directory — only on the owner's "My Resources" page.

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const resources = await getResourcesByOwner(user.id);
  return NextResponse.json({ items: resources });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const payload = (await request.json()) as Resource;
  // Identity is derived from the session, never trusted from the client. A fresh
  // id avoids collisions with global resources or other users' submissions.
  const resource = await upsertResource(
    normalizeResource({
      ...payload,
      id: randomUUID(),
      ownerId: user.id,
      ownerEmail: user.email ?? undefined,
      sourceType: "manual",
      sourceRef: "my-resources",
      updatedAt: new Date().toISOString(),
    }),
  );
  return NextResponse.json(resource, { status: 201 });
}
