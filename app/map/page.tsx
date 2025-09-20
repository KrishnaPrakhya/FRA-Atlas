"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Map,
  Sparkles,
  Search,
  Filter,
  Layers,
  MapPin,
  TreePine,
  Leaf,
  Mountain,
  Globe,
  Satellite,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  Activity,
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Target,
  Compass,
  Home,
  Maximize,
  Download,
  Share,
  TrendingUp,
} from "lucide-react";

// Mock data for map markers
const mockMapData = [
  {
    id: "claim-001",
    claimId: "FRA-2024-001",
    claimantName: "राम कुमार शर्मा",
    latitude: 23.3441,
    longitude: 85.3096,
    villageName: "Ramgarh",
    district: "Ranchi",
    state: "Jharkhand",
    areaRequested: 2.5,
    landType: "Agricultural",
    status: "approved",
    riskLevel: "low",
    confidence: 0.94,
    submissionDate: "2024-01-15",
    forestCover: 0.78,
    biodiversityIndex: 0.65,
    waterBodies: 2,
    elevation: 650,
  },
  {
    id: "claim-002",
    claimId: "FRA-2024-002",
    claimantName: "सुनीता देवी",
    latitude: 23.0473,
    longitude: 84.8473,
    villageName: "Birsa Nagar",
    district: "Gumla",
    state: "Jharkhand",
    areaRequested: 1.8,
    landType: "Habitation",
    status: "under_review",
    riskLevel: "medium",
    confidence: 0.87,
    submissionDate: "2024-02-10",
    forestCover: 0.82,
    biodiversityIndex: 0.71,
    waterBodies: 1,
    elevation: 720,
  },
  {
    id: "claim-003",
    claimId: "FRA-2024-003",
    claimantName: "अजय सिंह",
    latitude: 23.0315,
    longitude: 85.2784,
    villageName: "Khunti",
    district: "Khunti",
    state: "Jharkhand",
    areaRequested: 3.2,
    landType: "Grazing",
    status: "pending",
    riskLevel: "low",
    confidence: 0.91,
    submissionDate: "2024-03-01",
    forestCover: 0.85,
    biodiversityIndex: 0.68,
    waterBodies: 3,
    elevation: 580,
  },
  {
    id: "claim-004",
    claimId: "FRA-2024-004",
    claimantName: "मीरा बाई",
    latitude: 22.6173,
    longitude: 84.5984,
    villageName: "Simdega",
    district: "Simdega",
    state: "Jharkhand",
    areaRequested: 2.1,
    landType: "Agricultural",
    status: "rejected",
    riskLevel: "high",
    confidence: 0.76,
    submissionDate: "2024-01-20",
    forestCover: 0.45,
    biodiversityIndex: 0.42,
    waterBodies: 0,
    elevation: 890,
  },
  {
    id: "claim-005",
    claimId: "FRA-2024-005",
    claimantName: "रवि प्रसाद",
    latitude: 23.4315,
    longitude: 84.6784,
    villageName: "Lohardaga",
    district: "Lohardaga",
    state: "Jharkhand",
    areaRequested: 4.5,
    landType: "Community Resource",
    status: "requires_info",
    riskLevel: "medium",
    confidence: 0.82,
    submissionDate: "2024-02-25",
    forestCover: 0.73,
    biodiversityIndex: 0.59,
    waterBodies: 2,
    elevation: 710,
  },
];

const statusConfig = {
  approved: {
    color: "#10b981",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    textColor: "text-green-800 dark:text-green-300",
  },
  under_review: {
    color: "#3b82f6",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    textColor: "text-blue-800 dark:text-blue-300",
  },
  pending: {
    color: "#f59e0b",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    textColor: "text-yellow-800 dark:text-yellow-300",
  },
  rejected: {
    color: "#ef4444",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    textColor: "text-red-800 dark:text-red-300",
  },
  requires_info: {
    color: "#f97316",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    textColor: "text-orange-800 dark:text-orange-300",
  },
};

