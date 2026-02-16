// Auth
export interface Session {
  id: string
  userId: string
  email: string
  role: 'admin' | 'support' | 'ops' | 'finance' | 'moderator' | 'security'
  permissions: string[]
  createdAt: string
  expiresAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  session: Session
  token: string
}

// API Response Envelope
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    pagination?: {
      total: number
      page: number
      limit: number
      pages: number
    }
    requestId: string
    timestamp: string
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  dir?: 'asc' | 'desc'
  filters?: Record<string, any>
}

// Users
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'blocked'
  tier: 'basic' | 'premium' | 'enterprise'
  createdAt: string
  lastLoginAt?: string
  notes: string[]
}

// Providers
export interface Provider {
  id: string
  name: string
  email: string
  region: string
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  verificationStatus: 'pending' | 'verified' | 'rejected'
  commissionRate: number
  createdAt: string
  documents: {
    commercialRegistration: boolean
    taxCertificate: boolean
    bankAccount: boolean
  }
}

// Orders
export interface Order {
  id: string
  userId: string
  providerId: string
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'refunded'
  totalAmount: number
  currency: 'SAR' | 'EGP' | 'AED'
  items: OrderItem[]
  shippingAddress: Address
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// Tickets
export interface Ticket {
  id: string
  userId: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  assignedToId?: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

export interface Message {
  id: string
  authorId: string
  content: string
  attachments: string[]
  createdAt: string
}

// Payments
export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  currency: string
  method: 'card' | 'wallet' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  createdAt: string
  refundedAt?: string
  refundReason?: string
}

// Wallet
export interface WalletLedger {
  id: string
  userId: string
  providerId?: string
  type: 'credit' | 'debit'
  amount: number
  currency: string
  reason: string
  relatedEntityId?: string
  createdAt: string
  balance: number
}

// Audit Log
export interface AuditLog {
  id: string
  actorId: string
  action: string
  entityType: string
  entityId: string
  description: string
  changes?: {
    before?: Record<string, any>
    after?: Record<string, any>
  }
  reason?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

// Security Events
export interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'data_access' | 'suspicious_activity'
  severity: 'info' | 'warning' | 'error' | 'critical'
  userId?: string
  ipAddress: string
  userAgent: string
  details: Record<string, any>
  createdAt: string
}

// Session
export interface UserSession {
  id: string
  userId: string
  deviceId: string
  deviceName: string
  ipAddress: string
  userAgent: string
  createdAt: string
  lastActivityAt: string
  expiresAt: string
}

// Device
export interface Device {
  id: string
  userId: string
  fingerprint: string
  name: string
  osType: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'other'
  deviceType: 'mobile' | 'tablet' | 'desktop'
  trustScore: number
  lastSeenAt: string
  blocked: boolean
  createdAt: string
}

// Feature Flags
export interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string
  enabled: boolean
  rolloutPercentage?: number
  targetingRules?: Record<string, any>
  version: number
  draftVersion?: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  publishedAt?: string
  publishedBy?: string
}

// Roles & Permissions
export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface Policy {
  id: string
  name: string
  description: string
  rules: PolicyRule[]
  createdAt: string
  updatedAt: string
}

export interface PolicyRule {
  condition: string
  operator: 'eq' | 'gt' | 'lt' | 'in' | 'contains'
  value: any
  action: 'allow' | 'deny' | 'require_approval'
}

// Layouts
export interface Layout {
  id: string
  name: string
  description: string
  sections: LayoutSection[]
  version: number
  draftVersion?: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  publishedAt?: string
}

export interface LayoutSection {
  id: string
  type: 'hero' | 'content' | 'features' | 'testimonials' | 'cta' | 'footer'
  config: Record<string, any>
  order: number
}

// Bulk Action
export interface BulkAction {
  action: string
  entityIds: string[]
  reason: string
  metadata?: Record<string, any>
}

// Workspace Data
export interface WorkspaceQueueItem {
  id: string
  entityType: 'order' | 'ticket' | 'payment' | 'user' | 'provider'
  entityId: string
  title: string
  status: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  createdAt: string
  updatedAt: string
}
