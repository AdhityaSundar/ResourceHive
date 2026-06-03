import type { Resource } from "@/lib/types";

// Static coordinate lookup for the Texas cities present in the resource data.
// Kept local (no runtime geocoding API) for speed and privacy.
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  houston: { lat: 29.7604, lng: -95.3698 },
  dallas: { lat: 32.7767, lng: -96.797 },
  "fort worth": { lat: 32.7555, lng: -97.3308 },
  waxahachie: { lat: 32.3865, lng: -96.8484 },
  midlothian: { lat: 32.4824, lng: -96.9944 },
  corsicana: { lat: 32.0954, lng: -96.4688 },
  "grand prairie": { lat: 32.7459, lng: -96.9978 },
  irving: { lat: 32.814, lng: -96.9489 },
  mesquite: { lat: 32.7668, lng: -96.5992 },
  weatherford: { lat: 32.7593, lng: -97.7972 },
  austin: { lat: 30.2672, lng: -97.7431 },
};

export type GlobeMarker = {
  city: string;
  label: string;
  lat: number;
  lng: number;
  count: number;
  href: string;
};

/**
 * Aggregate resources into one marker per known city (de-duped), so the globe
 * shows a clean set of glowing pins that link to the directory filtered by city.
 */
export function buildMarkersFromResources(resources: Resource[]): GlobeMarker[] {
  const byCity = new Map<string, GlobeMarker>();

  for (const resource of resources) {
    const key = resource.city.trim().toLowerCase();
    const coords = CITY_COORDS[key];
    if (!coords) continue;

    const existing = byCity.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      byCity.set(key, {
        city: key,
        label: resource.city.trim(),
        lat: coords.lat,
        lng: coords.lng,
        count: 1,
        href: `/resources?city=${encodeURIComponent(resource.city.trim())}`,
      });
    }
  }

  return Array.from(byCity.values()).sort((a, b) => b.count - a.count);
}

/**
 * Equirectangular lat/lng -> unit vector on a sphere, matching three.js
 * SphereGeometry default UVs (so markers land on the right country).
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius = 1,
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

/** Great-circle-ish distance in km (haversine) for emphasizing nearby pins. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}
