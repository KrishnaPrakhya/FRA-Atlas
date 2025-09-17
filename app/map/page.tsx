import { DashboardHeader } from "@/components/dashboard-header";
import { Map, Layers, Navigation, BarChart3 } from "lucide-react";
import { MapContainer } from "@/components/map/map-container";
import { MapControls } from "@/components/map/map-controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Map className="h-8 w-8 text-blue-600" />
              Spatial Data & Mapping
            </h1>
            <p className="text-gray-600 mt-1">
              Interactive map showing forest rights claims and boundaries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Controls */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm sticky top-8">
              <CardContent className="p-6">
                <MapControls />
              </CardContent>
            </Card>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm h-[800px]">
              <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                <MapContainer />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-400 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Claims</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <div className="w-12 h-12 bg-green-300 bg-opacity-30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Area</p>
                  <p className="text-2xl font-bold">2,847 km²</p>
                </div>
                <div className="w-12 h-12 bg-blue-300 bg-opacity-30 rounded-lg flex items-center justify-center">
                  <Map className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-400 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Forest Regions</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div className="w-12 h-12 bg-purple-300 bg-opacity-30 rounded-lg flex items-center justify-center">
                  <Layers className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-400 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Villages</p>
                  <p className="text-2xl font-bold">892</p>
                </div>
                <div className="w-12 h-12 bg-orange-300 bg-opacity-30 rounded-lg flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