const riskConfig = {
  low: { color: "#10b981", intensity: 0.3 },
  medium: { color: "#f59e0b", intensity: 0.6 },
  high: { color: "#ef4444", intensity: 0.9 },
};

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [mapView, setMapView] = useState<"satellite" | "terrain" | "forest">(
    "forest"
  );
  const [showClusters, setShowClusters] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showForestCover, setShowForestCover] = useState(true);
  const [showWaterBodies, setShowWaterBodies] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.2156, lng: 85.2784 });
  const [zoomLevel, setZoomLevel] = useState(8);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter claims based on current filters
  const filteredClaims = useMemo(() => {
    return mockMapData.filter((claim) => {
      const matchesSearch =
        claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.villageName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || claim.status === statusFilter;
      const matchesDistrict =
        districtFilter === "all" || claim.district === districtFilter;
      const matchesRisk =
        riskFilter === "all" || claim.riskLevel === riskFilter;

      return matchesSearch && matchesStatus && matchesDistrict && matchesRisk;
    });
  }, [searchTerm, statusFilter, districtFilter, riskFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = mockMapData.length;
    const approved = mockMapData.filter((c) => c.status === "approved").length;
    const pending = mockMapData.filter(
      (c) => c.status === "pending" || c.status === "under_review"
    ).length;
    const avgForestCover =
      mockMapData.reduce((sum, c) => sum + c.forestCover, 0) / total;
    const avgBiodiversity =
      mockMapData.reduce((sum, c) => sum + c.biodiversityIndex, 0) / total;

    return { total, approved, pending, avgForestCover, avgBiodiversity };
  }, []);

  // Simulated map component (in real implementation, you'd use Leaflet, Mapbox, or Google Maps)
  const MapComponent = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl overflow-hidden">
      {/* Animated Forest Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Trees */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <TreePine
                className="h-4 w-4 text-green-600/30 dark:text-green-400/20"
                style={{ transform: `rotate(${Math.random() * 360}deg)` }}
              />
            </div>
          ))}
        </div>

        {/* Animated Water Bodies */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            >
              <div className="w-8 h-4 bg-blue-400/20 dark:bg-blue-300/10 rounded-full blur-sm" />
            </div>
          ))}
        </div>

        {/* Mountain Ranges */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-200/50 to-transparent dark:from-green-800/20">
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center space-x-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Mountain
                key={i}
                className="h-8 w-8 text-green-600/40 dark:text-green-400/20"
                style={{
                  height: `${20 + Math.random() * 20}px`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Map Markers */}
      <div className="absolute inset-0">
        {filteredClaims.map((claim) => {
          const x = ((claim.longitude - 84.0) / 2.0) * 100; // Normalize longitude to percentage
          const y = ((24.0 - claim.latitude) / 2.0) * 100; // Normalize latitude to percentage (inverted)

          return (
            <div
              key={claim.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedClaim(claim)}
            >
              {/* Pulsing Ring */}
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{
                  backgroundColor:
                    statusConfig[claim.status as keyof typeof statusConfig]
                      ?.color,
                  width: "24px",
                  height: "24px",
                  margin: "-12px",
                }}
              />

              {/* Main Marker */}
              <div
                className="relative w-6 h-6 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-all duration-300 flex items-center justify-center"
                style={{
                  backgroundColor:
                    statusConfig[claim.status as keyof typeof statusConfig]
                      ?.color,
                }}
              >
                <MapPin className="h-3 w-3 text-white" />
              </div>

              {/* Hover Tooltip */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 min-w-48 border border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {claim.claimantName}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {claim.villageName}, {claim.district}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {claim.areaRequested} hectares
                  </div>
                  <Badge
                    className={`${
                      statusConfig[claim.status as keyof typeof statusConfig]
                        ?.bgColor
                    } ${
                      statusConfig[claim.status as keyof typeof statusConfig]
                        ?.textColor
                    } text-xs mt-1`}
                  >
                    {claim.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Forest Cover Overlay */}
      {showForestCover && (
        <div className="absolute inset-0 pointer-events-none">
          {filteredClaims.map((claim) => {
            const x = ((claim.longitude - 84.0) / 2.0) * 100;
            const y = ((24.0 - claim.latitude) / 2.0) * 100;
            const size = claim.forestCover * 60; // Scale forest cover to circle size

            return (
              <div
                key={`forest-${claim.id}`}
                className="absolute rounded-full bg-green-500/20 dark:bg-green-400/10 animate-pulse"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: "translate(-50%, -50%)",
                  animationDuration: "3s",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Water Bodies Overlay */}
      {showWaterBodies && (
        <div className="absolute inset-0 pointer-events-none">
          {filteredClaims.map((claim) => {
            if (claim.waterBodies === 0) return null;

            const x = ((claim.longitude - 84.0) / 2.0) * 100;
            const y = ((24.0 - claim.latitude) / 2.0) * 100;

            return (
              <div
                key={`water-${claim.id}`}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {Array.from({ length: claim.waterBodies }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-2 bg-blue-400/40 dark:bg-blue-300/20 rounded-full animate-pulse"
                    style={{
                      left: `${(i - claim.waterBodies / 2) * 8}px`,
                      top: `${Math.sin(i) * 4}px`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-2 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 15))}
            className="w-full justify-start"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 5))}
            className="w-full justify-start"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMapCenter({ lat: 23.2156, lng: 85.2784 });
              setZoomLevel(8);
            }}
            className="w-full justify-start"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-full justify-start"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Legend
          </div>
          <div className="space-y-2">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                  {status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
          {showForestCover && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500/30" />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  Forest Cover
                </span>
              </div>
            </div>
          )}
          {showWaterBodies && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-2 rounded-full bg-blue-400/40" />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Water Bodies
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 left-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2">
          <div className="text-xs text-gray-600 dark:text-gray-300">
            Zoom: {zoomLevel}x
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-teal-400/15 to-cyan-400/15 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Enhanced Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-emerald-200/50 dark:border-emerald-700/50">
              <Map className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Interactive Spatial Analysis
              </span>
              <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Forest Rights Map
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore forest rights claims with
              <span className="text-emerald-600 font-semibold">
                {" "}
                interactive mapping
              </span>{" "}
              and
              <span className="text-teal-600 font-semibold">
                {" "}
                spatial analytics
              </span>
            </p>

            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Globe className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Layers className="h-5 w-5 text-teal-500" />
                <span className="text-sm">Multi-layer Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Target className="h-5 w-5 text-cyan-500" />
                <span className="text-sm">Precise Locations</span>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl blur-xl"></div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Locations */}
              <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <Globe className="h-5 w-5 text-emerald-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.total}</div>
                  <div className="text-emerald-100 text-sm">
                    Total Locations
                  </div>
                </CardContent>
              </Card>

              {/* Approved Claims */}
              <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <Activity className="h-5 w-5 text-teal-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {stats.approved}
                  </div>
                  <div className="text-teal-100 text-sm">Approved Claims</div>
                </CardContent>
              </Card>

              {/* Pending Review */}
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <Clock className="h-5 w-5 text-blue-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.pending}</div>
                  <div className="text-blue-100 text-sm">Pending Review</div>
                </CardContent>
              </Card>

              {/* Forest Coverage */}
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TreePine className="h-8 w-8 text-white" />
                    </div>
                    <Leaf className="h-5 w-5 text-purple-200 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {(stats.avgForestCover * 100).toFixed(1)}%
                  </div>
                  <div className="text-purple-100 text-sm">
                    Avg Forest Cover
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Filters and Search */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl"></div>
            <Card className="relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5"></div>

              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                      <Filter className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                        Map Filters & Controls
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                        Filter claims and customize map display
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-2 text-emerald-600" />
                      <span className="text-emerald-700">Export</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/80 backdrop-blur-sm border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300"
                    >
                      <Share className="h-4 w-4 mr-2 text-teal-600" />
                      <span className="text-teal-700">Share</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search claims..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/80 backdrop-blur-sm border-emerald-200/50 focus:border-emerald-400 transition-all duration-300"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border-emerald-200/50 focus:border-emerald-400 transition-all duration-300">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="requires_info">
                        Requires Info
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* District Filter */}
                  <Select
                    value={districtFilter}
                    onValueChange={setDistrictFilter}
                  >
                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border-emerald-200/50 focus:border-emerald-400 transition-all duration-300">
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      <SelectItem value="Ranchi">Ranchi</SelectItem>
                      <SelectItem value="Gumla">Gumla</SelectItem>
                      <SelectItem value="Khunti">Khunti</SelectItem>
                      <SelectItem value="Simdega">Simdega</SelectItem>
                      <SelectItem value="Lohardaga">Lohardaga</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Risk Filter */}
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border-emerald-200/50 focus:border-emerald-400 transition-all duration-300">
                      <SelectValue placeholder="All Risk Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Map View Controls */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={showForestCover}
                        onCheckedChange={setShowForestCover}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Forest Cover
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={showWaterBodies}
                        onCheckedChange={setShowWaterBodies}
                        className="data-[state=checked]:bg-teal-500"
                      />
                      <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                        Water Bodies
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={showClusters}
                        onCheckedChange={setShowClusters}
                        className="data-[state=checked]:bg-cyan-500"
                      />
                      <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                        Clusters
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {filteredClaims.length} of {mockMapData.length}{" "}
                    claims
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Interactive Map */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl"></div>
            <Card className="relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5"></div>

              <CardHeader className="relative z-10 pb-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Map className="h-4 w-4" />
                    <span>Interactive Map</span>
                  </div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                    Spatial Analysis Dashboard
                  </CardTitle>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    Explore forest rights claims with interactive mapping and
                    real-time data
                  </p>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 p-8">
                <div className="h-96 lg:h-[600px]">
                  <MapComponent />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Claim Details */}
          {selectedClaim && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-3xl blur-2xl"></div>
              <Card className="relative bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-800/90 dark:to-purple-900/20 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5"></div>

                <CardHeader className="relative z-10 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                          Claim Details
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {selectedClaim.claimId} - {selectedClaim.claimantName}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedClaim(null)}
                      className="bg-white/80 backdrop-blur-sm"
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Location
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedClaim.villageName}, {selectedClaim.district},{" "}
                          {selectedClaim.state}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Area Requested
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedClaim.areaRequested} hectares
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Land Type
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedClaim.landType}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Status
                        </h4>
                        <Badge
                          className={`${
                            statusConfig[
                              selectedClaim.status as keyof typeof statusConfig
                            ]?.bgColor
                          } ${
                            statusConfig[
                              selectedClaim.status as keyof typeof statusConfig
                            ]?.textColor
                          }`}
                        >
                          {selectedClaim.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Risk Level
                        </h4>
                        <Badge
                          variant="outline"
                          className={
                            selectedClaim.riskLevel === "low"
                              ? "border-green-300 text-green-700"
                              : selectedClaim.riskLevel === "medium"
                              ? "border-yellow-300 text-yellow-700"
                              : "border-red-300 text-red-700"
                          }
                        >
                          {selectedClaim.riskLevel}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Confidence
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {(selectedClaim.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Forest Cover
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${selectedClaim.forestCover * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {(selectedClaim.forestCover * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Water Bodies
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedClaim.waterBodies} nearby
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Elevation
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedClaim.elevation}m above sea level
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Footer Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Map className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">
                Interactive mapping for sustainable forest management
              </span>
              <TreePine className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
