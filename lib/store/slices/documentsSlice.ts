import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Document {
  id: string
  filename: string
  originalFilename: string
  fileType: string
  fileSize: number
  uploadDate: string
  ocrText?: string
  extractedEntities?: Record<string, unknown>
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  processingStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  claimId: string
  uploadedBy: string
  tags?: string[]
  category?: string
}

interface DocumentsState {
  documents: Document[]
  uploadProgress: Record<string, number>
  processingStatus: Record<string, 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>
  isLoading: boolean
  error: string | null
  selectedDocuments: string[]
  filters: {
    status?: string[]
    category?: string[]
    claimId?: string
    dateRange?: {
      start: string
      end: string
    }
  }
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

const initialState: DocumentsState = {
  documents: [],
  uploadProgress: {},
  processingStatus: {},
  isLoading: false,
  error: null,
  selectedDocuments: [],
  filters: {},
  sortBy: 'uploadDate',
  sortOrder: 'desc',
}

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload
      state.isLoading = false
      state.error = null
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.unshift(action.payload)
    },
    updateDocument: (state, action: PayloadAction<Document>) => {
      const index = state.documents.findIndex(doc => doc.id === action.payload.id)
      if (index !== -1) {
        state.documents[index] = action.payload
      }
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload)
      delete state.uploadProgress[action.payload]
      delete state.processingStatus[action.payload]
    },
    setUploadProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      state.uploadProgress[action.payload.id] = action.payload.progress
    },
    clearUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload]
    },
    setProcessingStatus: (state, action: PayloadAction<{ id: string; status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' }>) => {
      state.processingStatus[action.payload.id] = action.payload.status
    },
    setSelectedDocuments: (state, action: PayloadAction<string[]>) => {
      state.selectedDocuments = action.payload
    },
    toggleDocumentSelection: (state, action: PayloadAction<string>) => {
      const docId = action.payload
      if (state.selectedDocuments.includes(docId)) {
        state.selectedDocuments = state.selectedDocuments.filter(id => id !== docId)
      } else {
        state.selectedDocuments.push(docId)
      }
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
    },
  },
})

export const {
  setLoading,
  setError,
  setDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
  setUploadProgress,
  clearUploadProgress,
  setProcessingStatus,
  setSelectedDocuments,
  toggleDocumentSelection,
  setFilters,
  clearFilters,
  setSorting,
} = documentsSlice.actions

export default documentsSlice.reducer