/**
 * Sharoobi Console - Zod Schemas
 * Runtime validation schemas for all API requests/responses
 */

import { z } from 'zod'

/* ============================================
   AUTH SCHEMAS
   ============================================ */

export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const LoginResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  role: z.enum(['super_admin', 'admin', 'support_agent', 'ops', 'finance', 'moderation', 'security']),
  token: z.string(),
  expiresIn: z.number(),
})

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  email: z.string(),
  displayName: z.string(),
  role: z.string(),
  permissions: z.array(z.object({
    resource: z.string(),
    actions: z.array(z.string()),
  })),
  expiresAt: z.string().datetime(),
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type Session = z.infer<typeof SessionSchema>

/* ============================================
   USER SCHEMAS
   ============================================ */

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().optional(),
  status: z.enum(['active', 'blocked', 'suspended', 'verified', 'unverified']),
  riskScore: z.number().min(0).max(100),
  isVerified: z.boolean(),
  createdAt: z.string().datetime(),
  lastLogin: z.string().datetime().optional(),
  updatedAt: z.string().datetime(),
})

export const UserDeviceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  deviceName: z.string(),
  deviceType: z.enum(['mobile', 'web', 'tablet']),
  os: z.string(),
  browser: z.string(),
  ipAddress: z.string().ip(),
  trustScore: z.number().min(0).max(100),
  lastUsed: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export const UserListResponseSchema = z.object({
  items: z.array(UserSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
})

export type User = z.infer<typeof UserSchema>
export type UserDevice = z.infer<typeof UserDeviceSchema>

/* ============================================
   PROVIDER SCHEMAS
   ============================================ */

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['digital', 'physical']),
  status: z.enum(['pending', 'verified', 'suspended', 'rejected']),
  email: z.string().email(),
  phone: z.string(),
  businessName: z.string(),
  description: z.string().optional(),
  avatar: z.string().optional(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ProviderListResponseSchema = z.object({
  items: z.array(ProviderSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
})

export type Provider = z.infer<typeof ProviderSchema>

/* ============================================
   ORDER SCHEMAS
   ============================================ */

export const OrderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  notes: z.string().optional(),
})

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  providerId: z.string(),
  items: z.array(OrderItemSchema),
  status: z.enum(['pending', 'accepted', 'executing', 'ready', 'delivered', 'cancelled', 'disputed', 'resolved']),
  totalAmount: z.number().nonnegative(),
  currency: z.string(),
  assignedTo: z.string().optional(),
  slaExpiresAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const OrderListResponseSchema = z.object({
  items: z.array(OrderSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
})

export type Order = z.infer<typeof OrderSchema>

/* ============================================
   PAYMENT SCHEMAS
   ============================================ */

export const PaymentSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  userId: z.string(),
  amount: z.number().nonnegative(),
  currency: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'refunded', 'disputed']),
  method: z.enum(['card', 'wallet', 'bank_transfer']),
  transactionId: z.string().optional(),
  refundedAmount: z.number().nonnegative().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const PaymentListResponseSchema = z.object({
  items: z.array(PaymentSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
})

export type Payment = z.infer<typeof PaymentSchema>

/* ============================================
   TICKET SCHEMAS
   ============================================ */

export const TicketSchema = z.object({
  id: z.string(),
  userId: z.string(),
  subject: z.string(),
  description: z.string(),
  status: z.enum(['open', 'in_progress', 'waiting', 'resolved', 'closed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignedTo: z.string().optional(),
  category: z.string(),
  slaExpiresAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const TicketListResponseSchema = z.object({
  items: z.array(TicketSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
})

export type Ticket = z.infer<typeof TicketSchema>

/* ============================================
   AUDIT LOG SCHEMAS
   ============================================ */

export const AuditLogSchema = z.object({
  id: z.string(),
  actor: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string(),
  status: z.enum(['success', 'failure']),
  reason: z.string().optional(),
  changes: z.object({
    before: z.record(z.unknown()),
    after: z.record(z.unknown()),
  }).optional(),
  correlationId: z.string(),
  ipAddress: z.string().ip(),
  userAgent: z.string(),
  createdAt: z.string().datetime(),
})

export const AuditLogListResponseSchema = z.object({
  items: z.array(AuditLogSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
})

export type AuditLog = z.infer<typeof AuditLogSchema>

/* ============================================
   METRICS SCHEMAS
   ============================================ */

export const MetricSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  unit: z.string().optional(),
  timestamp: z.string().datetime(),
})

export const KPISchema = z.object({
  gmv: z.number(),
  activeUsers: z.number(),
  pendingRefunds: z.number(),
  highRiskEvents: z.number(),
  ordersInProgress: z.number(),
  ticketsOpen: z.number(),
  paymentSuccessRate: z.number(),
  systemUptime: z.number(),
})

export type KPI = z.infer<typeof KPISchema>

/* ============================================
   COMMON SCHEMAS
   ============================================ */

export const PaginationSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().max(200).default(50),
})

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>
