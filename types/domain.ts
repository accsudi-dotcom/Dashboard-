/**
 * Sharoobi Console - Domain Types
 * Core business entity types used throughout the application
 */

/* ============================================
   IDENTITY & ACCESS MANAGEMENT (IAM)
   ============================================ */

export type AdminRole = string

export type Permission = string

export type Resource = string

export interface AdminUser {
  id: string
  email: string
  displayName?: string
  name?: string
  tenantId?: string
  role: AdminRole
  permissions: PermissionRule[]
  mfaEnabled: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface PermissionRule {
  resource: Resource
  actions: Permission[]
  conditions?: {
    tenant?: string
    region?: string
    branch?: string
    amountThreshold?: number
    maxAmount?: number
    [key: string]: any
  }
  reasonRequired?: boolean
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: PermissionRule[]
  createdAt: Date
  updatedAt: Date
}

/* ============================================
   CUSTOMERS & USERS
   ============================================ */

export type UserStatus = 'active' | 'blocked' | 'suspended' | 'verified' | 'unverified'

export interface User {
  id: string
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  avatar?: string
  status: UserStatus
  riskScore: number
  isVerified: boolean
  createdAt: Date
  lastLogin?: Date
  updatedAt: Date
}

export interface UserDevice {
  id: string
  userId: string
  deviceName: string
  deviceType: 'mobile' | 'web' | 'tablet'
  os: string
  browser: string
  ipAddress: string
  trustScore: number
  lastUsed: Date
  createdAt: Date
}

export interface UserSession {
  id: string
  userId: string
  deviceId: string
  ipAddress: string
  location?: string
  expiresAt: Date
  createdAt: Date
}

/* ============================================
   PROVIDERS
   ============================================ */

export type ProviderType = 'digital' | 'physical'
export type ProviderStatus = 'pending' | 'verified' | 'suspended' | 'rejected'

export interface Provider {
  id: string
  name: string
  type: ProviderType
  status: ProviderStatus
  email: string
  phone: string
  businessName: string
  description?: string
  avatar?: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  branches?: Branch[]
  staff?: ProviderStaff[]
  createdAt: Date
  updatedAt: Date
}

export interface Branch {
  id: string
  providerId: string
  name: string
  address: string
  city: string
  region: string
  coordinates?: { lat: number; lng: number }
  isActive: boolean
  createdAt: Date
}

export interface ProviderStaff {
  id: string
  providerId: string
  email: string
  name: string
  role: 'admin' | 'staff'
  permissions: PermissionRule[]
  isActive: boolean
  createdAt: Date
}

/* ============================================
   ORDERS & OPERATIONS
   ============================================ */

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'executing'
  | 'ready'
  | 'delivered'
  | 'cancelled'
  | 'disputed'
  | 'resolved'

export interface Order {
  id: string
  userId: string
  providerId: string
  items: OrderItem[]
  status: OrderStatus
  totalAmount: number
  currency: string
  assignedTo?: string
  slaExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  notes?: string
}

/* ============================================
   PAYMENTS & ESCROW
   ============================================ */

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'disputed'

export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  currency: string
  status: PaymentStatus
  method: 'card' | 'wallet' | 'bank_transfer'
  transactionId?: string
  refundedAmount?: number
  createdAt: Date
  updatedAt: Date
}

export interface Escrow {
  id: string
  paymentId: string
  orderId: string
  amount: number
  status: 'held' | 'released' | 'refunded' | 'disputed'
  releasedAt?: Date
  refundedAt?: Date
  createdAt: Date
}

export interface Wallet {
  id: string
  userId: string
  balanceInCents: number
  pointsBalance: number
  currency: string
  updatedAt: Date
}

export interface WalletTransaction {
  id: string
  walletId: string
  type: 'credit' | 'debit'
  amount: number
  reason: string
  relatedEntity?: string
  createdAt: Date
}

/* ============================================
   SUPPORT & TICKETS
   ============================================ */

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Ticket {
  id: string
  userId: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assignedTo?: string
  category: string
  slaExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TicketMessage {
  id: string
  ticketId: string
  senderId: string
  senderType: 'user' | 'agent'
  message: string
  attachments?: string[]
  createdAt: Date
}

export interface PairingSession {
  id: string
  userId: string
  agentId: string
  qrCode: string
  deviceId?: string
  status: 'pending' | 'active' | 'completed' | 'expired'
  expiresAt: Date
  createdAt: Date
}

/* ============================================
   SECURITY & EVENTS
   ============================================ */

export type SecurityEventType =
  | 'failed_login'
  | 'failed_otp'
  | 'device_anomaly'
  | 'suspicious_activity'
  | 'pairing_abuse'
  | 'session_hijack'
  | 'policy_violation'

export interface SecurityEvent {
  id: string
  eventType: SecurityEventType
  severity: 'info' | 'warning' | 'critical'
  userId?: string
  deviceId?: string
  ipAddress: string
  description: string
  metadata?: Record<string, unknown>
  resolvedAt?: Date
  resolvedBy?: string
  createdAt: Date
}

/* ============================================
   AUDIT & GOVERNANCE
   ============================================ */

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  resource: Resource
  resourceId: string
  status: 'success' | 'failure'
  reason?: string
  changes?: {
    before: Record<string, unknown>
    after: Record<string, unknown>
  }
  correlationId?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

/* ============================================
   CONFIGURATION & STUDIOS
   ============================================ */

export type FeatureFlagStatus = 'draft' | 'active' | 'archived'

export interface FeatureFlag {
  id: string
  key: string
  name: string
  description?: string
  status: FeatureFlagStatus
  enabled: boolean
  rolloutPercentage: number
  targetAudience?: string[]
  variants?: FeatureFlagVariant[]
  createdAt: Date
  updatedAt: Date
}

export interface FeatureFlagVariant {
  id: string
  key: string
  value: unknown
  percentage: number
}

export interface LayoutBlock {
  id: string
  type: 'section' | 'card' | 'banner' | 'announcement'
  title?: string
  content: unknown
  order: number
  visible: boolean
  targets?: {
    roles?: AdminRole[]
    regions?: string[]
  }
}

export interface AppConfig {
  id: string
  version: number
  status: 'draft' | 'published'
  flags: FeatureFlag[]
  layout: LayoutBlock[]
  publishedAt?: Date
  publishedBy?: string
  createdAt: Date
  updatedAt: Date
}

/* ============================================
   GENERIC/UTILITY TYPES
   ============================================ */

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  pages: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  errors?: ApiError[]
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export interface ListResponse<T> {
  items: T[]
  meta: PaginationMeta
}
