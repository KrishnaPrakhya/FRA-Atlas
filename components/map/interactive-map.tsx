"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polygon, LayersControl, FeatureGroup } from "react-leaflet"
import { Icon, type LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import type { ForestRightsClaim, SpatialBoundary } from "@/lib/types"

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface MapData {
  claims: (ForestRightsClaim & { lat?: number; lng?: number })[]
  boundaries: SpatialBoundary[]
}

export default function InteractiveMap() {
  const [mapData, setMapData] = useState<MapData>({ claims: [], boundaries: [] })
  const [loading, setLoading] = useState(true)
  const [selectedLayers, setSelectedLayers] = useState({
    claims: true,
    forestBoundaries: true,
    claimAreas: true,
  })

  // Default center (Dehradun, Uttarakhand)
  const defaultCenter: LatLngExpression = [30.3165, 78.0322]
  const defaultZoom = 10

  useEffect(() => {
    fetchMapData()
  }, [])

  const fetchMapData = async () => {
    try {
      const response = await fetch("/api/map/data")
      const result = await response.json()

      if (result.success) {
        setMapData(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch map data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getClaimMarkerColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "#22c55e" // green
      case "Rejected":
        return "#ef4444" // red
      case "Under Review":
        return "#eab308" // yellow
      default:
        return "#6b7280" // gray
    }
  }

  const createCustomIcon = (color: string) => {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path fill="${color}" stroke="#fff" strokeWidth="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
          <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    })
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer center={defaultCenter} zoom={defaultZoom} className="h-full w-full" zoomControl={true}>
        <LayersControl position="topright">
          {/* Base Layers */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          {/* Overlay Layers */}
          <LayersControl.Overlay checked name="Forest Rights Claims">
            <FeatureGroup>
              {mapData.claims.map((claim) => {
                if (!claim.lat || !claim.lng) return null

                return (
                  <Marker
                    key={claim.id}
                    position={[claim.lat, claim.lng]}
                    icon={createCustomIcon(getClaimMarkerColor(claim.status))}
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[200px]">
                        <h3 className="font-semibold">{claim.claim_number}</h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Claimant:</strong> {claim.claimant_name}
                          </p>
                          <p>
                            <strong>Village:</strong> {claim.village_name}
                          </p>
                          <p>
                            <strong>District:</strong> {claim.district}
                          </p>
                          <p>
                            <strong>Area:</strong> {claim.forest_area_hectares} hectares
                          </p>
                          <p>
                            <strong>Type:</strong> {claim.claim_type}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            <span
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: getClaimMarkerColor(claim.status) + "20",
                                color: getClaimMarkerColor(claim.status),
                              }}
                            >
                              {claim.status}
                            </span>
                          </p>
                        </div>
                        <div className="pt-2 border-t">
                          <button
                            className="text-primary hover:underline text-sm"
                            onClick={() => window.open(`/claims/${claim.id}`, "_blank")}
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </FeatureGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Claim Boundaries">
            <FeatureGroup>
              {mapData.boundaries.map((boundary) => {
                if (!boundary.geometry_data || !boundary.geometry_data.coordinates) return null

                // Convert GeoJSON coordinates to Leaflet format
                const coordinates = boundary.geometry_data.coordinates[0].map(
                  (coord: number[]) => [coord[1], coord[0]] as LatLngExpression,
                )

                return (
                  <Polygon
                    key={boundary.id}
                    positions={coordinates}
                    pathOptions={{
                      color: boundary.boundary_type === "Claim Area" ? "#3b82f6" : "#10b981",
                      fillColor: boundary.boundary_type === "Claim Area" ? "#3b82f6" : "#10b981",
                      fillOpacity: 0.2,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="space-y-2">
                        <h3 className="font-semibold">{boundary.boundary_type}</h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Area:</strong> {boundary.area_hectares} hectares
                          </p>
                          <p>
                            <strong>Perimeter:</strong> {boundary.perimeter_meters} meters
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </Polygon>
                )
              })}
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {/* Legend */}
        <div className="leaflet-bottom leaflet-left">
          <div className="leaflet-control leaflet-bar bg-white p-3 shadow-lg">
            <h4 className="font-semibold text-sm mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Approved Claims</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Under Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Rejected Claims</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span>Pending Claims</span>
              </div>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  )
}
