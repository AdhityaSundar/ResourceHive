import fs from "fs/promises";
import path from "path";
import XLSX from "xlsx";

const inputPath =
  process.env.SHEET_PATH ?? "C:/Users/Adhit/Downloads/Resource List.xlsx";
const worksheetName = process.env.SHEET_NAME ?? "Resource List";
const outputPath = path.join(process.cwd(), "src", "data", "resources.json");
const missingValues = new Set(["", "n/a", "na", "none", "null", "undefined", "nan", "-"]);

function cleanText(value) {
  if (value == null) return "";
  if (typeof value === "number") return Number.isFinite(value) ? String(value).trim() : "";
  const normalized = String(value).replace(/\s+/g, " ").trim();
  return missingValues.has(normalized.toLowerCase()) ? "" : normalized;
}

function asString(value) {
  return cleanText(value);
}

function splitList(value) {
  return asString(value)
    .split(/[,;/]|\n/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function inferCategory(text) {
  const haystack = asString(text).toLowerCase();
  if (!haystack) return "Resource";
  if (/food|pantry|meal|produce|snap/.test(haystack)) return "Food";
  if (/shelter|housing|rent|utility|homeless/.test(haystack)) return "Shelter";
  if (/job|career|employment|training|re-entry|workforce/.test(haystack)) return "Jobs";
  if (/health|clinic|medical|dental|mental/.test(haystack)) return "Healthcare";
  if (/education|school|ged|tutor|scholarship/.test(haystack)) return "Education";
  if (/legal|rights|advocacy|eviction/.test(haystack)) return "Legal";
  if (/youth|teen|children|kids/.test(haystack)) return "Youth";
  return "Resource";
}

function normalizeState(value) {
  const normalized = cleanText(value);
  if (!normalized) return "";
  const compact = normalized.toLowerCase().replace(/[^a-z]/g, "");
  if (compact === "texas" || compact === "tx") return "TX";
  if (compact === "us" || compact === "usa" || compact === "unitedstates") return "US";
  return normalizeLocationText(normalized.length <= 3 ? normalized.toUpperCase() : normalized);
}

function normalizeLocationText(value) {
  return value
    .replace(/\btexas\b/gi, "TX")
    .replace(/\btx\b/gi, "TX")
    .replace(/\bu\.s\./gi, "US")
    .replace(/\bus\b/gi, "US");
}

function isLocationLike(value) {
  const text = cleanText(value);
  if (!text) return false;
  return /\b(tx|texas|us|u\.s\.|usa|united states)\b/i.test(text) || /\b\d{5}(?:-\d{4})?\b/.test(text);
}

function isPhoneLike(value) {
  const text = cleanText(value);
  if (!text || /@|https?:\/\//i.test(text)) return false;
  const digits = text.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function isEmailLike(value) {
  const text = cleanText(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

function isLikelyContactName(value) {
  const text = cleanText(value);
  if (!text || isPhoneLike(text) || isEmailLike(text) || /https?:\/\/|www\./i.test(text)) return false;
  const words = text.split(/\s+/);
  return text.length <= 64 && words.length <= 6 && !/[.!?]/.test(text);
}

function normalizeContactFields({ phone, email, contactName }) {
  const rawPhone = cleanText(phone);
  const rawEmail = cleanText(email);

  return {
    phone: isPhoneLike(rawPhone) ? rawPhone : isPhoneLike(rawEmail) ? rawEmail : "",
    email: isEmailLike(rawEmail) ? rawEmail : isEmailLike(rawPhone) ? rawPhone : "",
    contactName: isLikelyContactName(contactName) ? cleanText(contactName) : "",
  };
}

function field(row, names) {
  const entries = Object.entries(row);
  const exactEntry = entries.find(([key]) => {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]+/g, "");
    return names.some((name) => normalized === name);
  });

  if (exactEntry) {
    return exactEntry[1];
  }

  for (const [key, value] of entries) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (names.some((name) => name.length > 4 && normalized.includes(name))) {
      return value;
    }
  }
  return "";
}

function normalizeResource(resource) {
  const resourceInformation = asString(resource.resourceInformation);
  const info = asString(resource.info);
  const description = asString(resource.description) || resourceInformation || info;
  const services = resource.services?.length
    ? resource.services.map(cleanText).filter(Boolean)
    : [];
  const contacts = normalizeContactFields(resource);
  const tags = resource.tags?.length ? resource.tags.map(cleanText).filter(Boolean) : [];

  return {
    ...resource,
    id: asString(resource.id) || slugify(resource.name),
    name: asString(resource.name),
    category: inferCategory(resource.category),
    description,
    services,
    address: asString(resource.address),
    city: asString(resource.city),
    state: normalizeState(resource.state),
    zip: asString(resource.zip),
    stateLocation: isLocationLike(resource.stateLocation) ? asString(resource.stateLocation) : "",
    phone: contacts.phone,
    email: contacts.email,
    contactName: contacts.contactName,
    resourceInformation,
    info,
    website: asString(resource.website),
    hours: asString(resource.hours),
    languages: resource.languages?.length ? resource.languages.map(cleanText).filter(Boolean) : [],
    tags,
    latitude: Number(resource.latitude) || 32.7767,
    longitude: Number(resource.longitude) || -96.797,
    eligibility: asString(resource.eligibility),
    sourceType: resource.sourceType || "manual",
    sourceRef: asString(resource.sourceRef),
    updatedAt: resource.updatedAt || new Date().toISOString(),
  };
}

async function readCurrentResources() {
  try {
    const content = await fs.readFile(outputPath, "utf8");
    return JSON.parse(content).map(normalizeResource);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function main() {
  const workbook = XLSX.readFile(inputPath);
  const sheet = workbook.Sheets[worksheetName];

  if (!sheet) {
    throw new Error(`Worksheet "${worksheetName}" was not found in ${inputPath}`);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  const importedResources = rows
    .map((row) => {
      const name = asString(field(row, ["name", "resourcename", "organization"]));
      if (!name) return null;
      const rawContactName = field(row, ["contactname", "contact"]);
      const resourceInformation =
        asString(field(row, ["resourceinformation"])) ||
        (!isLikelyContactName(rawContactName) ? asString(rawContactName) : "");
      const info = asString(field(row, ["info"]));
      const description =
        resourceInformation ||
        asString(field(row, ["description", "information"])) ||
        info;
      const services = splitList(field(row, ["services", "tags"]));
      const rawPhone = field(row, ["phonenumber", "phone"]);
      const rawEmail = field(row, ["email"]);

      return normalizeResource({
        id: slugify(name),
        name,
        category: inferCategory(asString(field(row, ["category"]))),
        description,
        services,
        address: asString(field(row, ["streetaddress", "address"])),
        city: asString(field(row, ["city"])),
        state: asString(field(row, ["state"])),
        zip: asString(field(row, ["zipcode", "zip"])),
        stateLocation: asString(field(row, ["statelocation"])),
        phone: isPhoneLike(rawPhone) ? asString(rawPhone) : isPhoneLike(rawEmail) ? asString(rawEmail) : "",
        email: isEmailLike(rawEmail) ? asString(rawEmail) : isEmailLike(rawPhone) ? asString(rawPhone) : "",
        contactName: asString(rawContactName),
        resourceInformation,
        info,
        website: asString(field(row, ["website", "url"])),
        hours: asString(field(row, ["hours"])),
        languages: splitList(field(row, ["languages"])),
        tags: services.length ? services.map((item) => item.toLowerCase()) : [],
        latitude: Number(asString(field(row, ["latitude", "lat"]))) || 32.7767,
        longitude: Number(asString(field(row, ["longitude", "lng", "lon"]))) || -96.797,
        eligibility: asString(field(row, ["eligibility"])),
        sourceType: "spreadsheet",
        sourceRef: path.basename(inputPath),
        updatedAt: new Date().toISOString(),
      });
    })
    .filter(Boolean);

  const merged = new Map((await readCurrentResources()).map((resource) => [resource.id, resource]));
  importedResources.forEach((resource) => merged.set(resource.id, resource));

  await fs.writeFile(outputPath, `${JSON.stringify(Array.from(merged.values()), null, 2)}\n`, "utf8");
  console.log(
    `Merged ${importedResources.length} resources from "${worksheetName}" in ${inputPath} to ${outputPath}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
