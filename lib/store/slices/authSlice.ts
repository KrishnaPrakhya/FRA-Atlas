import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  email: string
  name: string | null
  role: 'CLAIMANT' | 'OFFICIAL' | 'ADMIN'
  profile?: {
    phone?: string
    avatar?: string
    language?: string
    timezone?: string
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  refreshToken: string | null
  permissions: string[]
  lastActivity: number | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  refreshToken: null,
  permissions: [],
  lastActivity: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.isLoading = false
      state.lastActivity = Date.now()
      
      // Set permissions based on role
      switch (action.payload.user.role) {
        case 'ADMIN':
          state.permissions = ['claims:read', 'claims:write', 'claims:delete', 'users:manage', 'system:admin']
          break
        case 'OFFICIAL':
          state.permissions = ['claims:read', 'claims:write', 'documents:verify', 'workflow:manage']
          break
        case 'CLAIMANT':
          state.permissions = ['claims:read:own', 'claims:write:own', 'documents:upload']
          break
        default:
          state.permissions = []
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isLoading = false
      state.permissions = []
      state.lastActivity = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    updateTokens: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.lastActivity = Date.now()
    },
    updateActivity: (state) => {
      state.lastActivity = Date.now()
    },
  },
})

export const {
  setLoading,
  loginSuccess,
  logout,
  updateUser,
  updateTokens,
  updateActivity,
} = authSlice.actions

export default authSlice.reducer