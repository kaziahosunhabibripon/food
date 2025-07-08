/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

// 👇 Fix for missing marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina.src || iconRetina,
  iconUrl: icon.src || icon,
  shadowUrl: shadow.src || shadow,
});

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  MapId: string;
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  onMapReady?: (map: L.Map) => void;
  onMapClick?: (e: L.LeafletMouseEvent) => void;
  onMarkerClick?: (e: L.LeafletMouseEvent) => void;
}

export default function LocationMap({
  latitude,
  longitude,
  MapId,
  zoom = 13,
  className,
  style,
  onMapReady,
  onMapClick,
  onMarkerClick,
}: LeafletMapProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && latitude && longitude) {
      const map = L.map(MapId).setView([latitude, longitude], zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`Lat: ${latitude} Lng: ${longitude}`).openPopup();

      if (onMarkerClick) marker.on("click", onMarkerClick);
      if (onMapClick) map.on("click", onMapClick);
      if (onMapReady) onMapReady(map);

      return () => {
        map.remove();
      };
    }
  }, [latitude, longitude, MapId, zoom, onMapReady, onMapClick, onMarkerClick]);

  return (
    <div
      id={MapId}
      className={className}
      style={{
        height: "200px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        ...(style || {}),
      }}
    />
  );
}
