import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import type { SpatialBoundary } from '../slices/spatialSlice'

interface SpatialDataResponse {
  success: boolean
  data: SpatialBoundary[]
}

interface LocationSearchResponse {
  success: boolean
  data: Array<{
    id: string
    name: string
    coordinates: [number, number]
    type: string
    bounds?: [[number, number], [number, number]]
  }>
}

interface AreaCalculationResponse {
  success: boolean
  data: {
    area: number
    perimeter: number
    centroid: [number, number]
  }
}

export const spatialApi = createApi({
  reducerPath: 'spatialApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/spatial',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['SpatialData', 'Boundary'],
  endpoints: (builder) => ({
    getSpatialData: builder.query<SpatialDataResponse, {
      bounds?: [[number, number], [number, number]]
      types?: string[]
      claimIds?: string[]
    }>({
      query: ({ bounds, types, claimIds }) => {
        const params = new URLSearchParams()
        
        if (bounds) {
          params.append('bounds', JSON.stringify(bounds))
        }
        if (types?.length) {
          params.append('types', types.join(','))
        }
        if (claimIds?.length) {
          params.append('claimIds', claimIds.join(','))
        }
        
        return `?${params.toString()}`
      },
      providesTags: ['SpatialData'],
    }),
    getBoundaryById: builder.query<{ success: boolean; data: SpatialBoundary }, string>({
      query: (id) => `/boundaries/${id}`,
      providesTags: (result, error, id) => [{ type: 'Boundary', id }],
    }),
    createBoundary: builder.mutation<{ success: boolean; data: SpatialBoundary }, {
      type: 'forest' | 'claim' | 'village' | 'protected'
      geoJsonData: GeoJSON.Feature
      metadata: {
        name?: string
        description?: string
        claimId?: string
      }
    }>({
      query: (boundaryData) => ({
        url: '/boundaries',
        method: 'POST',
        body: boundaryData,
      }),
      invalidatesTags: ['SpatialData', 'Boundary'],
    }),
    updateBoundary: builder.mutation<{ success: boolean; data: SpatialBoundary }, {
      id: string
      updates: Partial<SpatialBoundary>
    }>({
      query: ({ id, updates }) => ({
        url: `/boundaries/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Boundary', id }, 'SpatialData'],
    }),
    deleteBoundary: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/boundaries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SpatialData', 'Boundary'],
    }),
    searchLocations: builder.query<LocationSearchResponse, {
      query: string
      types?: string[]
      bounds?: [[number, number], [number, number]]
    }>({
      query: ({ query, types, bounds }) => {
        const params = new URLSearchParams({ q: query })
        
        if (types?.length) {
          params.append('types', types.join(','))
        }
        if (bounds) {
          params.append('bounds', JSON.stringify(bounds))
        }
        
        return `/search?${params.toString()}`
      },
    }),
    calculateArea: builder.mutation<AreaCalculationResponse, {
      geoJsonData: GeoJSON.Feature
    }>({
      query: ({ geoJsonData }) => ({
        url: '/calculate-area',
        method: 'POST',
        body: { geoJsonData },
      }),
    }),
    getClaimsInArea: builder.query<{
      success: boolean
      data: Array<{
        id: string
        claimNumber: string
        claimantName: string
        status: string
        coordinates: [number, number]
        area: number
      }>
    }, {
      bounds: [[number, number], [number, number]]
      status?: string[]
    }>({
      query: ({ bounds, status }) => {
        const params = new URLSearchParams({
          bounds: JSON.stringify(bounds),
        })
        
        if (status?.length) {
          params.append('status', status.join(','))
        }
        
        return `/claims-in-area?${params.toString()}`
      },
    }),
    validateBoundary: builder.mutation<{
      success: boolean
      data: {
        isValid: boolean
        issues: string[]
        suggestions: string[]
      }
    }, {
      geoJsonData: GeoJSON.Feature
      claimId?: string
    }>({
      query: ({ geoJsonData, claimId }) => ({
        url: '/validate-boundary',
        method: 'POST',
        body: { geoJsonData, claimId },
      }),
    }),
    getMapTiles: builder.query<{
      success: boolean
      data: {
        tileUrl: string
        attribution: string
        maxZoom: number
      }
    }, {
      layer: 'satellite' | 'terrain' | 'forest' | 'administrative'
    }>({
      query: ({ layer }) => `/tiles/${layer}`,
    }),
    exportSpatialData: builder.mutation<{
      success: boolean
      downloadUrl: string
    }, {
      format: 'geojson' | 'kml' | 'shapefile'
      bounds?: [[number, number], [number, number]]
      types?: string[]
    }>({
      query: ({ format, bounds, types }) => ({
        url: '/export',
        method: 'POST',
        body: { format, bounds, types },
      }),
    }),
  }),
})

export const {
  useGetSpatialDataQuery,
  useGetBoundaryByIdQuery,
  useCreateBoundaryMutation,
  useUpdateBoundaryMutation,
  useDeleteBoundaryMutation,
  useSearchLocationsQuery,
  useCalculateAreaMutation,
  useGetClaimsInAreaQuery,
  useValidateBoundaryMutation,
  useGetMapTilesQuery,
  useExportSpatialDataMutation,
} = spatialApi