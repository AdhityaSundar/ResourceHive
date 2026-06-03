import type { Prisma, Resource as ResourceRow } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { normalizeImportRows, normalizeResource } from "@/lib/resource-normalization";
import type { Resource, ResourceImportRow, ResourceImportSummary } from "@/lib/types";

// Supabase/Postgres-backed resource store (via Prisma). Selected by
// resource-store.ts when DATABASE_URL is configured.

// Map a database row to the app's Resource shape. Running it back through
// normalizeResource restores derived fields (lat/lng aliases, defaults).
function toResource(row: ResourceRow): Resource {
  return normalizeResource({
    ...row,
    category: row.category as Resource["category"],
    stateLocation: row.stateLocation ?? "",
    email: row.email ?? "",
    contactName: row.contactName ?? "",
    resourceInformation: row.resourceInformation ?? "",
    info: row.info ?? "",
    sourceRef: row.sourceRef ?? "",
    sourceType: row.sourceType as Resource["sourceType"],
    updatedAt: row.updatedAt.toISOString(),
  });
}

// Pick only the columns Prisma knows about (drops lat/lng aliases) and convert
// updatedAt back to a Date for Postgres.
function toPrismaData(resource: Resource): Prisma.ResourceCreateInput {
  const normalized = normalizeResource(resource);
  return {
    id: normalized.id,
    name: normalized.name,
    category: normalized.category,
    description: normalized.description,
    services: normalized.services,
    address: normalized.address,
    city: normalized.city,
    state: normalized.state,
    zip: normalized.zip,
    stateLocation: normalized.stateLocation ?? "",
    phone: normalized.phone,
    email: normalized.email ?? "",
    contactName: normalized.contactName ?? "",
    resourceInformation: normalized.resourceInformation ?? "",
    info: normalized.info ?? "",
    website: normalized.website,
    hours: normalized.hours,
    languages: normalized.languages,
    tags: normalized.tags,
    latitude: normalized.latitude,
    longitude: normalized.longitude,
    eligibility: normalized.eligibility,
    sourceType: normalized.sourceType,
    sourceRef: normalized.sourceRef ?? "",
    updatedAt: new Date(normalized.updatedAt),
  };
}

export async function getResources(): Promise<Resource[]> {
  const rows = await prisma.resource.findMany({ orderBy: { updatedAt: "desc" } });
  return rows.map(toResource);
}

export async function getResourceById(id: string) {
  const row = await prisma.resource.findUnique({ where: { id } });
  return row ? toResource(row) : null;
}

export async function saveResources(resources: Resource[]) {
  const data = resources.map(toPrismaData);
  await prisma.$transaction([
    prisma.resource.deleteMany({}),
    prisma.resource.createMany({ data }),
  ]);
}

export async function upsertResource(resource: Resource) {
  const data = toPrismaData(resource);
  const row = await prisma.resource.upsert({
    where: { id: data.id },
    create: data,
    update: data,
  });
  return toResource(row);
}

export async function deleteResource(id: string) {
  await prisma.resource.deleteMany({ where: { id } });
  return getResources();
}

export async function importResourcesFromRows(
  rows: ResourceImportRow[],
  sourceRef: string,
): Promise<ResourceImportSummary> {
  const summary = normalizeImportRows(rows, sourceRef);

  if (summary.resources.length > 0) {
    await prisma.$transaction(
      summary.resources.map((resource) => {
        const data = toPrismaData(resource);
        return prisma.resource.upsert({
          where: { id: data.id },
          create: data,
          update: data,
        });
      }),
    );
  }

  return summary;
}
