"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Download, MapPin } from "lucide-react"

export function MapControls() {
  const [filters, setFilters] = useState({
    district: "All Districts",
    status: "All Statuses",
    claimType: "All Types",
    dateRange: "",
  })

  const [layers, setLayers] = useState({
    claims: true,
    forestBoundaries: true,
    claimAreas: true,
    satelliteView: false,
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleLayerToggle = (layer: string, checked: boolean) => {
    setLayers((prev) => ({ ...prev, [layer]: checked }))
  }

  const applyFilters = () => {
    // Emit filter change event or call parent callback
    console.log("Applying filters:", filters)
  }

  const resetFilters = () => {
    setFilters({
      district: "All Districts",
      status: "All Statuses",
      claimType: "All Types",
      dateRange: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Claims</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="search" placeholder="Search by claim number, name..." className="pl-10" />
        </div>
      </div>

      <Separator />

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Label className="font-semibold">Filters</Label>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Select value={filters.district} onValueChange={(value) => handleFilterChange("district", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Districts">All Districts</SelectItem>
                <SelectItem value="Dehradun">Dehradun</SelectItem>
                <SelectItem value="Haridwar">Haridwar</SelectItem>
                <SelectItem value="Pauri">Pauri Garhwal</SelectItem>
                <SelectItem value="Tehri">Tehri Garhwal</SelectItem>
                <SelectItem value="Uttarkashi">Uttarkashi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="claimType">Claim Type</Label>
            <Select value={filters.claimType} onValueChange={(value) => handleFilterChange("claimType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      <Separator />

      {/* Layer Controls */}
      <div className="space-y-4">
        <Label className="font-semibold">Map Layers</Label>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="claims"
              checked={layers.claims}
              onCheckedChange={(checked) => handleLayerToggle("claims", checked as boolean)}
            />
            <Label htmlFor="claims" className="text-sm">
              Forest Rights Claims
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="forestBoundaries"
              checked={layers.forestBoundaries}
              onCheckedChange={(checked) => handleLayerToggle("forestBoundaries", checked as boolean)}
            />
            <Label htmlFor="forestBoundaries" className="text-sm">
              Forest Boundaries
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="claimAreas"
              checked={layers.claimAreas}
              onCheckedChange={(checked) => handleLayerToggle("claimAreas", checked as boolean)}
            />
            <Label htmlFor="claimAreas" className="text-sm">
              Claim Areas
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="satelliteView"
              checked={layers.satelliteView}
              onCheckedChange={(checked) => handleLayerToggle("satelliteView", checked as boolean)}
            />
            <Label htmlFor="satelliteView" className="text-sm">
              Satellite View
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tools */}
      <div className="space-y-4">
        <Label className="font-semibold">Tools</Label>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <MapPin className="h-4 w-4 mr-2" />
            Measure Distance
          </Button>

          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Map
          </Button>
        </div>
      </div>
    </div>
  )
}
