# Sharoobi Console API Integration Guide

## Overview

This document describes the API integration patterns and expected backend contracts for Sharoobi Console.

## Authentication Endpoints

### POST /auth/login

Authenticate user with credentials.

**Request:**
```json
{
  "email": "admin@sharoobi.local",
  "password": "Admin@sharoobi",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "user": {
    "id": "admin-001",
    "email": "admin@sharoobi.local",
    "name": "Admin User",
    "role": "super_admin",
    "permissions": [
      {
        "resource": "*",
        "actions": ["*"]
      }
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### GET /auth/me

Get current authenticated user.

**Response (200):**
```json
{
  "user": {
    "id": "admin-001",
    "email": "admin@sharoobi.local",
    "name": "Admin User",
    "role": "super_admin"
  }
}
```

### POST /auth/logout

Invalidate current session.

**Response (200):**
```json
{
  "success": true
}
```

## User Management Endpoints

### GET /users

List all users with pagination.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 50, max: 500)
- `status`: string (optional: active, blocked, suspended)
- `tier`: string (optional: standard, premium)
- `search`: string (optional: search by name or email)

**Response (200):**
```json
{
  "data": [
    {
      "id": "user-001",
      "email": "user@example.com",
      "name": "User Name",
      "status": "active",
      "tier": "premium",
      "joinedAt": "2024-01-15T10:00:00Z",
      "lastLoginAt": "2024-02-13T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1234,
    "pages": 25
  }
}
```

### GET /users/:id

Get user details.

**Response (200):**
```json
{
  "id": "user-001",
  "email": "user@example.com",
  "name": "User Name",
  "status": "active",
  "tier": "premium",
  "joinedAt": "2024-01-15T10:00:00Z",
  "lastLoginAt": "2024-02-13T14:30:00Z",
  "devices": [...],
  "sessions": [...],
  "auditLog": [...]
}
```

### PATCH /users/:id

Update user (requires reason for sensitive changes).

**Request:**
```json
{
  "name": "New Name",
  "status": "blocked",
  "reason": "Suspicious activity detected"
}
```

**Response (200):**
```json
{
  "user": {...},
  "auditEntry": {
    "id": "audit-001",
    "actor": "admin-001",
    "action": "user_updated",
    "changes": [...],
    "reason": "Suspicious activity detected",
    "timestamp": "2024-02-13T14:30:00Z"
  }
}
```

## Provider Endpoints

### GET /providers

List providers.

**Query Parameters:**
- `page`: number
- `limit`: number
- `type`: string (digital | physical)
- `status`: string (pending | verified | rejected)

**Response (200):**
```json
{
  "data": [
    {
      "id": "provider-001",
      "name": "Provider Name",
      "type": "digital",
      "status": "verified",
      "rating": 4.8,
      "reviews": 342,
      "staff": 5,
      "joinedAt": "2023-12-01T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

## Order Endpoints

### GET /orders

List orders.

**Query Parameters:**
- `page`: number
- `limit`: number
- `status`: string (pending | accepted | completed | cancelled)
- `userId`: string (optional)
- `providerId`: string (optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": "order-001",
      "userId": "user-001",
      "providerId": "provider-001",
      "amount": 450.00,
      "status": "completed",
      "createdAt": "2024-02-13T10:00:00Z",
      "completedAt": "2024-02-13T14:30:00Z"
    }
  ],
  "pagination": {...}
}
```

### PATCH /orders/:id/status

Update order status.

**Request:**
```json
{
  "status": "completed",
  "reason": "Service completed by provider"
}
```

## Payment Endpoints

### GET /payments

List payments.

**Query Parameters:**
- `page`: number
- `limit`: number
- `status`: string (pending | completed | refunded | failed)

**Response (200):**
```json
{
  "data": [
    {
      "id": "payment-001",
      "orderId": "order-001",
      "amount": 450.00,
      "method": "credit_card",
      "status": "completed",
      "createdAt": "2024-02-13T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### POST /payments/:id/refund

Process refund.

**Request:**
```json
{
  "amount": 450.00,
  "reason": "Customer requested refund",
  "approvalToken": "approval-token-123"
}
```

**Response (200):**
```json
{
  "refund": {
    "id": "refund-001",
    "paymentId": "payment-001",
    "amount": 450.00,
    "status": "processed",
    "processedAt": "2024-02-13T14:30:00Z"
  }
}
```

## Support Ticket Endpoints

### GET /support/tickets

List support tickets.

**Response (200):**
```json
{
  "data": [
    {
      "id": "ticket-001",
      "userId": "user-001",
      "subject": "Payment Failed",
      "description": "Unable to complete payment",
      "status": "open",
      "priority": "high",
      "createdAt": "2024-02-13T14:00:00Z",
      "assignedTo": "agent-001"
    }
  ],
  "pagination": {...}
}
```

## Audit Log Endpoints

### GET /audit-log

List audit entries.

**Query Parameters:**
- `page`: number
- `limit`: number
- `action`: string (optional)
- `actor`: string (optional)
- `startDate`: ISO string (optional)
- `endDate`: ISO string (optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": "audit-001",
      "actor": "admin-001",
      "action": "user_blocked",
      "targetId": "user-001",
      "targetType": "user",
      "changes": {
        "before": {"status": "active"},
        "after": {"status": "blocked"}
      },
      "reason": "Suspicious activity",
      "timestamp": "2024-02-13T14:00:00Z"
    }
  ],
  "pagination": {...}
}
```

## Security Events Endpoints

### GET /security/events

List security events.

**Response (200):**
```json
{
  "data": [
    {
      "id": "event-001",
      "type": "failed_otp",
      "userId": "user-001",
      "ip": "192.168.1.100",
      "userAgent": "Chrome on Windows",
      "location": "Cairo, Egypt",
      "timestamp": "2024-02-13T14:00:00Z"
    }
  ],
  "pagination": {...}
}
```

## Common Headers

All requests must include:

```
Authorization: Bearer {token}
Content-Type: application/json
X-Correlation-ID: {unique-id}  # For request tracking
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "INVALID_INPUT",
  "message": "Validation failed",
  "details": {
    "email": ["Invalid email format"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "FORBIDDEN",
  "message": "You do not have permission to perform this action"
}
```

### 500 Server Error
```json
{
  "error": "SERVER_ERROR",
  "message": "An unexpected error occurred",
  "requestId": "req-12345"
}
```

## Rate Limiting

All endpoints are rate-limited:
- Default: 100 requests per minute per user
- Auth endpoints: 10 requests per minute per IP
- Response headers include: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Pagination

All list endpoints support:
- `page`: Starting from 1
- `limit`: Maximum 500
- `offset`: For cursor-based pagination (optional)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1234,
    "pages": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Webhook Events

Backend should emit these events:

- `user.created`
- `user.updated`
- `user.blocked`
- `order.created`
- `order.status_changed`
- `payment.completed`
- `payment.failed`
- `refund.processed`
- `audit.entry_created`
- `security.event_detected`

## Implementation Notes

1. **Idempotency**: All mutation endpoints should support idempotency keys (`Idempotency-Key` header)
2. **Soft Deletes**: Resources are soft-deleted and can be restored
3. **Audit Trail**: Every mutation is logged with actor, timestamp, and reason
4. **Correlation IDs**: All requests tracked with unique correlation IDs
5. **Secrets**: Never expose API keys or tokens in responses
6. **CORS**: Dashboard origin should be whitelisted
7. **HTTPS**: All communication must be over HTTPS in production

## Testing

Use the mock data in `lib/mock-data.ts` for development and testing.

For integration testing, use the provided API client in `lib/api-client.ts`.
