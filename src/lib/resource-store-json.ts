import { promises as fs } from "fs";
import path from "path";

import { normalizeImportRows, normalizeResource } from "@/lib/resource-normalization";
import type { Resource, ResourceImportRow, ResourceImportSummary } from "@/lib/types";

// Local JSON-file resource store. Selected by resource-store.ts when
// DATABASE_URL is NOT configured, so the app runs without a database during
// design/development. Reads and writes src/data/resources.json.

const dataFile = path.join(process.cwd(), "src", "data", "resources.json");

async function ensureDataFile() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
}

// Reads every record (global + personal). Used internally by the mutations so
// they never drop personal resources; callers should use getResources (global)
// or getResourcesByOwner instead.
async function readAll(): Promise<Resource[]> {
  await ensureDataFile();
  const file = await fs.readFile(dataFile, "utf8");
  const parsed = JSON.parse(file) as Array<Partial<Resource> & { name: string }>;
  return parsed.map((resource) => normalizeResource(resource));
}

// Public directory = global resources only (no owner).
export async function getResources(): Promise<Resource[]> {
  const resources = await readAll();
  return resources.filter((resource) => !resource.ownerId);
}

export async function getResourcesByOwner(ownerId: string): Promise<Resource[]> {
  const resources = await readAll();
  return resources.filter((resource) => resource.ownerId === ownerId);
}

export async function getResourceById(id: string) {
  const resources = await readAll();
  return resources.find((resource) => resource.id === id) ?? null;
}

export async function saveResources(resources: Resource[]) {
  await ensureDataFile();
  const normalized = resources.map((resource) => normalizeResource(resource));
  await fs.writeFile(dataFile, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
}

export async function upsertResource(resource: Resource) {
  const resources = await readAll();
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
  const resources = await readAll();
  const nextResources = resources.filter((resource) => resource.id !== id);
  await saveResources(nextResources);
  return nextResources;
}

export async function importResourcesFromRows(
  rows: ResourceImportRow[],
  sourceRef: string,
): Promise<ResourceImportSummary> {
  const current = await readAll();
  const summary = normalizeImportRows(rows, sourceRef);
  const merged = new Map(current.map((resource) => [resource.id, resource]));

  summary.resources.forEach((resource) => {
    merged.set(resource.id, normalizeResource(resource));
  });

  await saveResources(Array.from(merged.values()));
  return summary;
}
