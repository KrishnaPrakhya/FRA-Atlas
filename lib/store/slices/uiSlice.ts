import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  language: string
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  modals: Record<string, boolean>
  loading: Record<string, boolean>
  notifications: {
    show: boolean
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
  } | null
  breadcrumbs: Array<{
    label: string
    href?: string
  }>
  pageTitle: string
  searchQuery: string
  recentSearches: string[]
}

const initialState: UIState = {
  theme: 'light',
  language: 'en',
  sidebarOpen: false,
  sidebarCollapsed: false,
  modals: {},
  loading: {},
  notifications: null,
  breadcrumbs: [],
  pageTitle: 'FRA Atlas',
  searchQuery: '',
  recentSearches: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading
    },
    showNotification: (state, action: PayloadAction<{
      message: string
      type: 'success' | 'error' | 'warning' | 'info'
      duration?: number
    }>) => {
      state.notifications = action.payload
    },
    hideNotification: (state) => {
      state.notifications = null
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; href?: string }>>) => {
      state.breadcrumbs = action.payload
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim()
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches.unshift(query)
        if (state.recentSearches.length > 10) {
          state.recentSearches = state.recentSearches.slice(0, 10)
        }
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = []
    },
  },
})

export const {
  setTheme,
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  openModal,
  closeModal,
  setLoading,
  showNotification,
  hideNotification,
  setBreadcrumbs,
  setPageTitle,
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
} = uiSlice.actions

export default uiSlice.reducer