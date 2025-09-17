import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Notification {
  id: string
  type: 'CLAIM_SUBMITTED' | 'CLAIM_APPROVED' | 'CLAIM_REJECTED' | 'DOCUMENT_REQUIRED' | 'DOCUMENT_VERIFIED' | 'WORKFLOW_UPDATE' | 'DEADLINE_REMINDER' | 'SYSTEM_ALERT' | 'MESSAGE_RECEIVED'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  data?: Record<string, unknown>
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  inApp: boolean
  categories: {
    claimUpdates: boolean
    documentRequests: boolean
    systemAlerts: boolean
    deadlineReminders: boolean
    messages: boolean
  }
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences
  isConnected: boolean
  lastFetch: number | null
  isLoading: boolean
  error: string | null
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  preferences: {
    email: true,
    sms: false,
    inApp: true,
    categories: {
      claimUpdates: true,
      documentRequests: true,
      systemAlerts: true,
      deadlineReminders: true,
      messages: true,
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  },
  isConnected: false,
  lastFetch: null,
  isLoading: false,
  error: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter(n => !n.read).length
      state.lastFetch = Date.now()
      state.isLoading = false
      state.error = null
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
      if (!action.payload.read) {
        state.unreadCount += 1
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
      state.unreadCount = 0
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload)
      if (index !== -1) {
        const notification = state.notifications[index]
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.notifications.splice(index, 1)
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
    updatePreferences: (state, action: PayloadAction<Partial<NotificationPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  updatePreferences,
  setConnectionStatus,
} = notificationsSlice.actions

export default notificationsSlice.reducer