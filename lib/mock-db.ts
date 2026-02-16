import { v4 as uuidv4 } from 'uuid'
import type {
  User,
  Provider,
  Order,
  Ticket,
  Payment,
  WalletLedger,
  AuditLog,
  SecurityEvent,
  UserSession,
  Device,
  FeatureFlag,
  Role,
  Message,
} from '@/types'

// In-memory store
interface MockDatabase {
  users: User[]
  providers: Provider[]
  orders: Order[]
  tickets: Ticket[]
  payments: Payment[]
  walletLedger: WalletLedger[]
  auditLogs: AuditLog[]
  // in-memory audit records for new audit engine
  auditRecords?: any[]
  securityEvents: SecurityEvent[]
  sessions: UserSession[]
  devices: Device[]
  featureFlags: FeatureFlag[]
  roles: Role[]
}

export const mockDb: MockDatabase = {
  users: [],
  providers: [],
  orders: [],
  tickets: [],
  payments: [],
  auditRecords: [],
  walletLedger: [],
  auditLogs: [],
  securityEvents: [],
  sessions: [],
  devices: [],
  featureFlags: [],
  roles: [],
}

export function seedDatabase() {
  if (mockDb.users.length > 0) return // Already seeded

  // Seed Users
  mockDb.users = [
    {
      id: 'user-1',
      name: 'Ahmed Hassan',
      email: 'ahmed@sharoobi.local',
      phone: '+966501234567',
      status: 'active',
      tier: 'premium',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      notes: ['VIP customer', 'High value'],
    },
    {
      id: 'user-2',
      name: 'Fatima Ali',
      email: 'fatima@sharoobi.local',
      phone: '+201001234567',
      status: 'active',
      tier: 'basic',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      notes: [],
    },
    {
      id: 'user-3',
      name: 'Mohammed Saeed',
      email: 'mohammed@sharoobi.local',
      status: 'blocked',
      tier: 'basic',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: ['Blocked due to fraud'],
    },
  ]

  // Seed Providers
  mockDb.providers = [
    {
      id: 'provider-1',
      name: 'Best Electronics',
      email: 'contact@bestelectronics.local',
      region: 'Saudi Arabia',
      status: 'active',
      verificationStatus: 'verified',
      commissionRate: 5,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      documents: {
        commercialRegistration: true,
        taxCertificate: true,
        bankAccount: true,
      },
    },
    {
      id: 'provider-2',
      name: 'Fashion Hub',
      email: 'info@fashionhub.local',
      region: 'Egypt',
      status: 'pending',
      verificationStatus: 'pending',
      commissionRate: 8,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      documents: {
        commercialRegistration: true,
        taxCertificate: false,
        bankAccount: true,
      },
    },
    {
      id: 'provider-3',
      name: 'Home & Living',
      email: 'support@homeandliving.local',
      region: 'UAE',
      status: 'active',
      verificationStatus: 'verified',
      commissionRate: 6,
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      documents: {
        commercialRegistration: true,
        taxCertificate: true,
        bankAccount: true,
      },
    },
  ]

  // Seed Orders
  mockDb.orders = [
    {
      id: 'order-1',
      userId: 'user-1',
      providerId: 'provider-1',
      status: 'delivered',
      totalAmount: 599.99,
      currency: 'SAR',
      items: [
        { id: '1', name: 'iPhone 15', quantity: 1, price: 599.99 },
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'Riyadh',
        state: 'Riyadh',
        zipCode: '11111',
        country: 'Saudi Arabia',
      },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order-2',
      userId: 'user-2',
      providerId: 'provider-2',
      status: 'in_transit',
      totalAmount: 249.99,
      currency: 'EGP',
      items: [
        { id: '1', name: 'Designer Dress', quantity: 1, price: 249.99 },
      ],
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Cairo',
        state: 'Cairo',
        zipCode: '11511',
        country: 'Egypt',
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'order-3',
      userId: 'user-1',
      providerId: 'provider-3',
      status: 'pending',
      totalAmount: 1899.99,
      currency: 'AED',
      items: [
        { id: '1', name: 'Sofa Set', quantity: 1, price: 1899.99 },
      ],
      shippingAddress: {
        street: '789 Palm St',
        city: 'Dubai',
        state: 'Dubai',
        zipCode: '12345',
        country: 'UAE',
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Seed Tickets
  const messages: Message[] = [
    {
      id: uuidv4(),
      authorId: 'user-1',
      content: 'Item not as described in the listing',
      attachments: [],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ]

  mockDb.tickets = [
    {
      id: 'ticket-1',
      userId: 'user-1',
      subject: 'Product Quality Issue',
      description: 'Received item is damaged',
      status: 'in_progress',
      priority: 'high',
      category: 'Product Quality',
      assignedToId: 'staff-1',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      messages,
    },
    {
      id: 'ticket-2',
      userId: 'user-2',
      subject: 'Delivery Delay',
      description: 'Order not arrived on time',
      status: 'open',
      priority: 'medium',
      category: 'Delivery',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      messages: [],
    },
  ]

  // Seed Payments
  mockDb.payments = [
    {
      id: 'payment-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 599.99,
      currency: 'SAR',
      method: 'card',
      status: 'completed',
      transactionId: 'txn-abc123',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'payment-2',
      orderId: 'order-2',
      userId: 'user-2',
      amount: 249.99,
      currency: 'EGP',
      method: 'wallet',
      status: 'pending',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Seed Wallet Ledger
  mockDb.walletLedger = [
    {
      id: uuidv4(),
      userId: 'user-1',
      type: 'credit',
      amount: 100,
      currency: 'SAR',
      reason: 'Cashback reward',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      balance: 500,
    },
    {
      id: uuidv4(),
      userId: 'user-2',
      type: 'debit',
      amount: 249.99,
      currency: 'EGP',
      reason: 'Payment for order',
      relatedEntityId: 'order-2',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      balance: 250.01,
    },
  ]

  // Seed Feature Flags
  mockDb.featureFlags = [
    {
      id: 'flag-1',
      key: 'new_checkout',
      name: 'New Checkout Experience',
      description: 'Enable new streamlined checkout flow',
      enabled: true,
      rolloutPercentage: 100,
      version: 2,
      status: 'published',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      publishedBy: 'admin@sharoobi.local',
    },
    {
      id: 'flag-2',
      key: 'express_shipping',
      name: 'Express Shipping',
      description: 'Enable express shipping option',
      enabled: false,
      rolloutPercentage: 0,
      draftVersion: 3,
      version: 2,
      status: 'draft',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Seed Roles
  mockDb.roles = [
    {
      id: 'role-admin',
      name: 'Admin',
      description: 'Full platform access',
      permissions: ['*'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'role-support',
      name: 'Support',
      description: 'Support team',
      permissions: ['view:tickets', 'update:tickets', 'view:users'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  // Seed Audit Logs
  mockDb.auditLogs = [
    {
      id: uuidv4(),
      actorId: 'admin@sharoobi.local',
      action: 'publish_feature_flag',
      entityType: 'FeatureFlag',
      entityId: 'flag-1',
      description: 'Published new checkout feature flag',
      reason: 'Ready for production',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Seed Security Events
  mockDb.securityEvents = [
    {
      id: uuidv4(),
      type: 'login',
      severity: 'info',
      userId: 'user-1',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome on macOS',
      details: { location: 'Riyadh, SA' },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Seed Sessions
  mockDb.sessions = [
    {
      id: uuidv4(),
      userId: 'user-1',
      deviceId: 'device-1',
      deviceName: 'MacBook Pro',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome on macOS',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      lastActivityAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Seed Devices
  mockDb.devices = [
    {
      id: 'device-1',
      userId: 'user-1',
      fingerprint: 'abc123def456',
      name: 'MacBook Pro',
      osType: 'macos',
      deviceType: 'desktop',
      trustScore: 95,
      lastSeenAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      blocked: false,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

// Helper functions for DB operations
export function getUser(id: string): User | undefined {
  return mockDb.users.find((u) => u.id === id)
}

export function updateUser(id: string, data: Partial<User>): User {
  const user = mockDb.users.find((u) => u.id === id)
  if (!user) throw new Error('User not found')
  Object.assign(user, data, { updatedAt: new Date().toISOString() })
  return user
}

export function getOrder(id: string): Order | undefined {
  return mockDb.orders.find((o) => o.id === id)
}

export function updateOrder(id: string, data: Partial<Order>): Order {
  const order = mockDb.orders.find((o) => o.id === id)
  if (!order) throw new Error('Order not found')
  Object.assign(order, data, { updatedAt: new Date().toISOString() })
  return order
}

export function addAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
  const newLog: AuditLog = {
    ...log,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }
  mockDb.auditLogs.push(newLog)
  return newLog
}

export function addSecurityEvent(
  event: Omit<SecurityEvent, 'id' | 'createdAt'>
): SecurityEvent {
  const newEvent: SecurityEvent = {
    ...event,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  }
  mockDb.securityEvents.push(newEvent)
  return newEvent
}
