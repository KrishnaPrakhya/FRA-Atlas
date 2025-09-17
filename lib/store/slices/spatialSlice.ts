import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SpatialBoundary {
  id: string
  type: 'forest' | 'claim' | 'village' | 'protected'
  geoJsonData: GeoJSON.Feature
  area: number
  perimeter: number
  metadata: {
    name?: string
    description?: string
    claimId?: string
    createdBy?: string
    createdAt: string
    updatedAt: string
  }
}

export interface MapLayer {
  id: string
  name: string
  type: 'forest' | 'claims' | 'villages' | 'protected' | 'satellite' | 'terrain'
  visible: boolean
  opacity: number
  color?: string
  style?: Record<string, unknown>
}

export type DrawingMode = 'none' | 'polygon' | 'rectangle' | 'circle' | 'marker' | 'line'

interface SpatialState {
  mapCenter: [number, number]
  mapZoom: number
  selectedFeatures: SpatialBoundary[]
  drawingMode: DrawingMode
  layers: MapLayer[]
  boundaries: SpatialBoundary[]
  isLoading: boolean
  error: string | null
  searchResults: Array<{
    id: string
    name: string
    coordinates: [number, number]
    type: string
  }>
  measurements: {
    area?: number
    distance?: number
    coordinates?: [number, number][]
  }
  filters: {
    boundaryType?: string[]
    claimStatus?: string[]
    dateRange?: {
      start: string
      end: string
    }
  }
}

const defaultLayers: MapLayer[] = [
  { id: 'forest', name: 'Forest Boundaries', type: 'forest', visible: true, opacity: 0.7, color: '#22c55e' },
  { id: 'claims', name: 'Claim Areas', type: 'claims', visible: true, opacity: 0.8, color: '#3b82f6' },
  { id: 'villages', name: 'Villages', type: 'villages', visible: true, opacity: 0.9, color: '#f97316' },
  { id: 'protected', name: 'Protected Areas', type: 'protected', visible: false, opacity: 0.6, color: '#ef4444' },
]

const initialState: SpatialState = {
  mapCenter: [23.2599, 77.4126], // Center of India
  mapZoom: 6,
  selectedFeatures: [],
  drawingMode: 'none',
  layers: defaultLayers,
  boundaries: [],
  isLoading: false,
  error: null,
  searchResults: [],
  measurements: {},
  filters: {},
}

const spatialSlice = createSlice({
  name: 'spatial',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMapCenter: (state, action: PayloadAction<[number, number]>) => {
      state.mapCenter = action.payload
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.mapZoom = action.payload
    },
    setMapView: (state, action: PayloadAction<{ center: [number, number]; zoom: number }>) => {
      state.mapCenter = action.payload.center
      state.mapZoom = action.payload.zoom
    },
    setSelectedFeatures: (state, action: PayloadAction<SpatialBoundary[]>) => {
      state.selectedFeatures = action.payload
    },
    addSelectedFeature: (state, action: PayloadAction<SpatialBoundary>) => {
      state.selectedFeatures.push(action.payload)
    },
    removeSelectedFeature: (state, action: PayloadAction<string>) => {
      state.selectedFeatures = state.selectedFeatures.filter(f => f.id !== action.payload)
    },
    clearSelectedFeatures: (state) => {
      state.selectedFeatures = []
    },
    setDrawingMode: (state, action: PayloadAction<DrawingMode>) => {
      state.drawingMode = action.payload
    },
    setBoundaries: (state, action: PayloadAction<SpatialBoundary[]>) => {
      state.boundaries = action.payload
      state.isLoading = false
      state.error = null
    },
    addBoundary: (state, action: PayloadAction<SpatialBoundary>) => {
      state.boundaries.push(action.payload)
    },
    updateBoundary: (state, action: PayloadAction<SpatialBoundary>) => {
      const index = state.boundaries.findIndex(b => b.id === action.payload.id)
      if (index !== -1) {
        state.boundaries[index] = action.payload
      }
    },
    deleteBoundary: (state, action: PayloadAction<string>) => {
      state.boundaries = state.boundaries.filter(b => b.id !== action.payload)
      state.selectedFeatures = state.selectedFeatures.filter(f => f.id !== action.payload)
    },
    updateLayer: (state, action: PayloadAction<{ id: string; updates: Partial<MapLayer> }>) => {
      const layer = state.layers.find(l => l.id === action.payload.id)
      if (layer) {
        Object.assign(layer, action.payload.updates)
      }
    },
    toggleLayerVisibility: (state, action: PayloadAction<string>) => {
      const layer = state.layers.find(l => l.id === action.payload)
      if (layer) {
        layer.visible = !layer.visible
      }
    },
    setLayerOpacity: (state, action: PayloadAction<{ id: string; opacity: number }>) => {
      const layer = state.layers.find(l => l.id === action.payload.id)
      if (layer) {
        layer.opacity = action.payload.opacity
      }
    },
    setSearchResults: (state, action: PayloadAction<typeof initialState.searchResults>) => {
      state.searchResults = action.payload
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    setMeasurements: (state, action: PayloadAction<typeof initialState.measurements>) => {
      state.measurements = action.payload
    },
    clearMeasurements: (state) => {
      state.measurements = {}
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
  },
})

export const {
  setLoading,
  setError,
  setMapCenter,
  setMapZoom,
  setMapView,
  setSelectedFeatures,
  addSelectedFeature,
  removeSelectedFeature,
  clearSelectedFeatures,
  setDrawingMode,
  setBoundaries,
  addBoundary,
  updateBoundary,
  deleteBoundary,
  updateLayer,
  toggleLayerVisibility,
  setLayerOpacity,
  setSearchResults,
  clearSearchResults,
  setMeasurements,
  clearMeasurements,
  setFilters,
  clearFilters,
} = spatialSlice.actions

export default spatialSlice.reducer