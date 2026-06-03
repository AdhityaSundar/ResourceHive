"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, InfoWindow, MarkerF, useJsApiLoader } from "@react-google-maps/api";

import { useLocale } from "@/components/providers/locale-provider";
import { useMounted } from "@/hooks/use-mounted";
import { localizeCategory } from "@/lib/i18n";
import type { Resource } from "@/lib/types";
import { formatLocation, getResourceCoordinates } from "@/lib/utils";

const defaultCenter = { lat: 32.7767, lng: -96.797 };
const mapContainerStyle = { width: "100%", height: "100%" };
const libraries: ["places"] = ["places"];

const categoryColors: Record<string, string> = {
  Food: "#facc15",
  Shelter: "#f7bf20",
  Jobs: "#f5b21f",
  Healthcare: "#f59e0b",
  Education: "#f3a31b",
  Legal: "#f5aa1d",
  Youth: "#f6b61f",
  Community: "#f4a61c",
};

function createMarkerIcon(color: string) {
  if (typeof window === "undefined" || !window.google) {
    return undefined;
  }

  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: 9,
  };
}

export function GoogleResourceMap({
  resources,
  activeId,
  onActiveChange,
  className = "h-[500px]",
}: {
  resources: Resource[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
}) {
  const { locale, messages } = useLocale();
  const mounted = useMounted();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedId, setSelectedId] = useState(resources[0]?.id ?? "");
  const [userCenter, setUserCenter] = useState(defaultCenter);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const hasUsableApiKey = apiKey.trim().length > 0 && apiKey !== "YOUR_API_KEY";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "resourcehive-google-map",
    googleMapsApiKey: hasUsableApiKey ? apiKey : "",
    libraries,
  });

  const mappedResources = useMemo(
    () =>
      resources.map((resource) => ({
        resource,
        coords: getResourceCoordinates(resource),
      })),
    [resources],
  );

  useEffect(() => {
    if (!mounted || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setUserCenter(defaultCenter);
      },
      { enableHighAccuracy: true, timeout: 7000 },
    );
  }, [mounted]);

  const resolvedActiveId = useMemo(() => {
    if (activeId && resources.some((resource) => resource.id === activeId)) {
      return activeId;
    }

    if (selectedId && resources.some((resource) => resource.id === selectedId)) {
      return selectedId;
    }

    return resources[0]?.id ?? "";
  }, [activeId, resources, selectedId]);

  const selectedResource = useMemo(
    () => resources.find((resource) => resource.id === resolvedActiveId) ?? resources[0] ?? null,
    [resolvedActiveId, resources],
  );
  const selectedLocation = selectedResource ? formatLocation(selectedResource) : "";

  const center = selectedResource ? getResourceCoordinates(selectedResource) : userCenter;

  const fitMapToResources = useCallback(() => {
    if (!mapRef.current || !window.google || mappedResources.length === 0) {
      return;
    }

    if (selectedResource) {
      mapRef.current.panTo(getResourceCoordinates(selectedResource));
      mapRef.current.setZoom(12);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    mappedResources.forEach(({ coords }) => bounds.extend(coords));

    if (mappedResources.length === 1) {
      mapRef.current.panTo(mappedResources[0].coords);
      mapRef.current.setZoom(13);
      return;
    }

    mapRef.current.fitBounds(bounds, 72);
  }, [mappedResources, selectedResource]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    fitMapToResources();
  }, [fitMapToResources, isLoaded]);

  if (!mounted) {
    return <div className={`glass-panel ${className} rounded-[30px]`} />;
  }

  if (!hasUsableApiKey) {
    return (
      <div className={`glass-panel flex items-center justify-center rounded-[30px] p-6 text-center text-muted ${className}`}>
        {messages.common.mapApiKeyMessage}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`glass-panel flex items-center justify-center rounded-[30px] p-6 text-center text-muted ${className}`}>
        {messages.common.mapLoadError}
      </div>
    );
  }

  if (!isLoaded) {
    return <div className={`glass-panel animate-pulse rounded-[30px] ${className}`} />;
  }

  if (mappedResources.length === 0) {
    return (
      <div className={`glass-panel flex items-center justify-center rounded-[30px] p-6 text-center text-muted ${className}`}>
        {messages.common.noMapLocations}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-[30px] border border-white/40 bg-white/55 ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={11}
        onLoad={(map) => {
          mapRef.current = map;
          fitMapToResources();
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: [
            { elementType: "geometry", stylers: [{ color: "#081729" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#d9e3f0" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#081729" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#17304e" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#17304e" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f2740" }] },
            { featureType: "poi", stylers: [{ visibility: "off" }] },
          ],
        }}
      >
        {mappedResources.map(({ resource, coords }) => {
          return (
            <MarkerF
              key={resource.id}
              position={coords}
              onClick={() => {
                setSelectedId(resource.id);
                onActiveChange?.(resource.id);
              }}
              icon={createMarkerIcon(categoryColors[resource.category] ?? "#facc15")}
            />
          );
        })}

        {selectedResource ? (
          <InfoWindow
            position={getResourceCoordinates(selectedResource)}
            onCloseClick={() => setSelectedId("")}
          >
            <div className="max-w-64 space-y-3 p-1 text-slate-900">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                  {localizeCategory(selectedResource.category, locale)}
                </p>
                <h3 className="mt-2 text-base font-bold">{selectedResource.name}</h3>
                {selectedLocation ? <p className="mt-1 text-sm text-slate-600">{selectedLocation}</p> : null}
                {selectedResource.info && selectedResource.info !== selectedResource.description ? (
                  <p className="mt-2 text-sm text-slate-600">{selectedResource.info}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/resource/${selectedResource.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-teal-700 px-4 text-sm font-semibold text-white"
                >
                  {messages.common.viewDetails}
                </Link>
              </div>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

