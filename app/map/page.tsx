"use client";

import { Suspense, useState, useEffect, useMemo, FC } from "react";
import dynamic from "next/dynamic";
import type { FeatureCollection } from "geojson";

// ShadCN UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Lucide Icons
import {
  Search,
  Filter,
  Download,
  Layers3,
  List,
  X,
  Loader2,
  ChevronDown,
  MapPin,
  Users,
  AreaChart,
  Target,
  CheckCircle2,
  Info,
  Building2,
  TreePine,
  Droplets,
  Home,
} from "lucide-react";

// ############################################################################
// MOCK DATA (ENHANCED) - In a real app, this would come from an API
// ############################################################################

const MOCK_VILLAGE_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [81.8646, 23.013] },
      properties: {
        id: "MP_DINDORI_001",
        villageName: "Jhirkapur",
        state: "Madhya Pradesh",
        district: "Dindori",
        population: 1200,
        tribalPopulation: 950,
        ifrPattas: 45,
        cfrPattas: 2,
        totalAreaHa: 681.2,
        assets: {
          agriculturalLandHa: 234.5,
          forestCoverHa: 456.7,
          waterBodies: 4,
          homesteads: 89,
        },
        eligibleSchemes: ["PM-KISAN", "Jal Jeevan Mission"],
        priorityInterventions: [
          "Digital Connectivity",
          "Agricultural Extension",
        ],
        status: "High-Priority",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [78.476, 17.3616] },
      properties: {
        id: "TS_ADILABAD_002",
        villageName: "Kondapuram",
        state: "Telangana",
        district: "Adilabad",
        population: 1045,
        tribalPopulation: 789,
        ifrPattas: 56,
        cfrPattas: 2,
        totalAreaHa: 700.5,
        assets: {
          agriculturalLandHa: 310.2,
          forestCoverHa: 390.3,
          waterBodies: 3,
          homesteads: 112,
        },
        eligibleSchemes: ["MGNREGA", "Digital India"],
        priorityInterventions: ["Watershed Management"],
        status: "Medium-Priority",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [85.8245, 20.2961] },
      properties: {
        id: "OD_MAYURBHANJ_003",
        villageName: "Baripada",
        state: "Odisha",
        district: "Mayurbhanj",
        population: 2500,
        tribalPopulation: 1800,
        ifrPattas: 120,
        cfrPattas: 15,
        totalAreaHa: 1250.0,
        assets: {
          agriculturalLandHa: 500.0,
          forestCoverHa: 750.0,
          waterBodies: 8,
          homesteads: 350,
        },
        eligibleSchemes: ["PM-KISAN", "DAJGUA"],
        priorityInterventions: ["Minor Forest Produce Processing"],
        status: "Low-Priority",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [91.2778, 23.8315] },
      properties: {
        id: "TR_DHALAI_004",
        villageName: "Ambassa",
        state: "Tripura",
        district: "Dhalai",
        population: 850,
        tribalPopulation: 800,
        ifrPattas: 35,
        cfrPattas: 5,
        totalAreaHa: 450.0,
        assets: {
          agriculturalLandHa: 150.0,
          forestCoverHa: 300.0,
          waterBodies: 2,
          homesteads: 60,
        },
        eligibleSchemes: ["Jal Jeevan Mission"],
        priorityInterventions: ["Skill Development"],
        status: "High-Priority",
      },
    },
  ],
};

// ############################################################################
// TYPES
// ############################################################################
type Filters = {
  query: string;
  state: string;
  district: string;
};

type Layers = {
  villages: boolean;
  boundaries: boolean;
  assets: boolean;
  baseLayer: "street" | "satellite";
};

type VillageProperties = {
  id: string;
  villageName: string;
  state: string;
  district: string;
  population: number;
  tribalPopulation: number;
  ifrPattas: number;
  cfrPattas: number;
  totalAreaHa: number;
  assets: {
    agriculturalLandHa: number;
    forestCoverHa: number;
    waterBodies: number;
    homesteads: number;
  };
  eligibleSchemes: string[];
  priorityInterventions: string[];
  status: "High-Priority" | "Medium-Priority" | "Low-Priority";
};

// ############################################################################
// DYNAMIC MAP IMPORT
// ############################################################################
const DynamicMap = dynamic(() => import("@/components/map/interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-muted">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading FRA Atlas...</p>
      </div>
    </div>
  ),
});

