import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import type { Document } from '../slices/documentsSlice'

interface DocumentsResponse {
  success: boolean
  data: Document[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface DocumentResponse {
  success: boolean
  data: Document
}

interface UploadDocumentRequest {
  file: File
  claimId: string
  category?: string
  tags?: string[]
}

export const documentsApi = createApi({
  reducerPath: 'documentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/documents',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Document'],
  endpoints: (builder) => ({
    getDocuments: builder.query<DocumentsResponse, {
      page?: number
      limit?: number
      claimId?: string
      status?: string[]
      category?: string[]
    }>({
      query: ({ page = 1, limit = 20, claimId, status, category }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        
        if (claimId) params.append('claimId', claimId)
        if (status?.length) params.append('status', status.join(','))
        if (category?.length) params.append('category', category.join(','))
        
        return `?${params.toString()}`
      },
      providesTags: ['Document'],
    }),
    getDocumentById: builder.query<DocumentResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Document', id }],
    }),
    uploadDocument: builder.mutation<DocumentResponse, UploadDocumentRequest>({
      query: ({ file, claimId, category, tags }) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('claimId', claimId)
        if (category) formData.append('category', category)
        if (tags) formData.append('tags', JSON.stringify(tags))
        
        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Document'],
    }),
    deleteDocument: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),
    updateDocument: builder.mutation<DocumentResponse, {
      id: string
      updates: Partial<Document>
    }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Document', id }],
    }),
    verifyDocument: builder.mutation<DocumentResponse, {
      id: string
      status: 'VERIFIED' | 'REJECTED'
      comments?: string
    }>({
      query: ({ id, status, comments }) => ({
        url: `/${id}/verify`,
        method: 'POST',
        body: { status, comments },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Document', id }],
    }),
    processDocument: builder.mutation<{
      success: boolean
      data: {
        ocrText?: string
        extractedEntities?: Record<string, unknown>
        processingStatus: 'COMPLETED' | 'FAILED'
      }
    }, string>({
      query: (id) => ({
        url: `/${id}/process`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Document', id }],
    }),
    downloadDocument: builder.mutation<{ success: boolean; downloadUrl: string }, string>({
      query: (id) => ({
        url: `/${id}/download`,
        method: 'GET',
      }),
    }),
    getDocumentPreview: builder.query<{ success: boolean; previewUrl: string }, string>({
      query: (id) => `/${id}/preview`,
    }),
    bulkDeleteDocuments: builder.mutation<{ success: boolean; deleted: number }, string[]>({
      query: (documentIds) => ({
        url: '/bulk-delete',
        method: 'DELETE',
        body: { documentIds },
      }),
      invalidatesTags: ['Document'],
    }),
    getDocumentStats: builder.query<{
      success: boolean
      data: {
        total: number
        byStatus: Record<string, number>
        byCategory: Record<string, number>
        totalSize: number
        averageProcessingTime: number
      }
    }, { claimId?: string }>({
      query: ({ claimId }) => {
        const params = claimId ? `?claimId=${claimId}` : ''
        return `/stats${params}`
      },
    }),
  }),
})

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
  useVerifyDocumentMutation,
  useProcessDocumentMutation,
  useDownloadDocumentMutation,
  useGetDocumentPreviewQuery,
  useBulkDeleteDocumentsMutation,
  useGetDocumentStatsQuery,
} = documentsApi