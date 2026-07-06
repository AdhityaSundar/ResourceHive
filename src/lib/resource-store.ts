import { deriveNeeds } from "@/lib/resource-normalization";
import * as jsonBackend from "@/lib/resource-store-json";
import * as prismaBackend from "@/lib/resource-store-prisma";
import { cleanText } from "@/lib/utils";
import type {
  Resource,
  ResourceSearchParams,
  ResourceSearchResult,
} from "@/lib/types";

// Backend selection: use Supabase/Prisma when DATABASE_URL is configured;
// otherwise fall back to the local JSON file so the app runs without a
// database during design/development. PrismaClient construction is lazy, so
// importing the unused backend is harmless.
const backend = process.env.DATABASE_URL ? prismaBackend : jsonBackend;

export const getResources = backend.getResources;
export const getResourcesByOwner = backend.getResourcesByOwner;
export const getResourceById = backend.getResourceById;
export const saveResources = backend.saveResources;
export const upsertResource = backend.upsertResource;
export const deleteResource = backend.deleteResource;
export const importResourcesFromRows = backend.importResourcesFromRows;

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

// Round-robin across categories so each page leads with a diverse colour mix
// rather than a single-category (single-colour) block. Deterministic + stable.
function interleaveByCategory(items: Resource[]): Resource[] {
  const groups = new Map<string, Resource[]>();
  for (const resource of items) {
    const group = groups.get(resource.category);
    if (group) group.push(resource);
    else groups.set(resource.category, [resource]);
  }
  const buckets = Array.from(groups.keys())
    .sort()
    .map((key) => groups.get(key)!.sort((a, b) => a.name.localeCompare(b.name)));
  const maxLen = buckets.reduce((max, bucket) => Math.max(max, bucket.length), 0);
  const result: Resource[] = [];
  for (let i = 0; i < maxLen; i += 1) {
    for (const bucket of buckets) {
      if (i < bucket.length) result.push(bucket[i]);
    }
  }
  return result;
}

export async function searchResources(params: ResourceSearchParams = {}): Promise<ResourceSearchResult> {
  const resources = await getResources();
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 9, 1), 24);

  const matched = resources.filter((resource) => matchesSearch(resource, params));

  // No active search/category/need filter → lead with a colourful category mix.
  // A specific filter keeps relevance order (and a single category = its colour).
  const hasFilter =
    Boolean(params.query?.trim()) ||
    Boolean(params.category?.trim()) ||
    (params.needs?.length ?? 0) > 0;
  const filtered = hasFilter
    ? matched.sort((a, b) => scoreResource(b, params) - scoreResource(a, params) || a.name.localeCompare(b.name))
    : interleaveByCategory(matched);

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
