// Seeds the Supabase/Postgres `resources` table from the existing JSON file.
// Idempotent: it clears the table and reloads it. Run with `npm run db:seed`.
import { readFile } from "node:fs/promises";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dataFile = path.join(process.cwd(), "src", "data", "resources.json");

const str = (value, fallback = "") =>
  typeof value === "string" && value.trim() ? value : fallback;
const arr = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const num = (value, fallback) => (Number.isFinite(value) ? value : fallback);

async function main() {
  const raw = await readFile(dataFile, "utf8");
  const resources = JSON.parse(raw);

  const data = resources.map((r) => ({
    id: str(r.id),
    name: str(r.name),
    category: str(r.category, "Resource"),
    description: str(r.description),
    services: arr(r.services),
    address: str(r.address),
    city: str(r.city),
    state: str(r.state),
    zip: str(r.zip),
    stateLocation: str(r.stateLocation),
    phone: str(r.phone),
    email: str(r.email),
    contactName: str(r.contactName),
    resourceInformation: str(r.resourceInformation),
    info: str(r.info),
    website: str(r.website),
    hours: str(r.hours),
    languages: arr(r.languages),
    tags: arr(r.tags),
    latitude: num(r.latitude, 32.7767),
    longitude: num(r.longitude, -96.797),
    eligibility: str(r.eligibility),
    sourceType: str(r.sourceType, "manual"),
    sourceRef: str(r.sourceRef),
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
  }));

  await prisma.$transaction([
    prisma.resource.deleteMany({}),
    prisma.resource.createMany({ data }),
  ]);

  console.log(`Seeded ${data.length} resources into the database.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
