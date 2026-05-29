import { promises as fs } from "fs";
import path from "path";

import { deriveNeeds, normalizeImportRows, normalizeResource } from "@/lib/resource-normalization";
import { cleanText } from "@/lib/utils";
import type {
  Resource,
  ResourceImportRow,
  ResourceImportSummary,
  ResourceSearchParams,
  ResourceSearchResult,
} from "@/lib/types";

const dataFile = path.join(process.cwd(), "src", "data", "resources.json");

async function ensureDataFile() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
}

async function readDataFile(): Promise<Resource[]> {
  await ensureDataFile();
  const file = await fs.readFile(dataFile, "utf8");
  const parsed = JSON.parse(file) as Array<Partial<Resource> & { name: string }>;
  return parsed.map((resource) => normalizeResource(resource));
}

export async function getResources(): Promise<Resource[]> {
  return readDataFile();
}

export async function getResourceById(id: string) {
  const resources = await getResources();
  return resources.find((resource) => resource.id === id) ?? null;
}

export async function saveResources(resources: Resource[]) {
  await ensureDataFile();
  const normalized = resources.map((resource) => normalizeResource(resource));
  await fs.writeFile(dataFile, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
}

export async function upsertResource(resource: Resource) {
  const resources = await getResources();
  const normalized = normalizeResource(resource);
  const index = resources.findIndex((item) => item.id === normalized.id);

  if (index >= 0) {
    resources[index] = normalized;
  } else {
    resources.unshift(normalized);
  }

  await saveResources(resources);
  return normalized;
}

export async function deleteResource(id: string) {
  const resources = await getResources();
  const nextResources = resources.filter((resource) => resource.id !== id);
  await saveResources(nextResources);
  return nextResources;
}

export async function importResourcesFromRows(
  rows: ResourceImportRow[],
  sourceRef: string,
): Promise<ResourceImportSummary> {
  const current = await getResources();
  const summary = normalizeImportRows(rows, sourceRef);
  const merged = new Map(current.map((resource) => [resource.id, resource]));

  summary.resources.forEach((resource) => {
    merged.set(resource.id, normalizeResource(resource));
  });

  await saveResources(Array.from(merged.values()));
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
