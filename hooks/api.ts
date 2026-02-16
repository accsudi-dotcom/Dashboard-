'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  ApiResponse,
  User,
  Order,
  Ticket,
  Payment,
  AuditLog,
  SecurityEvent,
  Provider,
  FeatureFlag,
  WalletLedger,
  UserSession,
  Device,
  PaginationParams,
} from '@/types'

const API_BASE = '/api'

// Helper to fetch with proper error handling
async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'API error')
  }

  const data = await response.json()
  return data.data
}

// Auth
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
    },
  })
}

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: () => apiFetch('/api/auth/me'),
  })
}

// Users
export function useUsers(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.search) queryParams.append('search', params.filters.search)
  if (params.filters?.status) queryParams.append('status', params.filters.status)

  return useQuery({
    queryKey: ['users', params],
    queryFn: () =>
      apiFetch<ApiResponse<User[]>>(
        `/api/users?${queryParams}`
      ).then((res: any) => res),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      userId: string
      status?: string
      notes?: string[]
      reason?: string
    }) => {
      return apiFetch('/api/users', {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Orders
export function useOrders(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.status) queryParams.append('status', params.filters.status)
  if (params.filters?.userId) queryParams.append('userId', params.filters.userId)

  return useQuery({
    queryKey: ['orders', params],
    queryFn: () =>
      apiFetch<ApiResponse<Order[]>>(
        `/api/orders?${queryParams}`
      ).then((res: any) => res),
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      orderId: string
      status: string
      reason?: string
    }) => {
      return apiFetch('/api/orders', {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useBulkOrderAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      action: string
      entityIds: string[]
      reason: string
    }) => {
      return apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

// Tickets
export function useTickets(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.status) queryParams.append('status', params.filters.status)
  if (params.filters?.priority) queryParams.append('priority', params.filters.priority)

  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () =>
      apiFetch<ApiResponse<Ticket[]>>(
        `/api/tickets?${queryParams}`
      ).then((res: any) => res),
  })
}

export function useUpdateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      ticketId: string
      status?: string
      assignedToId?: string
      reason?: string
    }) => {
      return apiFetch('/api/tickets', {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

// Payments
export function usePayments(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.status) queryParams.append('status', params.filters.status)

  return useQuery({
    queryKey: ['payments', params],
    queryFn: () =>
      apiFetch<ApiResponse<Payment[]>>(
        `/api/payments?${queryParams}`
      ).then((res: any) => res),
  })
}

export function useRefundPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      paymentId: string
      action: string
      reason: string
    }) => {
      return apiFetch('/api/payments', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['audit'] })
    },
  })
}

// Audit Log
export function useAuditLog(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.action) queryParams.append('action', params.filters.action)
  if (params.filters?.entityType) queryParams.append('entityType', params.filters.entityType)
  if (params.filters?.entityId) queryParams.append('entityId', params.filters.entityId)

  return useQuery({
    queryKey: ['audit', params],
    queryFn: () =>
      apiFetch<ApiResponse<AuditLog[]>>(
        `/api/audit?${queryParams}`
      ).then((res: any) => res),
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

// Security Events
export function useSecurityEvents(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.type) queryParams.append('type', params.filters.type)
  if (params.filters?.severity) queryParams.append('severity', params.filters.severity)

  return useQuery({
    queryKey: ['security-events', params],
    queryFn: () =>
      apiFetch<ApiResponse<SecurityEvent[]>>(
        `/api/security-events?${queryParams}`
      ).then((res: any) => res),
    refetchInterval: 10000, // Refresh every 10 seconds for real-time feel
  })
}

// Providers
export function useProviders(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.status) queryParams.append('status', params.filters.status)

  return useQuery({
    queryKey: ['providers', params],
    queryFn: () =>
      apiFetch<ApiResponse<Provider[]>>(
        `/api/providers?${queryParams}`
      ).then((res: any) => res),
  })
}

export function useUpdateProvider() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      providerId: string
      verificationStatus?: string
      status?: string
      reason?: string
    }) => {
      return apiFetch('/api/providers', {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] })
    },
  })
}

// Feature Flags
export function useFeatureFlags() {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: () =>
      apiFetch<ApiResponse<FeatureFlag[]>>(
        `/api/app-config/flags`
      ).then((res: any) => res),
  })
}

export function useUpdateFeatureFlag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      action: string
      flagId: string
      enabled?: boolean
      rolloutPercentage?: number
      reason?: string
    }) => {
      return apiFetch('/api/app-config/flags', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] })
    },
  })
}

// Wallet
export function useWalletLedger(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.userId) queryParams.append('userId', params.filters.userId)

  return useQuery({
    queryKey: ['wallet-ledger', params],
    queryFn: () =>
      apiFetch<ApiResponse<WalletLedger[]>>(
        `/api/wallet/ledger?${queryParams}`
      ).then((res: any) => res),
  })
}

// Sessions
export function useSessions(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.userId) queryParams.append('userId', params.filters.userId)

  return useQuery({
    queryKey: ['sessions', params],
    queryFn: () =>
      apiFetch<ApiResponse<UserSession[]>>(
        `/api/sessions?${queryParams}`
      ).then((res: any) => res),
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      return apiFetch('/api/sessions', {
        method: 'DELETE',
        body: JSON.stringify({ sessionId }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

// Devices
export function useDevices(params: PaginationParams = {}) {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.filters?.userId) queryParams.append('userId', params.filters.userId)

  return useQuery({
    queryKey: ['devices', params],
    queryFn: () =>
      apiFetch<ApiResponse<Device[]>>(
        `/api/devices?${queryParams}`
      ).then((res: any) => res),
  })
}

export function useUpdateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      deviceId: string
      action: string
    }) => {
      return apiFetch('/api/devices', {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
  })
}
