import type {
  Resource,
  ResourceCategory,
  ResourceImportRow,
  ResourceImportSummary,
  ResourceNeed,
} from "@/lib/types";
import {
  cleanText,
  isEmailLike,
  isLikelyContactName,
  isLocationLike,
  isPhoneLike,
  normalizeContactFields,
  normalizeState,
} from "@/lib/utils";

const categoryKeywordMap: Array<{ category: ResourceCategory; keywords: string[] }> = [
  { category: "Food", keywords: ["food", "pantry", "meal", "produce", "snap"] },
  { category: "Shelter", keywords: ["shelter", "housing", "rent", "utility", "homeless"] },
  { category: "Jobs", keywords: ["job", "career", "employment", "workforce", "training", "re-entry"] },
  { category: "Healthcare", keywords: ["health", "clinic", "medical", "dental", "mental"] },
  { category: "Education", keywords: ["education", "school", "ged", "tutor", "scholarship"] },
  { category: "Legal", keywords: ["legal", "rights", "advocacy", "eviction"] },
  { category: "Youth", keywords: ["youth", "teen", "children", "kids"] },
  { category: "Community", keywords: ["community", "family", "support", "volunteer"] },
  { category: "Resource", keywords: [] },
];

function asString(value: unknown) {
  return cleanText(value);
}

function splitList(value: unknown) {
  const normalized = asString(value);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/[,;/]|\n/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function inferCategory(input: string): ResourceCategory {
  const normalized = cleanText(input).toLowerCase();
  if (!normalized) {
    return "Resource";
  }

  const directMatch = categoryKeywordMap.find(
    (entry) =>
      entry.category.toLowerCase() === normalized ||
      entry.keywords.some((keyword) => normalized.includes(keyword)),
  );

  return directMatch?.category ?? "Resource";
}

export function deriveNeeds(resource: Resource): ResourceNeed[] {
  const haystack = [
    resource.category,
    resource.description,
    resource.services.join(" "),
    resource.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  const needs = new Set<ResourceNeed>();

  if (/food|pantry|meal|produce|snap/.test(haystack)) needs.add("food");
  if (/shelter|housing|rent|utility|homeless/.test(haystack)) needs.add("shelter");
  if (/job|career|employment|resume|training|workforce|re-entry/.test(haystack)) needs.add("jobs");
  if (/health|clinic|medical|dental|mental/.test(haystack)) needs.add("healthcare");
  if (/education|school|ged|tutor|scholarship|youth/.test(haystack)) needs.add("education");

  return Array.from(needs);
}

export function normalizeResource(input: Partial<Resource> & { name: string }): Resource {
  const resourceInformation = cleanText(input.resourceInformation);
  const info = cleanText(input.info);
  const description = cleanText(input.description) || resourceInformation || info;
  const services = input.services?.length
    ? input.services.map(cleanText).filter(Boolean)
    : [];
  const tags = input.tags?.length ? input.tags.map(cleanText).filter(Boolean) : [];
  const latitude = typeof input.latitude === "number" && Number.isFinite(input.latitude) ? input.latitude : 32.7767;
  const longitude =
    typeof input.longitude === "number" && Number.isFinite(input.longitude) ? input.longitude : -96.797;
  const contacts = normalizeContactFields({
    phone: input.phone,
    email: input.email,
    contactName: input.contactName,
  });

  return {
    id: cleanText(input.id) || slugify(input.name),
    name: cleanText(input.name),
    category: input.category ? inferCategory(input.category) : "Resource",
    description,
    services,
    address: cleanText(input.address),
    city: titleCase(cleanText(input.city)),
    state: normalizeState(input.state),
    zip: cleanText(input.zip),
    stateLocation: isLocationLike(input.stateLocation) ? cleanText(input.stateLocation) : "",
    phone: contacts.phone,
    email: contacts.email,
    contactName: contacts.contactName,
    resourceInformation,
    info,
    website: cleanText(input.website),
    hours: cleanText(input.hours),
    languages: input.languages?.length ? input.languages.map(cleanText).filter(Boolean) : [],
    tags,
    latitude,
    longitude,
    lat: latitude,
    lng: longitude,
    eligibility: cleanText(input.eligibility),
    sourceType: input.sourceType ?? "manual",
    sourceRef: cleanText(input.sourceRef),
    ownerId: cleanText(input.ownerId) || undefined,
    ownerEmail: cleanText(input.ownerEmail) || undefined,
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}

function getField(row: ResourceImportRow, candidates: string[]) {
  const keys = Object.keys(row);
  const exactKey = keys.find((key) => {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]+/g, "");
    return candidates.some((candidate) => normalized === candidate);
  });

  if (exactKey) {
    return row[exactKey];
  }

  for (const key of keys) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (candidates.some((candidate) => candidate.length > 4 && normalized.includes(candidate))) {
      return row[key];
    }
  }

  return undefined;
}

export function normalizeImportRows(
  rows: ResourceImportRow[],
  sourceRef: string,
): ResourceImportSummary {
  const resources: Resource[] = [];
  const errors: string[] = [];
  let skipped = 0;

  rows.forEach((row, index) => {
    const name = asString(getField(row, ["name", "resourcename", "organization"]));
    if (!name) {
      skipped += 1;
      return;
    }

    try {
      const categoryRaw = asString(getField(row, ["category"]));
      const rawPhone = getField(row, ["phonenumber", "phone", "contactnumber"]);
      const rawEmail = getField(row, ["email"]);
      const rawContactName = getField(row, ["contactname", "contact"]);
      const resourceInformation =
        asString(getField(row, ["resourceinformation"])) ||
        (!isLikelyContactName(rawContactName) ? asString(rawContactName) : "");
      const info = asString(getField(row, ["info"]));
      const description = resourceInformation || info;
      const phone = isPhoneLike(rawPhone) ? asString(rawPhone) : isPhoneLike(rawEmail) ? asString(rawEmail) : "";
      const email = isEmailLike(rawEmail) ? asString(rawEmail) : isEmailLike(rawPhone) ? asString(rawPhone) : "";

      const resource = normalizeResource({
        name,
        category: inferCategory(categoryRaw),
        description,
        services: splitList(getField(row, ["services", "service", "tags"])),
        address: asString(getField(row, ["streetaddress", "address"])),
        city: asString(getField(row, ["city"])),
        state: asString(getField(row, ["state"])),
        zip: asString(getField(row, ["zipcode", "zip"])),
        stateLocation: asString(getField(row, ["statelocation"])),
        phone,
        email,
        contactName: asString(rawContactName),
        resourceInformation,
        info,
        website: asString(getField(row, ["website", "url"])),
        eligibility: asString(getField(row, ["eligibility"])),
        sourceType: "spreadsheet",
        sourceRef,
        latitude: Number(asString(getField(row, ["latitude", "lat"]))) || 32.7767,
        longitude: Number(asString(getField(row, ["longitude", "lng", "lon"]))) || -96.797,
      });

      resources.push(resource);
    } catch (error) {
      errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : "Unable to parse row"}`);
    }
  });

  return {
    imported: resources.length,
    skipped,
    errors,
    resources,
  };
}
