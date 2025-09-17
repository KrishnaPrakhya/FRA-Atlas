import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

interface AnalyticsResponse {
  success: boolean
  data: Record<string, unknown>
}

interface DashboardMetrics {
  totalClaims: number
  pendingClaims: number
  approvedClaims: number
  rejectedClaims: number
  averageProcessingTime: number
  successRate: number
  activeUsers: number
  documentsProcessed: number
  trendsData: Array<{
    date: string
    claims: number
    approvals: number
    rejections: number
  }>
  statusDistribution: Record<string, number>
  regionalDistribution: Array<{
    state: string
    district: string
    count: number
    percentage: number
  }>
  processingTimes: Array<{
    stage: string
    averageTime: number
    unit: 'days' | 'hours'
  }>
  successFactors: Array<{
    factor: string
    impact: number
    description: string
  }>
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/analytics',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Analytics', 'DashboardMetrics'],
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<{
      success: boolean
      data: DashboardMetrics
    }, {
      dateRange?: {
        start: string
        end: string
      }
      region?: {
        state?: string
        district?: string
      }
    }>({
      query: ({ dateRange, region }) => {
        const params = new URLSearchParams()
        
        if (dateRange) {
          params.append('startDate', dateRange.start)
          params.append('endDate', dateRange.end)
        }
        if (region?.state) {
          params.append('state', region.state)
        }
        if (region?.district) {
          params.append('district', region.district)
        }
        
        return `/dashboard?${params.toString()}`
      },
      providesTags: ['DashboardMetrics'],
    }),
    getClaimsTrends: builder.query<{
      success: boolean
      data: Array<{
        date: string
        submitted: number
        approved: number
        rejected: number
        pending: number
      }>
    }, {
      period: 'daily' | 'weekly' | 'monthly' | 'yearly'
      dateRange?: {
        start: string
        end: string
      }
    }>({
      query: ({ period, dateRange }) => {
        const params = new URLSearchParams({ period })
        
        if (dateRange) {
          params.append('startDate', dateRange.start)
          params.append('endDate', dateRange.end)
        }
        
        return `/trends/claims?${params.toString()}`
      },
      providesTags: ['Analytics'],
    }),
    getRegionalAnalytics: builder.query<{
      success: boolean
      data: Array<{
        state: string
        districts: Array<{
          name: string
          totalClaims: number
          approvedClaims: number
          rejectedClaims: number
          pendingClaims: number
          averageProcessingTime: number
          successRate: number
        }>
        totalClaims: number
        successRate: number
        averageProcessingTime: number
      }>
    }, {
      level: 'state' | 'district' | 'village'
      state?: string
      district?: string
    }>({
      query: ({ level, state, district }) => {
        const params = new URLSearchParams({ level })
        
        if (state) params.append('state', state)
        if (district) params.append('district', district)
        
        return `/regional?${params.toString()}`
      },
      providesTags: ['Analytics'],
    }),
    getPerformanceMetrics: builder.query<{
      success: boolean
      data: {
        processingTimes: Array<{
          stage: string
          averageTime: number
          medianTime: number
          minTime: number
          maxTime: number
        }>
        bottlenecks: Array<{
          stage: string
          delayReason: string
          impact: number
          suggestions: string[]
        }>
        efficiency: {
          overall: number
          byStage: Record<string, number>
          trends: Array<{
            date: string
            efficiency: number
          }>
        }
      }
    }, {
      dateRange?: {
        start: string
        end: string
      }
    }>({
      query: ({ dateRange }) => {
        const params = new URLSearchParams()
        
        if (dateRange) {
          params.append('startDate', dateRange.start)
          params.append('endDate', dateRange.end)
        }
        
        return `/performance?${params.toString()}`
      },
      providesTags: ['Analytics'],
    }),
    getUserAnalytics: builder.query<{
      success: boolean
      data: {
        activeUsers: number
        usersByRole: Record<string, number>
        userActivity: Array<{
          date: string
          activeUsers: number
          newRegistrations: number
        }>
        topUsers: Array<{
          id: string
          name: string
          role: string
          claimsSubmitted: number
          documentsUploaded: number
          lastActive: string
        }>
      }
    }, {
      dateRange?: {
        start: string
        end: string
      }
    }>({
      query: ({ dateRange }) => {
        const params = new URLSearchParams()
        
        if (dateRange) {
          params.append('startDate', dateRange.start)
          params.append('endDate', dateRange.end)
        }
        
        return `/users?${params.toString()}`
      },
      providesTags: ['Analytics'],
    }),
    generateReport: builder.mutation<{
      success: boolean
      reportId: string
      downloadUrl: string
    }, {
      type: 'claims' | 'performance' | 'regional' | 'users' | 'comprehensive'
      format: 'pdf' | 'excel' | 'csv'
      dateRange?: {
        start: string
        end: string
      }
      filters?: Record<string, unknown>
      includeCharts?: boolean
    }>({
      query: (reportConfig) => ({
        url: '/reports/generate',
        method: 'POST',
        body: reportConfig,
      }),
    }),
    getReportStatus: builder.query<{
      success: boolean
      data: {
        status: 'pending' | 'processing' | 'completed' | 'failed'
        progress: number
        downloadUrl?: string
        error?: string
      }
    }, string>({
      query: (reportId) => `/reports/${reportId}/status`,
    }),
    getPredictiveAnalytics: builder.query<{
      success: boolean
      data: {
        claimsPrediction: Array<{
          date: string
          predictedClaims: number
          confidence: number
        }>
        processingTimePrediction: {
          averageTime: number
          confidence: number
          factors: Array<{
            factor: string
            impact: number
          }>
        }
        resourceRequirements: {
          officials: number
          processingCapacity: number
          estimatedBacklog: number
        }
      }
    }, {
      horizon: 'week' | 'month' | 'quarter' | 'year'
      region?: {
        state?: string
        district?: string
      }
    }>({
      query: ({ horizon, region }) => {
        const params = new URLSearchParams({ horizon })
        
        if (region?.state) params.append('state', region.state)
        if (region?.district) params.append('district', region.district)
        
        return `/predictive?${params.toString()}`
      },
      providesTags: ['Analytics'],
    }),
  }),
})

export const {
  useGetDashboardMetricsQuery,
  useGetClaimsTrendsQuery,
  useGetRegionalAnalyticsQuery,
  useGetPerformanceMetricsQuery,
  useGetUserAnalyticsQuery,
  useGenerateReportMutation,
  useGetReportStatusQuery,
  useGetPredictiveAnalyticsQuery,
} = analyticsApi