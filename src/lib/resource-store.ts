import type { Prisma, Resource as ResourceRow } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { deriveNeeds, normalizeImportRows, normalizeResource } from "@/lib/resource-normalization";
import { cleanText } from "@/lib/utils";
import type {
  Resource,
  ResourceImportRow,
  ResourceImportSummary,
  ResourceSearchParams,
  ResourceSearchResult,
} from "@/lib/types";

// Map a database row to the app's Resource shape. Running it back through
// normalizeResource restores derived fields (lat/lng aliases, defaults) so the
// shape is identical to the previous JSON-backed store.
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
  // Replace the full set atomically to preserve the previous "save the whole
  // array" contract.
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

function matchesSearch(resource: Resource, params: ResourceSearchParams) {
  const query = params.query?.trim().toLowerCase() ?? "";
  const city = params.city?.trim().toLowerCase() ?? "";
  const category = params.category?.trim().toLowerCase() ?? "";
  const needs = (params.needs ?? []).map((need) => need.toLowerCase());

  const haystack = [
    resource.name,
    resource.description,
    resource.address,
    resource.city,
    resource.state,
    resource.stateLocation,
    resource.phone,
    resource.services.join(" "),
    resource.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  const resourceNeeds = deriveNeeds(resource);

  return (
    (!query || haystack.includes(query)) &&
    (!city || resource.city.toLowerCase().includes(city)) &&
    (!category || resource.category.toLowerCase() === category) &&
    (needs.length === 0 || needs.some((need) => resourceNeeds.includes(need as never)))
  );
}

function scoreResource(resource: Resource, params: ResourceSearchParams) {
  const query = params.query?.trim().toLowerCase() ?? "";
  const needs = (params.needs ?? []).map((need) => need.toLowerCase());
  const haystack = `${resource.name} ${resource.description} ${resource.services.join(" ")} ${resource.tags.join(" ")}`.toLowerCase();

  let score = 0;
  if (query) {
    if (resource.name.toLowerCase().includes(query)) score += 5;
    if (haystack.includes(query)) score += 2;
  }

  const resourceNeeds = deriveNeeds(resource);
  score += resourceNeeds.filter((need) => needs.includes(need)).length * 3;

  if (params.city && resource.city.toLowerCase() === params.city.toLowerCase()) {
    score += 2;
  }

  return score;
}

export async function searchResources(params: ResourceSearchParams = {}): Promise<ResourceSearchResult> {
  const resources = await getResources();
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 9, 1), 24);

  const filtered = resources
    .filter((resource) => matchesSearch(resource, params))
    .sort((a, b) => scoreResource(b, params) - scoreResource(a, params) || a.name.localeCompare(b.name));

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total: filtered.length,
    page,
    pageSize,
    hasMore: start + pageSize < filtered.length,
    counts: {
      totalResources: resources.length,
      categories: new Set(resources.map((resource) => resource.category)).size,
      cities: new Set(resources.map((resource) => cleanText(resource.city)).filter(Boolean)).size,
    },
  };
}

export async function getResourceFilterOptions() {
  const resources = await getResources();
  return {
    categories: Array.from(new Set(resources.map((resource) => resource.category))).sort(),
    cities: Array.from(new Set(resources.map((resource) => cleanText(resource.city)).filter(Boolean))).sort(),
  };
}
