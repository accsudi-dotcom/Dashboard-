/**
 * Global constants for Sharoobi Console
 */

// System Roles
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SUPPORT_AGENT: 'support_agent',
  OPS: 'ops',
  FINANCE: 'finance',
  MODERATION: 'moderation',
  SECURITY: 'security',
  PROVIDER_ADMIN: 'provider_admin',
  PROVIDER_STAFF: 'provider_staff',
} as const

// Entity Types
export const ENTITY_TYPES = {
  USER: 'user',
  PROVIDER: 'provider',
  ORDER: 'order',
  PAYMENT: 'payment',
  SUPPORT_TICKET: 'support_ticket',
  SECURITY_EVENT: 'security_event',
  DEVICE: 'device',
  SESSION: 'session',
  AUDIT_LOG: 'audit_log',
} as const

// Order Statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
} as const

// Payment Statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  IN_ESCROW: 'in_escrow',
} as const

// User Statuses
export const USER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
} as const

// Provider Statuses
export const PROVIDER_STATUSES = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
  ACTIVE: 'active',
} as const

// Ticket Statuses
export const TICKET_STATUSES = {
  OPEN: 'open',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REOPENED: 'reopened',
} as const

// Priority Levels
export const PRIORITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const

// Permissions
export const PERMISSIONS = {
  // User permissions
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_BLOCK: 'user:block',

  // Provider permissions
  PROVIDER_VIEW: 'provider:view',
  PROVIDER_CREATE: 'provider:create',
  PROVIDER_UPDATE: 'provider:update',
  PROVIDER_VERIFY: 'provider:verify',

  // Order permissions
  ORDER_VIEW: 'order:view',
  ORDER_UPDATE: 'order:update',
  ORDER_CANCEL: 'order:cancel',

  // Payment permissions
  PAYMENT_VIEW: 'payment:view',
  PAYMENT_REFUND: 'payment:refund',
  PAYMENT_APPROVE: 'payment:approve',

  // Support permissions
  SUPPORT_VIEW: 'support:view',
  SUPPORT_UPDATE: 'support:update',
  SUPPORT_ASSIGN: 'support:assign',

  // Audit permissions
  AUDIT_VIEW: 'audit:view',
  AUDIT_EXPORT: 'audit:export',

  // Configuration permissions
  CONFIG_VIEW: 'config:view',
  CONFIG_UPDATE: 'config:update',
  CONFIG_PUBLISH: 'config:publish',
} as const

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 500,
  SIZES: [10, 25, 50, 100],
} as const

// Theme
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

// Date Format
export const DATE_FORMAT = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
} as const

// Currency
export const CURRENCY = {
  DEFAULT: 'SAR',
  SYMBOL: 'ر.س',
} as const

// Feature Flags
export const FEATURE_FLAGS = {
  DARK_MODE: 'dark_mode',
  NEW_CHECKOUT: 'new_checkout',
  AI_RECOMMENDATIONS: 'ai_recommendations',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  MULTI_CURRENCY: 'multi_currency',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You do not have permission to perform this action',
  SESSION_EXPIRED: 'Your session has expired. Please login again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  INVALID_INPUT: 'Invalid input. Please check your data',
  REQUIRED_FIELD: 'This field is required',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  ACTION_COMPLETED: 'Action completed successfully',
  CREATED: 'Item created successfully',
  UPDATED: 'Item updated successfully',
  DELETED: 'Item deleted successfully',
  APPROVED: 'Item approved successfully',
} as const

// SLA Configuration
export const SLA_CONFIG = {
  CRITICAL: 1, // 1 hour
  HIGH: 4, // 4 hours
  MEDIUM: 24, // 24 hours
  LOW: 72, // 72 hours
} as const
