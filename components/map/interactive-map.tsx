"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { GeoJsonObject, FeatureCollection } from "geojson";

// Note: Leaflet marker icons will use default styling

type Filters = {
  query: string;
  district: string;
  status: string;
  claimType: string;
};

type Layers = {
  claims: boolean;
  boundaries: boolean;
  assets: boolean;
  baseLayer: "street" | "satellite";
};

interface InteractiveMapProps {
  filters: Filters;
  layers: Layers;
  geoData: FeatureCollection;
}

// Helper component to change map view
function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function InteractiveMap({
  filters,
  layers,
  geoData,
}: InteractiveMapProps) {
  const filteredData = useMemo(() => {
    if (!geoData || !("features" in geoData)) return null;

    const filteredFeatures = geoData.features.filter((feature) => {
      const p = feature.properties;
      if (filters.district !== "all" && p?.district !== filters.district)
        return false;
      if (filters.status !== "all" && p?.status !== filters.status)
        return false;
      if (filters.claimType !== "all" && p?.type !== filters.claimType)
        return false;
      if (
        filters.query &&
        !p?.name.toLowerCase().includes(filters.query.toLowerCase()) &&
        !p?.id.toLowerCase().includes(filters.query.toLowerCase())
      )
        return false;
      return true;
    });

    return { ...geoData, features: filteredFeatures };
  }, [filters, geoData]);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const p = feature.properties;
    const popupContent = `
      <div style="font-family: sans-serif;">
        <h3 style="margin: 0 0 5px 0; font-size: 1.1em;"><strong>${
          p.name
        }</strong></h3>
        <p style="margin: 0;"><strong>ID:</strong> ${p.id}</p>
        <p style="margin: 0;"><strong>Type:</strong> ${p.type}</p>
        <p style="margin: 0;"><strong>Status:</strong> <span style="font-weight: bold; color: ${
          p.status === "Approved"
            ? "#22c55e"
            : p.status === "Pending"
            ? "#f59e0b"
            : "#ef4444"
        };">${p.status}</span></p>
        <p style="margin: 0;"><strong>Area:</strong> ${p.area}</p>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  const styleGeoJSON = (feature: any) => {
    switch (feature.properties.status) {
      case "Approved":
        return {
          color: "#22c55e",
          weight: 2,
          fillColor: "#22c55e",
          fillOpacity: 0.5,
        };
      case "Pending":
        return {
          color: "#f59e0b",
          weight: 2,
          fillColor: "#f59e0b",
          fillOpacity: 0.5,
        };
      case "Rejected":
        return {
          color: "#ef4444",
          weight: 2,
          fillColor: "#ef4444",
          fillOpacity: 0.5,
        };
      default:
        return {
          color: "#3b82f6",
          weight: 2,
          fillColor: "#3b82f6",
          fillOpacity: 0.5,
        };
    }
  };

  const bounds = useMemo(() => {
    if (filteredData && filteredData.features.length > 0) {
      return L.geoJSON(filteredData as GeoJsonObject).getBounds();
    }
    // Default view over Uttarakhand, India if no data
    return L.latLngBounds(L.latLng(29.0, 78.0), L.latLng(31.5, 80.0));
  }, [filteredData]);

  return (
    <MapContainer
      center={[30.3165, 78.0322]}
      zoom={9}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", background: "#e5e7eb" }}
    >
      <ChangeView bounds={bounds} />
      {layers.baseLayer === "street" ? (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
        />
      )}

      {filteredData && layers.claims && (
        <GeoJSON
          key={JSON.stringify(filters)} // Force re-render on filter change
          data={filteredData as GeoJsonObject}
          onEachFeature={onEachFeature}
          style={styleGeoJSON}
        />
      )}
    </MapContainer>
  );
}
