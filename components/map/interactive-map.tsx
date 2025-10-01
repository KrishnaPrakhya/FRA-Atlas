"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Marker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { FeatureCollection } from "geojson";

// Leaflet doesn't have its icons available in React out of the box.
// This is a common workaround.
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// ############################################################################
// TYPES
// ############################################################################

type Layers = {
  villages: boolean;
  baseLayer: "street" | "satellite";
};

interface InteractiveMapProps {
  layers: Layers;
  geoData: FeatureCollection;
  onFeatureSelect: (id: string | null) => void;
  selectedFeatureId: string | null;
}

// ############################################################################
// MAP UTILITY COMPONENTS
// ############################################################################

// Component to dynamically change map view
function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [bounds, map]);
  return null;
}

// Component to add a legend to the map
function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.style.backgroundColor = "white";
      div.style.padding = "10px";
      div.style.borderRadius = "5px";
      div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";

      const grades = [
        { status: "High-Priority", color: "#ef4444" },
        { status: "Medium-Priority", color: "#f59e0b" },
        { status: "Low-Priority", color: "#22c55e" },
      ];

      let innerHTML = "<h4>Status</h4>";
      for (let i = 0; i < grades.length; i++) {
        innerHTML +=
          `<i style="background:${grades[i].color}; width: 18px; height: 18px; float: left; margin-right: 8px; border-radius: 50%;"></i>` +
          grades[i].status +
          "<br>";
      }
      div.innerHTML = innerHTML;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}

// ############################################################################
// MAIN MAP COMPONENT
// ############################################################################

export default function InteractiveMap({
  layers,
  geoData,
  onFeatureSelect,
  selectedFeatureId,
}: InteractiveMapProps) {
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  const getMarkerStyle = (status: string, isSelected: boolean) => {
    const color =
      status === "High-Priority"
        ? "#ef4444"
        : status === "Medium-Priority"
        ? "#f59e0b"
        : "#22c55e";

    return {
      fillColor: color,
      color: isSelected ? "#000000" : "#ffffff",
      weight: isSelected ? 3 : 1.5,
      radius: isSelected ? 10 : 7,
      fillOpacity: 0.9,
    };
  };

  const bounds = useMemo(() => {
    if (geoData && geoData.features.length > 0) {
      // Create a temporary GeoJSON layer to calculate bounds
      const layer = L.geoJSON(geoData as GeoJSON.GeoJsonObject);
      return layer.getBounds();
    }
    // Default view over central India if no data
    return L.latLngBounds(L.latLng(17, 78), L.latLng(23, 82));
  }, [geoData]);

  return (
    <MapContainer
      center={[22, 82]} // Center of India
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", background: "#e5e7eb" }}
    >
      <ChangeView bounds={bounds} />
      <Legend />

      {/* BASE MAP TILE LAYERS */}
      {layers.baseLayer === "street" ? (
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      ) : (
        <TileLayer
          attribution='© <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        />
      )}

      {/* VILLAGES GEOJSON LAYER */}
      {geoData && layers.villages && (
        <GeoJSON
          key={JSON.stringify(geoData) + selectedFeatureId} // Re-render when data or selection changes
          ref={geoJsonLayerRef}
          data={geoData as GeoJSON.GeoJsonObject}
          pointToLayer={(feature, latlng) => {
            const isSelected = feature.properties.id === selectedFeatureId;
            return L.circleMarker(
              latlng,
              getMarkerStyle(feature.properties.status, isSelected)
            );
          }}
          onEachFeature={(feature, layer) => {
            layer.on({
              click: () => {
                onFeatureSelect(feature.properties.id);
                // Fly to the feature on click
                const map = (layer as any)._map;
                if (map) {
                  map.flyTo((layer as L.CircleMarker).getLatLng(), 12);
                }
              },
            });
            layer.bindTooltip(feature.properties.villageName, {
              permanent: false,
              direction: "top",
              offset: [0, -10],
            });
          }}
        />
      )}
    </MapContainer>
  );
}
