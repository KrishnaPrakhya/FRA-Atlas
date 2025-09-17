import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Claim {
  id: string
  claimNumber: string
  claimantName: string
  villageName: string
  district: string
  state: string
  forestAreaHectares: number
  claimType: 'INDIVIDUAL' | 'COMMUNITY' | 'TRADITIONAL'
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PENDING_DOCUMENTS'
  submissionDate: string
  lastUpdated: string
  actualCompletionDate?: string
}

export interface ClaimFilters {
  status?: string[]
  district?: string[]
  state?: string[]
  claimType?: string[]
  dateRange?: {
    start: string
    end: string
  }
  searchQuery?: string
}

export interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ClaimsState {
  claims: Claim[]
  currentClaim: Claim | null
  filters: ClaimFilters
  pagination: PaginationState
  isLoading: boolean
  error: string | null
  selectedClaims: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  viewMode: 'list' | 'grid' | 'map'
}

const initialState: ClaimsState = {
  claims: [],
  currentClaim: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  selectedClaims: [],
  sortBy: 'submissionDate',
  sortOrder: 'desc',
  viewMode: 'list',
}

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setClaims: (state, action: PayloadAction<Claim[]>) => {
      state.claims = action.payload
      state.isLoading = false
      state.error = null
    },
    addClaim: (state, action: PayloadAction<Claim>) => {
      state.claims.unshift(action.payload)
    },
    updateClaim: (state, action: PayloadAction<Claim>) => {
      const index = state.claims.findIndex(claim => claim.id === action.payload.id)
      if (index !== -1) {
        state.claims[index] = action.payload
      }
      if (state.currentClaim?.id === action.payload.id) {
        state.currentClaim = action.payload
      }
    },
    deleteClaim: (state, action: PayloadAction<string>) => {
      state.claims = state.claims.filter(claim => claim.id !== action.payload)
      if (state.currentClaim?.id === action.payload) {
        state.currentClaim = null
      }
    },
    setCurrentClaim: (state, action: PayloadAction<Claim | null>) => {
      state.currentClaim = action.payload
    },
    setFilters: (state, action: PayloadAction<ClaimFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1 // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {}
      state.pagination.page = 1
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setSelectedClaims: (state, action: PayloadAction<string[]>) => {
      state.selectedClaims = action.payload
    },
    toggleClaimSelection: (state, action: PayloadAction<string>) => {
      const claimId = action.payload
      if (state.selectedClaims.includes(claimId)) {
        state.selectedClaims = state.selectedClaims.filter(id => id !== claimId)
      } else {
        state.selectedClaims.push(claimId)
      }
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
    },
    setViewMode: (state, action: PayloadAction<'list' | 'grid' | 'map'>) => {
      state.viewMode = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  setClaims,
  addClaim,
  updateClaim,
  deleteClaim,
  setCurrentClaim,
  setFilters,
  clearFilters,
  setPagination,
  setSelectedClaims,
  toggleClaimSelection,
  setSorting,
  setViewMode,
} = claimsSlice.actions

export default claimsSlice.reducer