/**
 * Mock data for development and demo purposes
 * This will be replaced with real API calls in production
 */

export const mockUsers = [
  {
    id: '1',
    email: 'ahmed@example.com',
    name: 'Ahmed Hassan',
    role: 'customer',
    status: 'active',
    tier: 'premium',
    joinedAt: '2024-01-15',
    lastLogin: '2024-02-13T14:30:00Z',
  },
  {
    id: '2',
    email: 'fatima@example.com',
    name: 'Fatima Ali',
    role: 'customer',
    status: 'active',
    tier: 'standard',
    joinedAt: '2023-08-20',
    lastLogin: '2024-02-13T12:15:00Z',
  },
]

export const mockProviders = [
  {
    id: 'PRV-001',
    name: 'Digital Services Clinic',
    type: 'digital',
    status: 'verified',
    rating: 4.8,
    reviews: 342,
    staff: 5,
    joinedAt: '2023-12-01',
  },
  {
    id: 'PRV-002',
    name: 'Ahmed\'s Electronics',
    type: 'physical',
    status: 'verified',
    rating: 4.5,
    reviews: 128,
    staff: 3,
    branches: 2,
    joinedAt: '2024-01-10',
  },
]

export const mockOrders = [
  {
    id: 'ORD-12451',
    userId: '1',
    providerId: 'PRV-001',
    amount: 450.00,
    status: 'completed',
    createdAt: '2024-02-13T10:00:00Z',
    completedAt: '2024-02-13T14:30:00Z',
  },
  {
    id: 'ORD-12450',
    userId: '2',
    providerId: 'PRV-002',
    amount: 1200.00,
    status: 'processing',
    createdAt: '2024-02-13T09:00:00Z',
  },
]

export const mockPayments = [
  {
    id: 'PAY-56741',
    orderId: 'ORD-12451',
    amount: 450.00,
    method: 'credit_card',
    status: 'completed',
    createdAt: '2024-02-13T10:00:00Z',
  },
  {
    id: 'PAY-56740',
    orderId: 'ORD-12450',
    amount: 1200.00,
    method: 'apple_pay',
    status: 'in_escrow',
    createdAt: '2024-02-13T09:00:00Z',
  },
]

export const mockTickets = [
  {
    id: 'TKT-001',
    userId: '1',
    subject: 'Payment Failed',
    description: 'Unable to complete payment during checkout',
    status: 'open',
    priority: 'high',
    createdAt: '2024-02-13T14:00:00Z',
    assignedTo: 'Ahmed Support',
  },
  {
    id: 'TKT-002',
    userId: '2',
    subject: 'Refund Request',
    description: 'Want to refund my order',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-02-13T12:00:00Z',
    assignedTo: 'Fatima Support',
  },
]

export const mockAuditLog = [
  {
    id: 'AUD-001',
    actor: 'admin@sharoobi.local',
    action: 'user_blocked',
    targetId: '1',
    targetType: 'user',
    reason: 'Suspicious activity detected',
    createdAt: '2024-02-13T14:00:00Z',
  },
  {
    id: 'AUD-002',
    actor: 'admin@sharoobi.local',
    action: 'refund_approved',
    targetId: 'PAY-56739',
    targetType: 'payment',
    reason: 'Customer service recovery',
    createdAt: '2024-02-13T13:00:00Z',
  },
]

export const mockSecurityEvents = [
  {
    id: 'SEC-001',
    type: 'failed_otp',
    userId: '1',
    ip: '192.168.1.100',
    userAgent: 'Chrome on Windows',
    location: 'Cairo, Egypt',
    createdAt: '2024-02-13T14:00:00Z',
  },
  {
    id: 'SEC-002',
    type: 'device_pairing',
    userId: '2',
    ip: '203.0.113.45',
    userAgent: 'Safari on iPhone',
    location: 'Alexandria, Egypt',
    createdAt: '2024-02-13T13:00:00Z',
  },
]

export const mockSessions = [
  {
    id: 'SES-001',
    userId: '1',
    ip: '192.168.1.100',
    userAgent: 'Chrome on Windows',
    lastActive: '2024-02-13T14:30:00Z',
    createdAt: '2024-02-13T10:00:00Z',
  },
]

export const mockDevices = [
  {
    id: 'DEV-001',
    userId: '1',
    fingerprint: 'a7e2c5f8b3d1e4g9h2j5k8l1m4n7o0p3q',
    name: 'iPhone 14 Pro',
    trustScore: 95,
    lastSeen: '2024-02-13T14:30:00Z',
  },
]

export const mockMetricsData = [
  { date: 'Feb 01', value: 4000, target: 4500 },
  { date: 'Feb 02', value: 3000, target: 4500 },
  { date: 'Feb 03', value: 2000, target: 4500 },
  { date: 'Feb 04', value: 2780, target: 4500 },
  { date: 'Feb 05', value: 1890, target: 4500 },
  { date: 'Feb 06', value: 2390, target: 4500 },
  { date: 'Feb 07', value: 3490, target: 4500 },
  { date: 'Feb 08', value: 4000, target: 4500 },
  { date: 'Feb 09', value: 5000, target: 4500 },
  { date: 'Feb 10', value: 4100, target: 4500 },
  { date: 'Feb 11', value: 4500, target: 4500 },
  { date: 'Feb 12', value: 5200, target: 4500 },
  { date: 'Feb 13', value: 5400, target: 4500 },
]

/**
 * Mock authentication response
 */
export const mockAuthResponse = {
  user: {
    id: 'admin',
    email: 'admin@sharoobi.local',
    name: 'Admin User',
    role: 'super_admin',
    permissions: [
      {
        resource: '*',
        actions: ['*'],
      },
    ],
  },
  token: 'mock-jwt-token',
  expiresIn: 86400,
}

/**
 * Helper to simulate API delays
 */
export function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Get mock data by type and filters
 */
export async function getMockData(type: string, filters?: Record<string, any>) {
  await delay()

  switch (type) {
    case 'users':
      return { data: mockUsers, total: mockUsers.length }
    case 'providers':
      return { data: mockProviders, total: mockProviders.length }
    case 'orders':
      return { data: mockOrders, total: mockOrders.length }
    case 'payments':
      return { data: mockPayments, total: mockPayments.length }
    case 'tickets':
      return { data: mockTickets, total: mockTickets.length }
    case 'audit':
      return { data: mockAuditLog, total: mockAuditLog.length }
    case 'security':
      return { data: mockSecurityEvents, total: mockSecurityEvents.length }
    case 'sessions':
      return { data: mockSessions, total: mockSessions.length }
    case 'devices':
      return { data: mockDevices, total: mockDevices.length }
    case 'metrics':
      return mockMetricsData
    default:
      return null
  }
}