// ############################################################################
// MAIN MAP PAGE COMPONENT
// ############################################################################
export default function MapPage() {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    state: "all",
    district: "all",
  });

  const [layers, setLayers] = useState<Layers>({
    villages: true,
    boundaries: false,
    assets: false,
    baseLayer: "street",
  });

  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    null
  );

  const filteredFeatures = useMemo(() => {
    return MOCK_VILLAGE_GEOJSON.features.filter((feature) => {
      const p = feature.properties;
      if (filters.state !== "all" && p?.state !== filters.state) return false;
      if (filters.district !== "all" && p?.district !== filters.district)
        return false;
      if (
        filters.query &&
        !p?.villageName.toLowerCase().includes(filters.query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [filters]);

  const filteredGeoJson: FeatureCollection = {
    type: "FeatureCollection",
    features: filteredFeatures,
  };

  const selectedFeatureData = useMemo(() => {
    if (!selectedFeatureId) return null;
    const feature = MOCK_VILLAGE_GEOJSON.features.find(
      (f) => f.properties?.id === selectedFeatureId
    );
    return feature?.properties as VillageProperties | null;
  }, [selectedFeatureId]);

  // Aggregate stats
  const aggregateStats = useMemo(() => {
    return {
      villageCount: filteredFeatures.length,
      totalPopulation: filteredFeatures.reduce(
        (acc, f) => acc + (f.properties?.population || 0),
        0
      ),
      totalArea: filteredFeatures.reduce(
        (acc, f) => acc + (f.properties?.totalAreaHa || 0),
        0
      ),
    };
  }, [filteredFeatures]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            FRA WebGIS Atlas
          </h1>
          <p className="text-lg text-muted-foreground">
            Interactive Decision Support System for Forest Rights Act.
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <KpiCard
            title="Villages in View"
            value={aggregateStats.villageCount.toLocaleString()}
            icon={MapPin}
          />
          <KpiCard
            title="Total Population"
            value={aggregateStats.totalPopulation.toLocaleString()}
            icon={Users}
          />
          <KpiCard
            title="Total Area"
            value={`${aggregateStats.totalArea.toFixed(2)} Ha`}
            icon={AreaChart}
          />
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          style={{ height: "calc(100vh - 250px)" }}
        >
          {/* LEFT SIDEBAR (Controls / Details) */}
          <div className="lg:col-span-4 xl:col-span-3 h-full">
            <Card className="h-full flex flex-col">
              {selectedFeatureData ? (
                <FeatureDetailPanel
                  data={selectedFeatureData}
                  onClose={() => setSelectedFeatureId(null)}
                />
              ) : (
                <MapControls
                  filters={filters}
                  setFilters={setFilters}
                  layers={layers}
                  setLayers={setLayers}
                  filteredFeatures={filteredFeatures}
                />
              )}
            </Card>
          </div>

          {/* MAP AREA */}
          <div className="lg:col-span-8 xl:col-span-9 h-full">
            <Card className="h-full shadow-md">
              <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                <DynamicMap
                  geoData={filteredGeoJson}
                  layers={layers}
                  onFeatureSelect={setSelectedFeatureId}
                  selectedFeatureId={selectedFeatureId}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ############################################################################
// SUB-COMPONENTS
// ############################################################################

// KPI Card Component
function KpiCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// Map Controls Component
function MapControls({
  filters,
  setFilters,
  layers,
  setLayers,
  filteredFeatures,
}: any) {
  const [localQuery, setLocalQuery] = useState(filters.query);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleLayerChange = (
    key: keyof Omit<Layers, "baseLayer">,
    checked: boolean
  ) => {
    setLayers({ ...layers, [key]: checked });
  };

  const resetFilters = () => {
    setFilters({ query: "", state: "all", district: "all" });
    setLocalQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("query", localQuery);
  };

  const uniqueStates = [
    "all",
    ...Array.from(
      new Set(MOCK_VILLAGE_GEOJSON.features.map((f) => f.properties!.state))
    ),
  ];
  const uniqueDistricts = [
    "all",
    ...Array.from(
      new Set(MOCK_VILLAGE_GEOJSON.features.map((f) => f.properties!.district))
    ),
  ];

  return (
    <Tabs defaultValue="controls" className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Atlas Navigator</CardTitle>
        <CardDescription>Filter and explore FRA data.</CardDescription>
        <TabsList className="grid w-full grid-cols-2 mt-4">
          <TabsTrigger value="controls">
            <Filter className="w-4 h-4 mr-2" />
            Controls
          </TabsTrigger>
          <TabsTrigger value="data">
            <List className="w-4 h-4 mr-2" />
            Visible Data
          </TabsTrigger>
        </TabsList>
      </CardHeader>

      <TabsContent
        value="controls"
        className="flex-1 overflow-y-auto px-6 pb-6 space-y-6"
      >
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <Label htmlFor="search">Search by Village Name</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="e.g., Kondapuram..."
              className="pl-10"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>
        </form>

        <Separator />

        {/* FILTERS */}
        <div className="space-y-4">
          <Label className="font-semibold">Filters</Label>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm">
              State
            </Label>
            <Select
              value={filters.state}
              onValueChange={(v) => handleFilterChange("state", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {uniqueStates.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "All States" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="district" className="text-sm">
              District
            </Label>
            <Select
              value={filters.district}
              onValueChange={(v) => handleFilterChange("district", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {uniqueDistricts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "all" ? "All Districts" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="w-full text-red-500 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" /> Reset Filters
          </Button>
        </div>

        <Separator />

        {/* LAYERS */}
        <div className="space-y-4">
          <Label className="font-semibold">Data Layers</Label>
          <div className="pl-2 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="villages"
                checked={layers.villages}
                onCheckedChange={(c) =>
                  handleLayerChange("villages", c as boolean)
                }
              />
              <Label htmlFor="villages">FRA Villages</Label>
            </div>
          </div>
          <Label className="text-sm text-muted-foreground">Base Map</Label>
          <Select
            value={layers.baseLayer}
            onValueChange={(v) => setLayers({ ...layers, baseLayer: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="street">Topographic</SelectItem>
              <SelectItem value="satellite">Satellite Imagery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
      <TabsContent
        value="data"
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        <h4 className="font-semibold px-2">
          {filteredFeatures.length} Villages in View
        </h4>
        {filteredFeatures.length > 0 ? (
          filteredFeatures.map(
            ({ properties: p }: { properties: VillageProperties | null }) => (
              <Card
                key={p!.id}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <CardContent className="p-3">
                  <p className="font-medium text-sm">{p!.villageName}</p>
                  <p className="text-xs text-muted-foreground">
                    {p!.district}, {p!.state}
                  </p>
                </CardContent>
              </Card>
            )
          )
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No villages match filters.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

// Feature Detail Panel Component
function FeatureDetailPanel({
  data,
  onClose,
}: {
  data: VillageProperties;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle>{data.villageName}</CardTitle>
        <CardDescription>
          {data.district}, {data.state}
        </CardDescription>
      </CardHeader>
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Population</p>
            <p className="text-lg font-bold">
              {data.population.toLocaleString()}
            </p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Tribal Pop.</p>
            <p className="text-lg font-bold">
              {data.tribalPopulation.toLocaleString()}
            </p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">IFR Pattas</p>
            <p className="text-lg font-bold">{data.ifrPattas}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">CFR Pattas</p>
            <p className="text-lg font-bold">{data.cfrPattas}</p>
          </div>
        </div>

        <Separator />

        {/* Assets Overview */}
        <div>
          <h4 className="font-semibold mb-3">
            <Building2 className="w-4 h-4 mr-2 inline-block" /> Assets Overview
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center text-muted-foreground">
                <TreePine className="w-4 h-4 mr-2" />
                Forest Cover:
              </span>
              <span className="font-medium">
                {data.assets.forestCoverHa} Ha
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center text-muted-foreground">
                <Info className="w-4 h-4 mr-2" />
                Agricultural Land:
              </span>
              <span className="font-medium">
                {data.assets.agriculturalLandHa} Ha
              </span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center text-muted-foreground">
                <Droplets className="w-4 h-4 mr-2" />
                Water Bodies:
              </span>
              <span className="font-medium">{data.assets.waterBodies}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center text-muted-foreground">
                <Home className="w-4 h-4 mr-2" />
                Homesteads:
              </span>
              <span className="font-medium">{data.assets.homesteads}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Eligible Schemes */}
        <div>
          <h4 className="font-semibold mb-3">
            <CheckCircle2 className="w-4 h-4 mr-2 inline-block" /> Eligible
            Schemes
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.eligibleSchemes.map((scheme) => (
              <div
                key={scheme}
                className="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full"
              >
                {scheme}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Priority Interventions */}
        <div>
          <h4 className="font-semibold mb-3">
            <Target className="w-4 h-4 mr-2 inline-block" /> Priority
            Interventions
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.priorityInterventions.map((item) => (
              <div
                key={item}
                className="text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
