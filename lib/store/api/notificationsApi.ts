import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import type { Notification, NotificationPreferences } from '../slices/notificationsSlice'

interface NotificationsResponse {
  success: boolean
  data: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    unreadCount: number
  }
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/notifications',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Notification', 'NotificationPreferences'],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, {
      page?: number
      limit?: number
      unreadOnly?: boolean
      types?: string[]
    }>({
      query: ({ page = 1, limit = 20, unreadOnly = false, types }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          unreadOnly: unreadOnly.toString(),
        })
        
        if (types?.length) {
          params.append('types', types.join(','))
        }
        
        return `?${params.toString()}`
      },
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<{ success: boolean }, string>({
      query: (notificationId) => ({
        url: `/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (notificationId) => ({
        url: `/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    clearAllNotifications: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/clear-all',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    getNotificationPreferences: builder.query<{
      success: boolean
      data: NotificationPreferences
    }, void>({
      query: () => '/preferences',
      providesTags: ['NotificationPreferences'],
    }),
    updateNotificationPreferences: builder.mutation<{
      success: boolean
      data: NotificationPreferences
    }, Partial<NotificationPreferences>>({
      query: (preferences) => ({
        url: '/preferences',
        method: 'PATCH',
        body: preferences,
      }),
      invalidatesTags: ['NotificationPreferences'],
    }),
    sendNotification: builder.mutation<{ success: boolean }, {
      userId?: string
      type: Notification['type']
      title: string
      message: string
      actionUrl?: string
      priority?: Notification['priority']
      data?: Record<string, unknown>
    }>({
      query: (notificationData) => ({
        url: '/send',
        method: 'POST',
        body: notificationData,
      }),
      invalidatesTags: ['Notification'],
    }),
    getNotificationStats: builder.query<{
      success: boolean
      data: {
        total: number
        unread: number
        byType: Record<string, number>
        byPriority: Record<string, number>
        recentActivity: Array<{
          date: string
          count: number
        }>
      }
    }, void>({
      query: () => '/stats',
    }),
    subscribeToNotifications: builder.mutation<{ success: boolean }, {
      endpoint: string
      keys: {
        p256dh: string
        auth: string
      }
    }>({
      query: (subscription) => ({
        url: '/subscribe',
        method: 'POST',
        body: subscription,
      }),
    }),
    unsubscribeFromNotifications: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/unsubscribe',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useSendNotificationMutation,
  useGetNotificationStatsQuery,
  useSubscribeToNotificationsMutation,
  useUnsubscribeFromNotificationsMutation,
} = notificationsApi