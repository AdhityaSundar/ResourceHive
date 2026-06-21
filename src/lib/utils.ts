import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Resource } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const missingValues = new Set(["", "n/a", "na", "none", "null", "undefined", "nan", "-"]);

export function cleanText(value: unknown) {
  if (value == null) {
    return "";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value).trim() : "";
  }

  const normalized = String(value).replace(/\s+/g, " ").trim();
  return missingValues.has(normalized.toLowerCase()) ? "" : normalized;
}

export function normalizeState(value: unknown) {
  const normalized = cleanText(value);
  if (!normalized) {
    return "";
  }

  const compact = normalized.toLowerCase().replace(/[^a-z]/g, "");
  if (compact === "texas" || compact === "tx") {
    return "TX";
  }

  if (compact === "us" || compact === "usa" || compact === "unitedstates") {
    return "US";
  }

  return normalizeLocationText(normalized.length <= 3 ? normalized.toUpperCase() : normalized);
}

export function isLocationLike(value: unknown) {
  const text = cleanText(value);
  if (!text) {
    return false;
  }

  return /\b(tx|texas|us|u\.s\.|usa|united states)\b/i.test(text) || /\b\d{5}(?:-\d{4})?\b/.test(text);
}

function normalizeLocationText(value: string) {
  return value
    .replace(/\btexas\b/gi, "TX")
    .replace(/\btx\b/gi, "TX")
    .replace(/\bu\.s\./gi, "US")
    .replace(/\bus\b/gi, "US");
}

export function isPhoneLike(value: unknown) {
  const text = cleanText(value);
  if (!text || /@|https?:\/\//i.test(text)) {
    return false;
  }

  const digits = text.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function isEmailLike(value: unknown) {
  const text = cleanText(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

export function formatPhone(phone: string) {
  const text = cleanText(phone);
  if (!isPhoneLike(text)) {
    return "";
  }

  const digits = text.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return text;
}

export function isLikelyContactName(value: unknown) {
  const text = cleanText(value);
  if (!text || isPhoneLike(text) || isEmailLike(text) || /https?:\/\/|www\./i.test(text)) {
    return false;
  }

  const words = text.split(/\s+/);
  return text.length <= 64 && words.length <= 6 && !/[.!?]/.test(text);
}

export function normalizeContactFields(input: {
  phone?: unknown;
  email?: unknown;
  contactName?: unknown;
}) {
  const rawPhone = cleanText(input.phone);
  const rawEmail = cleanText(input.email);
  const phone = isPhoneLike(rawPhone) ? rawPhone : isPhoneLike(rawEmail) ? rawEmail : "";
  const email = isEmailLike(rawEmail) ? rawEmail : isEmailLike(rawPhone) ? rawPhone : "";

  return {
    phone,
    email,
    contactName: isLikelyContactName(input.contactName) ? cleanText(input.contactName) : "",
  };
}

export function formatLocation(resource: Pick<Resource, "address" | "city" | "state" | "zip"> & { stateLocation?: string }) {
  const street = normalizeLocationText(cleanText(resource.address));
  const city = normalizeLocationText(cleanText(resource.city));
  const state = normalizeState(resource.state);
  const zip = cleanText(resource.zip);
  const fallbackLocation = isLocationLike(resource.stateLocation)
    ? normalizeLocationText(cleanText(resource.stateLocation))
    : "";
  const cityState = [city, [state, zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  if (street && cityState) {
    return `${street}, ${cityState}`;
  }

  if (street) {
    return street;
  }

  if (cityState) {
    return cityState;
  }

  return fallbackLocation;
}

export function formatAddress(address: string, city: string, state: string, zip: string) {
  return formatLocation({ address, city, state, zip });
}

const cityFallbacks: Record<string, { lat: number; lng: number }> = {
  dallas: { lat: 32.7767, lng: -96.797 },
  irving: { lat: 32.814, lng: -96.9489 },
  "grand prairie": { lat: 32.7459, lng: -96.9978 },
  mesquite: { lat: 32.7668, lng: -96.5992 },
  "fort worth": { lat: 32.7555, lng: -97.3308 },
  corsicana: { lat: 32.0954, lng: -96.4689 },
  weatherford: { lat: 32.7593, lng: -97.7972 },
};

export function getResourceCoordinates(resource: Resource) {
  if (Number.isFinite(resource.lat) && Number.isFinite(resource.lng)) {
    return { lat: resource.lat as number, lng: resource.lng as number };
  }

  if (Number.isFinite(resource.latitude) && Number.isFinite(resource.longitude)) {
    return { lat: resource.latitude, lng: resource.longitude };
  }

  return cityFallbacks[cleanText(resource.city).toLowerCase()] ?? cityFallbacks.dallas;
}

export function getDirectionsUrl(resource: Resource) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    formatAddress(resource.address, resource.city, resource.state, resource.zip),
  )}`;
}

// A clickable href for a resource website (handles bare domains like
// "fullcart.com" by prefixing https://).
export function websiteUrl(website?: string) {
  const text = cleanText(website);
  if (!text) return "";
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
}

// A clean display label for a website (drops the protocol and trailing slash).
export function websiteLabel(website?: string) {
  return cleanText(website)
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");
}
