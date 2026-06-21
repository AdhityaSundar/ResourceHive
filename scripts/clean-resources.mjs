// One-off data-quality pass over src/data/resources.json.
//
// Goal (owner's call): quality over quantity. A resource is only useful if a
// client can actually reach/access it. So we:
//   1. Backfill `website` from domain-style names (e.g. "Freemeals.org").
//   2. Enrich a curated set of well-known brands with their canonical URLs,
//      so we KEEP genuinely accessible resources instead of deleting them.
//   3. Remove any resource left with no phone, email, website, or street
//      address — there is no way to contact or access it.
//
// Re-runnable and idempotent. Run: node scripts/clean-resources.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "..", "src", "data", "resources.json");

const has = (v) =>
  typeof v === "string" ? v.trim().length > 0 : Array.isArray(v) ? v.length > 0 : Boolean(v);

const domainRe = /([a-z0-9][a-z0-9-]*\.(?:org|com|net|gov|edu|io|co|us|info))/i;
const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

// Canonical URLs for unambiguous, well-known resources whose name carries no
// link. Only high-confidence entries — anything uncertain is removed instead.
const KNOWN = {
  // Education / training
  coursera: "https://www.coursera.org",
  edx: "https://www.edx.org",
  futurelearn: "https://www.futurelearn.com",
  udemy: "https://www.udemy.com",
  "khan academy": "https://www.khanacademy.org",
  alison: "https://alison.com",
  "microsoft learn": "https://learn.microsoft.com",
  openlearn: "https://www.open.edu/openlearn",
  codeacademy: "https://www.codecademy.com",
  codecademy: "https://www.codecademy.com",
  "hubspot academy": "https://academy.hubspot.com",
  "google digital garage": "https://grow.google/certificates",
  "ibm skillsbuild": "https://skillsbuild.org",
  "med certs": "https://www.medcerts.com",
  "per scholars": "https://perscholas.org",
  "per scholas": "https://perscholas.org",
  // Buy-now-pay-later / bill pay
  klarna: "https://www.klarna.com",
  affirm: "https://www.affirm.com",
  afterpay: "https://www.afterpay.com",
  sezzle: "https://sezzle.com",
  zip: "https://zip.co",
  zilch: "https://www.zilch.com",
  katapult: "https://katapult.com",
  sunbit: "https://sunbit.com",
  perpay: "https://perpay.com",
  paytient: "https://www.paytient.com",
  snap: "https://snapfinance.com",
  // Health / dental
  "quest diagnostics": "https://www.questdiagnostics.com",
  "national diaper bank network": "https://nationaldiaperbanknetwork.org",
  "dental lifeline network": "https://dentallifeline.org",
  "dentaquest community response fund": "https://www.dentaquest.com",
  "americas tooth fairy": "https://www.americastoothfairy.org",
  "smiles for everyone": "https://smilesforeveryone.org",
  // Jobs / re-entry / housing / community
  "keller williams realestate": "https://www.kw.com",
  "goodwill of dallas": "https://goodwilldallas.org",
  "prison entrepreneurship program": "https://www.pep.org",
  "cornbread hustle": "https://cornbreadhustle.com",
  "family promise": "https://familypromise.org",
  "road scholar": "https://www.roadscholar.org",
};

const data = JSON.parse(readFileSync(FILE, "utf8"));
const before = data.length;
let derived = 0;
let enriched = 0;

for (const r of data) {
  if (has(r.website)) continue;
  const known = KNOWN[norm(r.name)];
  if (known) {
    r.website = known;
    enriched++;
    continue;
  }
  const m = (r.name || "").match(domainRe);
  if (m) {
    r.website = `https://${m[1].toLowerCase()}`;
    derived++;
  }
}

const reachable = (r) => has(r.phone) || has(r.email) || has(r.website) || has(r.address);
const removed = data.filter((r) => !reachable(r));
const kept = data.filter(reachable);

writeFileSync(FILE, `${JSON.stringify(kept, null, 2)}\n`, "utf8");

console.log(`Before:   ${before}`);
console.log(`Websites derived from name: ${derived}`);
console.log(`Websites enriched (known):  ${enriched}`);
console.log(`Removed (unreachable):      ${removed.length}`);
console.log(`After:    ${kept.length}`);
console.log(`\nRemoved:\n${removed.map((r) => " - " + r.name).join("\n")}`);
