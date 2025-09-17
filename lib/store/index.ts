import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authSlice from './slices/authSlice'
import claimsSlice from './slices/claimsSlice'
import documentsSlice from './slices/documentsSlice'
import spatialSlice from './slices/spatialSlice'
import notificationsSlice from './slices/notificationsSlice'
import uiSlice from './slices/uiSlice'
import offlineSlice from './slices/offlineSlice'
import { authApi } from './api/authApi'
import { claimsApi } from './api/claimsApi'
import { documentsApi } from './api/documentsApi'
import { spatialApi } from './api/spatialApi'
import { notificationsApi } from './api/notificationsApi'
import { analyticsApi } from './api/analyticsApi'

export const store = configureStore({
  reducer: {
    // Slices
    auth: authSlice,
    claims: claimsSlice,
    documents: documentsSlice,
    spatial: spatialSlice,
    notifications: notificationsSlice,
    ui: uiSlice,
    offline: offlineSlice,
    
    // RTK Query APIs
    [authApi.reducerPath]: authApi.reducer,
    [claimsApi.reducerPath]: claimsApi.reducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
    [spatialApi.reducerPath]: spatialApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      claimsApi.middleware,
      documentsApi.middleware,
      spatialApi.middleware,
      notificationsApi.middleware,
      analyticsApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
})

// Setup listeners for RTK Query
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Export hooks
export { useAppDispatch, useAppSelector } from './hooks'