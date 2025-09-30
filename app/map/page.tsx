"use client";

import { Suspense, useState, useEffect, useMemo, FC } from "react";
import dynamic from "next/dynamic";
import type { GeoJsonObject, FeatureCollection } from "geojson";

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
  Search,
  Filter,
  Download,
  Layers3,
  List,
  X,
  Loader2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

// ############################################################################
// TYPES
// ############################################################################
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

// ############################################################################
// MOCK GEOSPATIAL DATA (Replace with API call)
// ############################################################################
const MOCK_GEOJSON_DATA: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "CFR/101/DEH",
        name: "Jaunpur Forest Reserve",
        type: "CFR",
        status: "Approved",
        district: "dehradun",
        area: "150 Ha",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.0, 30.5],
            [78.1, 30.5],
            [78.1, 30.6],
            [78.0, 30.6],
            [78.0, 30.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "IFR/23/DEH",
        name: "Ramesh Singh",
        type: "IFR",
        status: "Approved",
        district: "dehradun",
        area: "2 Ha",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.12, 30.52],
            [78.14, 30.52],
            [78.14, 30.54],
            [78.12, 30.54],
            [78.12, 30.52],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "IFR/24/HAR",
        name: "Sunita Devi",
        type: "IFR",
        status: "Pending",
        district: "haridwar",
        area: "1.5 Ha",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.15, 30.0],
            [78.17, 30.0],
            [78.17, 30.02],
            [78.15, 30.02],
            [78.15, 30.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "CR/05/HAR",
        name: "Chiriakhana Grazing Land",
        type: "CR",
        status: "Rejected",
        district: "haridwar",
        area: "50 Ha",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.2, 30.1],
            [78.3, 30.1],
            [78.3, 30.2],
            [78.2, 30.2],
            [78.2, 30.1],
          ],
        ],
      },
    },
  ],
};

// ############################################################################
// 0. REAL INTERACTIVE MAP COMPONENT
// This replaces the placeholder with a functional react-leaflet map.
// ############################################################################

// Dynamic import for the map component to avoid SSR issues
const DynamicMap = dynamic(() => import("@/components/map/interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-muted/50">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading Map...</p>
      </div>
    </div>
  ),
});

// ############################################################################
// 1. MAP CONTAINER WRAPPER (Client Component)
// This handles the client-side rendering check.
// ############################################################################
function MapContainerWrapper({
  filters,
  layers,
}: {
  filters: Filters;
  layers: Layers;
}) {
  return (
    <DynamicMap filters={filters} layers={layers} geoData={MOCK_GEOJSON_DATA} />
  );
}

// ############################################################################
// 2. MAP CONTROLS & DATA SIDEBAR (Client Component)
// ############################################################################
interface MapControlsAndDataProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  layers: Layers;
  setLayers: (layers: Layers) => void;
}

