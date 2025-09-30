import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface OfflineAction {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  entity: 'claim' | 'document' | 'user'
  data: Record<string, unknown>
  timestamp: number
  retryCount: number
  maxRetries: number
}

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

interface OfflineState {
  isOnline: boolean
  pendingActions: OfflineAction[]
  syncStatus: SyncStatus
  lastSync: Date | null
  syncProgress: {
    total: number
    completed: number
    failed: number
  }
  conflictResolution: {
    conflicts: Array<{
      id: string
      localData: Record<string, unknown>
      serverData: Record<string, unknown>
      entity: string
      timestamp: number
    }>
    strategy: 'local' | 'server' | 'manual'
  }
  offlineCapabilities: {
    canCreateClaims: boolean
    canUploadDocuments: boolean
    canViewData: boolean
    storageQuota: number
    usedStorage: number
  }
}

const initialState: OfflineState = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingActions: [],
  syncStatus: 'idle',
  lastSync: null,
  syncProgress: {
    total: 0,
    completed: 0,
    failed: 0,
  },
  conflictResolution: {
    conflicts: [],
    strategy: 'manual',
  },
  offlineCapabilities: {
    canCreateClaims: true,
    canUploadDocuments: false, // Requires online connection
    canViewData: true,
    storageQuota: 50 * 1024 * 1024, // 50MB
    usedStorage: 0,
  },
}

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
      if (action.payload && state.pendingActions.length > 0) {
        state.syncStatus = 'syncing'
      }
    },
    addPendingAction: (state, action: PayloadAction<Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>>) => {
      const pendingAction: OfflineAction = {
        ...action.payload,
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
      }
      state.pendingActions.push(pendingAction)
    },
    removePendingAction: (state, action: PayloadAction<string>) => {
      state.pendingActions = state.pendingActions.filter(pendingAction => pendingAction.id !== action.payload)
    },
    incrementRetryCount: (state, action: PayloadAction<string>) => {
      const action_item = state.pendingActions.find(a => a.id === action.payload)
      if (action_item) {
        action_item.retryCount += 1
      }
    },
    clearPendingActions: (state) => {
      state.pendingActions = []
    },
    setSyncStatus: (state, action: PayloadAction<SyncStatus>) => {
      state.syncStatus = action.payload
    },
    setLastSync: (state, action: PayloadAction<Date>) => {
      state.lastSync = action.payload
    },
    setSyncProgress: (state, action: PayloadAction<Partial<typeof initialState.syncProgress>>) => {
      state.syncProgress = { ...state.syncProgress, ...action.payload }
    },
    addConflict: (state, action: PayloadAction<{
      id: string
      localData: Record<string, unknown>
      serverData: Record<string, unknown>
      entity: string
    }>) => {
      state.conflictResolution.conflicts.push({
        ...action.payload,
        timestamp: Date.now(),
      })
    },
    resolveConflict: (state, action: PayloadAction<{ id: string; resolution: 'local' | 'server' }>) => {
      state.conflictResolution.conflicts = state.conflictResolution.conflicts.filter(
        conflict => conflict.id !== action.payload.id
      )
    },
    setConflictResolutionStrategy: (state, action: PayloadAction<'local' | 'server' | 'manual'>) => {
      state.conflictResolution.strategy = action.payload
    },
    updateOfflineCapabilities: (state, action: PayloadAction<Partial<typeof initialState.offlineCapabilities>>) => {
      state.offlineCapabilities = { ...state.offlineCapabilities, ...action.payload }
    },
    updateStorageUsage: (state, action: PayloadAction<number>) => {
      state.offlineCapabilities.usedStorage = action.payload
    },
  },
})

export const {
  setOnlineStatus,
  addPendingAction,
  removePendingAction,
  incrementRetryCount,
  clearPendingActions,
  setSyncStatus,
  setLastSync,
  setSyncProgress,
  addConflict,
  resolveConflict,
  setConflictResolutionStrategy,
  updateOfflineCapabilities,
  updateStorageUsage,
} = offlineSlice.actions

export default offlineSlice.reducer