import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import type { Claim, ClaimFilters, PaginationState } from '../slices/claimsSlice'

interface ClaimsResponse {
  success: boolean
  data: Claim[]
  pagination: PaginationState
}

interface ClaimResponse {
  success: boolean
  data: Claim
}

interface CreateClaimRequest {
  claimantName: string
  villageName: string
  district: string
  state: string
  forestAreaHectares: number
  claimType: 'INDIVIDUAL' | 'COMMUNITY' | 'TRADITIONAL'
  landDescription?: string
  traditionalUse?: string
}

interface ClaimStatsResponse {
  success: boolean
  data: {
    total_claims: number
    pending_claims: number
    under_review_claims: number
    approved_claims: number
    rejected_claims: number
    pending_documents_claims: number
    processing_claims: number
    completed_claims: number
    recent_activity: number
    avg_processing_time_days: number
    claims_by_district: Array<{ district: string; count: number }>
    status_distribution: Record<string, number>
  }
}

export const claimsApi = createApi({
  reducerPath: 'claimsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/claims',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Claim', 'ClaimStats'],
  endpoints: (builder) => ({
    getClaims: builder.query<ClaimsResponse, { 
      page?: number
      limit?: number
      filters?: ClaimFilters
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }>({
      query: ({ page = 1, limit = 20, filters = {}, sortBy = 'submissionDate', sortOrder = 'desc' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        })
        
        // Add filters to params
        if (filters.status?.length) {
          params.append('status', filters.status.join(','))
        }
        if (filters.district?.length) {
          params.append('district', filters.district.join(','))
        }
        if (filters.state?.length) {
          params.append('state', filters.state.join(','))
        }
        if (filters.claimType?.length) {
          params.append('claimType', filters.claimType.join(','))
        }
        if (filters.searchQuery) {
          params.append('search', filters.searchQuery)
        }
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start)
          params.append('endDate', filters.dateRange.end)
        }
        
        return `?${params.toString()}`
      },
      providesTags: ['Claim'],
    }),
    getClaimById: builder.query<ClaimResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Claim', id }],
    }),
    createClaim: builder.mutation<ClaimResponse, CreateClaimRequest>({
      query: (claimData) => ({
        url: '',
        method: 'POST',
        body: claimData,
      }),
      invalidatesTags: ['Claim', 'ClaimStats'],
    }),
    updateClaim: builder.mutation<ClaimResponse, { id: string; updates: Partial<Claim> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Claim', id }, 'ClaimStats'],
    }),
    deleteClaim: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Claim', 'ClaimStats'],
    }),
    updateClaimStatus: builder.mutation<ClaimResponse, { 
      id: string
      status: Claim['status']
      comments?: string
    }>({
      query: ({ id, status, comments }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body: { status, comments },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Claim', id }, 'ClaimStats'],
    }),
    getClaimStats: builder.query<ClaimStatsResponse, void>({
      query: () => '/stats',
      providesTags: ['ClaimStats'],
    }),
    exportClaims: builder.mutation<{ success: boolean; downloadUrl: string }, {
      format: 'csv' | 'excel' | 'pdf'
      filters?: ClaimFilters
    }>({
      query: ({ format, filters = {} }) => ({
        url: '/export',
        method: 'POST',
        body: { format, filters },
      }),
    }),
    bulkUpdateClaims: builder.mutation<{ success: boolean; updated: number }, {
      claimIds: string[]
      updates: Partial<Claim>
    }>({
      query: ({ claimIds, updates }) => ({
        url: '/bulk-update',
        method: 'PATCH',
        body: { claimIds, updates },
      }),
      invalidatesTags: ['Claim', 'ClaimStats'],
    }),
    getClaimHistory: builder.query<{
      success: boolean
      data: Array<{
        id: string
        action: string
        changes: Record<string, unknown>
        timestamp: string
        userId: string
        userName: string
      }>
    }, string>({
      query: (claimId) => `/${claimId}/history`,
    }),
  }),
})

export const {
  useGetClaimsQuery,
  useGetClaimByIdQuery,
  useCreateClaimMutation,
  useUpdateClaimMutation,
  useDeleteClaimMutation,
  useUpdateClaimStatusMutation,
  useGetClaimStatsQuery,
  useExportClaimsMutation,
  useBulkUpdateClaimsMutation,
  useGetClaimHistoryQuery,
} = claimsApi