function MapControlsAndData({
  filters,
  setFilters,
  layers,
  setLayers,
}: MapControlsAndDataProps) {
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

  const handleBaseLayerChange = (value: "street" | "satellite") => {
    setLayers({ ...layers, baseLayer: value });
  };

  const resetFilters = () => {
    setFilters({
      query: "",
      district: "all",
      status: "all",
      claimType: "all",
    });
    setLocalQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("query", localQuery);
  };

  useEffect(() => {
    setLocalQuery(filters.query);
  }, [filters.query]);

  const hasActiveFilters =
    filters.district !== "all" ||
    filters.status !== "all" ||
    filters.claimType !== "all" ||
    filters.query !== "";

  return (
    <Card className="h-full flex flex-col">
      <Tabs defaultValue="controls" className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>FRA Atlas Navigator</CardTitle>
          <CardDescription>Analyze claims, layers, and assets.</CardDescription>
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
            <Label htmlFor="search">Search by Name / Claim ID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="e.g., CFR/101/XYZ..."
                className="pl-10"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
            </div>
          </form>

          <Separator />

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold">
              <span>
                <Filter className="w-4 h-4 mr-2 inline-block" />
                Filters
              </span>
              <ChevronDown className="w-4 h-4 transition-transform [&[data-state=open]]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={filters.district}
                  onValueChange={(value) =>
                    handleFilterChange("district", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    <SelectItem value="dehradun">Dehradun</SelectItem>
                    <SelectItem value="haridwar">Haridwar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Claim Type</Label>
                <Select
                  value={filters.claimType}
                  onValueChange={(value) =>
                    handleFilterChange("claimType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="IFR">Individual (IFR)</SelectItem>
                    <SelectItem value="CR">Community (CR)</SelectItem>
                    <SelectItem value="CFR">Community Forest (CFR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="w-full text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold">
              <span>
                <Layers3 className="w-4 h-4 mr-2 inline-block" />
                Data Layers
              </span>
              <ChevronDown className="w-4 h-4 transition-transform [&[data-state=open]]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <Label className="text-sm text-muted-foreground">Overlays</Label>
              <div className="pl-2 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="claims"
                    checked={layers.claims}
                    onCheckedChange={(c) =>
                      handleLayerChange("claims", c as boolean)
                    }
                  />
                  <Label htmlFor="claims">FRA Claims</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="boundaries"
                    checked={layers.boundaries}
                    onCheckedChange={(c) =>
                      handleLayerChange("boundaries", c as boolean)
                    }
                  />
                  <Label htmlFor="boundaries">Village/Forest Boundaries</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assets"
                    checked={layers.assets}
                    onCheckedChange={(c) =>
                      handleLayerChange("assets", c as boolean)
                    }
                  />
                  <Label htmlFor="assets">AI-Mapped Assets</Label>
                </div>
              </div>
              <Label className="text-sm text-muted-foreground">Base Map</Label>
              <Select
                value={layers.baseLayer}
                onValueChange={(value) =>
                  handleBaseLayerChange(value as "street" | "satellite")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="street">Topographic</SelectItem>
                  <SelectItem value="satellite">Satellite Imagery</SelectItem>
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <div className="space-y-2">
            <Label className="font-semibold">Tools</Label>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" /> Export View as GeoJSON
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="data" className="flex-1 overflow-y-auto">
          <Suspense fallback={<ClaimsListSkeleton />}>
            <ClaimsListOnMap filters={filters} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// ############################################################################
// 3. CLAIMS LIST ON MAP (Client Component)
// ############################################################################
const MOCK_CLAIMS_LIST = [
  {
    id: "CFR/101/DEH",
    name: "Jaunpur Forest Reserve",
    area: "150 Ha",
    status: "Approved",
    district: "dehradun",
    type: "CFR",
  },
  {
    id: "IFR/23/DEH",
    name: "Ramesh Singh",
    area: "2 Ha",
    status: "Approved",
    district: "dehradun",
    type: "IFR",
  },
  {
    id: "IFR/24/HAR",
    name: "Sunita Devi",
    area: "1.5 Ha",
    status: "Pending",
    district: "haridwar",
    type: "IFR",
  },
  {
    id: "CR/05/HAR",
    name: "Chiriakhana Grazing Land",
    area: "50 Ha",
    status: "Rejected",
    district: "haridwar",
    type: "CR",
  },
];

function ClaimsListOnMap({ filters }: { filters: Filters }) {
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<typeof MOCK_CLAIMS_LIST>([]);

  useEffect(() => {
    setLoading(true);
    // In a real app, you would fetch data from your API
    console.log("Fetching claims with filters:", filters);
    setTimeout(() => {
      // Simulate network delay
      const filteredClaims = MOCK_CLAIMS_LIST.filter((c) => {
        if (filters.district !== "all" && c.district !== filters.district)
          return false;
        if (filters.status !== "all" && c.status !== filters.status)
          return false;
        if (filters.claimType !== "all" && c.type !== filters.claimType)
          return false;
        return true;
      });
      setClaims(filteredClaims);
      setLoading(false);
    }, 500);
  }, [filters]);

  if (loading) {
    return <ClaimsListSkeleton />;
  }

  return (
    <div className="p-4 space-y-2">
      <div className="px-2 pb-2">
        <h4 className="font-semibold">{claims.length} Claims in View</h4>
        <p className="text-sm text-muted-foreground">
          Click a claim to zoom on map
        </p>
      </div>
      {claims.length > 0 ? (
        claims.map((claim) => (
          <Card
            key={claim.id}
            className="hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{claim.name}</p>
                <p className="text-xs text-muted-foreground">
                  {claim.id} &bull; {claim.area}
                </p>
              </div>
              <div
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  claim.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : claim.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {claim.status}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No claims match the current filters.
          </p>
        </div>
      )}
    </div>
  );
}

// ############################################################################
// 4. MAIN MAP PAGE COMPONENT
// This is the parent component that holds all the state.
// ############################################################################
export default function MapPage() {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    district: "all",
    status: "all",
    claimType: "all",
  });

  const [layers, setLayers] = useState<Layers>({
    claims: true,
    boundaries: true,
    assets: false,
    baseLayer: "street",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            WebGIS Mapping Platform
          </h1>
          <p className="text-lg text-muted-foreground">
            Interactive atlas for Forest Rights Act (FRA) claims, assets, and
            spatial analysis.
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          style={{ height: "calc(100vh - 160px)" }}
        >
          <div className="lg:col-span-1 h-full">
            <Suspense fallback={<MapControlsSkeleton />}>
              <MapControlsAndData
                filters={filters}
                setFilters={setFilters}
                layers={layers}
                setLayers={setLayers}
              />
            </Suspense>
          </div>
          <div className="lg:col-span-3 h-full">
            <Card className="h-full shadow-md">
              <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                <MapContainerWrapper filters={filters} layers={layers} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ############################################################################
// 5. LOADING SKELETONS
// ############################################################################
function MapControlsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-16" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
}

function ClaimsListSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-2">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
