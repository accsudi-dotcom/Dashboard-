# Sharoobi Console – Enterprise Edition
## Complete Architecture & Implementation Guide

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [Core Architecture](#core-architecture)
3. [Folder Structure](#folder-structure)
4. [Layer Descriptions](#layer-descriptions)
5. [Module Development Guide](#module-development-guide)
6. [Integration Patterns](#integration-patterns)
7. [Security & Compliance](#security--compliance)
8. [Deployment & Scaling](#deployment--scaling)

---

## OVERVIEW

**Sharoobi Console** is a production-grade, enterprise-level SaaS admin platform designed to serve:
- 1M+ concurrent users
- Multi-tenant organizations
- Complex RBAC + ABAC permissions
- Real-time workflows and automation
- Complete audit trails and compliance
- Financial transaction management
- Advanced security & threat detection

### Key Principles

- **Clean Architecture**: Strict separation of domain and infrastructure
- **Domain-Driven Design (DDD)**: Aggregates, Value Objects, Domain Events
- **Event-Driven**: Asynchronous event publishing and handling
- **Multi-Tenant**: Complete isolation at all layers
- **Secure-by-Default**: Authorization at every operation
- **Extensible**: New modules can be added independently
- **Testable**: No god-classes, every unit is isolated

---

## CORE ARCHITECTURE

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   API/UI Layer                          │
│         (Controllers, Routes, GraphQL, REST)            │
├─────────────────────────────────────────────────────────┤
│            Application Layer (Services)                 │
│       (Use Cases, DTOs, Validation, Mapping)            │
├─────────────────────────────────────────────────────────┤
│              Domain Layer (Core Logic)                  │
│  (Aggregates, Entities, Value Objects, Domain Events)  │
├─────────────────────────────────────────────────────────┤
│           Infrastructure Layer (Adapters)              │
│   (Repositories, Databases, External Services)         │
├─────────────────────────────────────────────────────────┤
│          Core Engines (Shared Infrastructure)          │
│ (Event Bus, Audit Trail, Feature Flags, Workflows...)  │
└─────────────────────────────────────────────────────────┘
```

### Core Engines (15 Systems)

1. **Domain Event System** - Event publishing and subscription
2. **Unit of Work** - Transaction management
3. **Tenant Context** - Multi-tenant isolation
4. **Permission Engine** - RBAC (Role-Based Access Control)
5. **Policy Engine** - ABAC (Attribute-Based Access Control)
6. **Feature Flag Engine** - Runtime feature toggles with targeting
7. **Audit Trail** - Immutable log of all actions
8. **Observability Service** - Logs, metrics, tracing
9. **Workflow Engine** - Step-based process automation
10. **Webhook Dispatcher** - Event-driven integrations
11. **Analytics Engine** - Real-time metrics and reporting
12. **In-Memory Store** - Abstracted data persistence
13. **Base Repository** - Generic data access layer
14. **JWT & Session** - Authentication management
15. **Security Guard** - Rate limiting, threat detection

---

## FOLDER STRUCTURE

```
sharoobi-console/
├── core/                           # Core engines & infrastructure
│   ├── domain/
│   │   ├── errors/
│   │   │   └── DomainError.ts     # Base error hierarchy
│   │   ├── events/
│   │   │   ├── DomainEvent.ts     # Base event class
│   │   │   └── EventBus.ts        # Event publishing system
│   │   ├── repositories/
│   │   │   └── Repository.ts      # Repository interface
│   │   ├── Aggregate.ts           # Aggregate base class
│   │   ├── Entity.ts              # Entity base class
│   │   └── ValueObject.ts         # Value object base class
│   │
│   ├── infrastructure/
│   │   ├── TenantContext.ts       # Multi-tenant isolation
│   │   ├── PermissionEngine.ts    # RBAC
│   │   ├── PolicyEngine.ts        # ABAC + hybrid RBAC/ABAC
│   │   ├── FeatureFlagEngine.ts   # Runtime feature toggles
│   │   ├── AuditTrail.ts          # Immutable audit log
│   │   ├── ObservabilityService.ts # Logs, metrics, tracing
│   │   ├── WorkflowEngine.ts      # Workflow orchestration
│   │   ├── WebhookDispatcher.ts   # Webhook management
│   │   ├── AnalyticsEngine.ts     # Metrics aggregation
│   │   ├── InMemoryStore.ts       # Data persistence
│   │   ├── BaseRepository.ts      # Generic data access
│   │   └── UnitOfWork.ts          # Transaction management
│   │
│   ├── auth/
│   │   ├── JWT.ts                 # JWT handling
│   │   ├── SessionManager.ts      # Session management
│   │   ├── DeviceTracker.ts       # Device tracking
│   │   └── MFAManager.ts          # MFA abstraction
│   │
│   └── Platform.ts                # Central container

├── modules/                        # Feature modules (Bounded Contexts)
│   ├── users/                      # User management module
│   │   ├── domain/
│   │   │   ├── User.ts            # User aggregate
│   │   │   ├── UserEmail.ts       # Email value object
│   │   │   ├── UserPassword.ts    # Password value object
│   │   │   └── events/
│   │   │       ├── UserCreated.ts
│   │   │       ├── UserSuspended.ts
│   │   │       └── UserDeleted.ts
│   │   │
│   │   ├── application/
│   │   │   ├── UserService.ts     # Use case orchestration
│   │   │   ├── DTOs/
│   │   │   └── validators/
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── UserRepository.ts  # Data access
│   │   │   ├── UserEventHandler.ts # Event handlers
│   │   │   └── UserMapper.ts      # DTO mapping
│   │   │
│   │   └── api/
│   │       ├── UserController.ts  # HTTP endpoints
│   │       └── routes.ts
│   │
│   ├── providers/                  # Provider management
│   ├── orders/                      # Order management
│   ├── payments/                    # Payment processing
│   ├── wallets/                     # Wallet & balance management
│   ├── tenants/                     # Tenant management
│   ├── roles/                       # Role & permission management
│   ├── audit/                       # Audit logging
│   ├── security/                    # Security events
│   ├── notifications/               # Notification system
│   ├── feature-flags/               # Feature flag management
│   ├── webhooks/                    # Webhook management
│   ├── workflows/                   # Workflow management
│   └── analytics/                   # Analytics module
│
├── shared/                         # Shared utilities
│   ├── types/
│   ├── constants/
│   ├── utils/
│   ├── decorators/
│   └── validators/
│
├── api/                            # API gateway
│   ├── middleware/
│   ├── interceptors/
│   ├── error-handlers/
│   └── filters/
│
├── ui/                             # UI layer (optional)
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/
│
└── config/
    ├── database.ts
    ├── cache.ts
    └── services.ts
```

---

## LAYER DESCRIPTIONS

### 1. Domain Layer (`/core/domain`)

**Purpose**: Pure business logic, independent of technology

**Contains**:
- Aggregates (root entities with business rules)
- Entities (objects with identity)
- Value Objects (immutable data objects)
- Domain Events (something happened)
- Domain Errors (specific business failures)
- Repository Interfaces (abstraction contracts)

**Key Principle**: No dependencies on frameworks, databases, or external services

**Example**:
```typescript
// User aggregate - pure domain logic
class User extends Aggregate<string> {
  private email: UserEmail
  private password: UserPassword
  private status: UserStatus

  authenticate(plainPassword: string): boolean {
    return this.password.matches(plainPassword)
  }

  suspend(reason: string): void {
    this.status = UserStatus.SUSPENDED
    this.markAsUpdated()
  }
}
```

### 2. Infrastructure Layer (`/core/infrastructure`)

**Purpose**: Technical implementations and adapters

**Contains**:
- Repository Implementations
- Event Bus Implementation
- Database Adapters
- External Service Clients
- Authentication Providers
- Cache Implementations

**Key Principle**: Infrastructure is swappable (in-memory → PostgreSQL, local → Redis, etc.)

### 3. Application Layer (`/modules/*/application`)

**Purpose**: Orchestrates domain objects to fulfill use cases

**Contains**:
- Services (use case coordination)
- DTOs (data transfer objects)
- Mappers (domain ↔ DTO conversion)
- Validators (input validation)
- Handlers (domain event processing)

**Key Principle**: Thin services that delegate to domain

### 4. API Layer (`/modules/*/api`)

**Purpose**: HTTP/GraphQL interface to the application

**Contains**:
- Controllers/Resolvers
- Route definitions
- Request/Response validation
- Error normalization

### 5. Core Engines (`/core/infrastructure`)

**Shared infrastructure used by all modules**:

#### Permission Engine (RBAC)
```typescript
// Simple role-based access control
permissionEngine.hasPermission(roleId, resource, action)
// e.g.: hasPermission('admin', 'users', 'create') → true
```

#### Policy Engine (ABAC + RBAC)
```typescript
// Attribute-based access control
const decision = policyEngine.evaluate(
  'payments',
  'refund',
  { tenantId: 'tenant-1', amount: 150 },
  userRole
)
// Considers attributes: tenant, region, amount, etc.
```

#### Feature Flag Engine
```typescript
// Runtime feature toggles with targeting
featureFlagEngine.evaluate('new-ui', {
  userId: 'user-123',
  tenantId: 'tenant-1',
  region: 'us-east'
})
// Returns: { enabled: true, variant: 'variant-b' }
```

#### Audit Trail
```typescript
// Immutable log of all actions
auditTrail.record({
  actor: { userId, email, role, ipAddress },
  action: 'user_created',
  resourceType: 'User',
  resourceId: newUser.id,
  changes: { before: {}, after: userData },
  reason: 'Admin action',
  tenantId: 'tenant-1'
})
```

#### Event Bus
```typescript
// Domain event publishing
eventBus.subscribe('UserCreated', async (event) => {
  // Send welcome email
  // Create audit entry
  // Update analytics
})

// Publish event from aggregate
user.addDomainEvent(new UserCreatedEvent(...))
// Later published automatically via Unit of Work
```

#### Tenant Context
```typescript
// Multi-tenant isolation
tenantContext.setTenant({ tenantId: 'tenant-1', ... })
tenantContext.setUser({ userId: 'user-123', ... })

// All subsequent operations scoped to tenant
const users = await userService.listTenantUsers()
// Returns only users in tenant-1
```

---

## MODULE DEVELOPMENT GUIDE

### Creating a New Module (e.g., `Invoices`)

#### Step 1: Define Domain

```typescript
// modules/invoices/domain/Invoice.ts
export class Invoice extends Aggregate<string> {
  private number: string
  private amount: Money  // Value object
  private status: InvoiceStatus
  private tenantId: string
  private items: InvoiceItem[]

  validate(): void {
    if (this.amount.isZero()) {
      throw new InvalidArgumentError('Amount must be greater than zero')
    }
  }

  issue(): void {
    this.status = InvoiceStatus.ISSUED
    this.addDomainEvent(new InvoiceIssuedEvent(this.id, this.number))
  }

  pay(amount: Money): void {
    if (this.status !== InvoiceStatus.ISSUED) {
      throw new InvalidArgumentError('Only issued invoices can be paid')
    }
    this.status = InvoiceStatus.PAID
    this.addDomainEvent(new InvoicePaidEvent(this.id, amount))
  }

  toPrimitives(): Record<string, any> {
    return {
      id: this.id,
      number: this.number,
      amount: this.amount.toPrimitives(),
      status: this.status,
      items: this.items.map(i => i.toPrimitives()),
    }
  }
}
```

#### Step 2: Create Repository

```typescript
// modules/invoices/infrastructure/InvoiceRepository.ts
export class InvoiceRepository extends BaseRepository<Invoice, string> {
  constructor(store: InMemoryStore) {
    super('invoices', store)
  }

  async findByNumber(number: string): Promise<Invoice | null> {
    const all = await this.findAll()
    return all.find(i => i.getNumber() === number) || null
  }

  async findByTenant(tenantId: string): Promise<Invoice[]> {
    const all = await this.findAll()
    return all.filter(i => i.getTenantId() === tenantId)
  }

  protected reconstruct(data: Record<string, any>): Invoice {
    return Invoice.fromPrimitives(data)
  }
}
```

#### Step 3: Create Service

```typescript
// modules/invoices/application/InvoiceService.ts
export class InvoiceService {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async issueInvoice(
    number: string,
    amount: number,
    items: any[],
    reason?: string,
    correlationId?: string
  ): Promise<Invoice> {
    const actor = tenantContext.requireUser()
    const tenant = tenantContext.requireTenant()

    // Permission check
    if (!permissionEngine.hasPermission(actor.role, 'invoices', 'create')) {
      throw new UnauthorizedError('Cannot create invoices')
    }

    // Business logic
    const invoice = Invoice.create(
      uuid(),
      number,
      new Money(amount, 'USD'),
      tenant.tenantId
    )

    invoice.issue()

    // Persistence
    await this.invoiceRepository.save(invoice)
    globalUnitOfWork.registerNew(invoice)
    await globalUnitOfWork.commit()

    // Audit & observability
    auditTrail.record({
      actor: { userId: actor.userId, email: actor.email, role: actor.role, ... },
      action: 'invoice_issued',
      resourceType: 'Invoice',
      resourceId: invoice.id,
      changes: { before: {}, after: invoice.toPrimitives(), diff: { created: true } },
      reason: reason || 'Invoice creation',
      status: 'success',
      tenantId: tenant.tenantId,
    })

    observabilityService.info('Invoice issued', { invoiceId: invoice.id }, correlationId)

    return invoice
  }

  async payInvoice(invoiceId: string, amount: number, reason?: string): Promise<void> {
    const actor = tenantContext.requireUser()
    const tenant = tenantContext.requireTenant()

    if (!permissionEngine.hasPermission(actor.role, 'invoices', 'pay')) {
      throw new UnauthorizedError('Cannot pay invoices')
    }

    const invoice = await this.invoiceRepository.findById(invoiceId)
    if (!invoice) {
      throw new NotFoundError('Invoice not found')
    }

    if (invoice.getTenantId() !== tenant.tenantId) {
      throw new UnauthorizedError('Invoice belongs to different tenant')
    }

    const before = invoice.toPrimitives()
    invoice.pay(new Money(amount, 'USD'))

    await this.invoiceRepository.save(invoice)
    globalUnitOfWork.registerChanged(invoice)
    await globalUnitOfWork.commit()

    // Audit
    auditTrail.record({
      actor: { ... },
      action: 'invoice_paid',
      resourceType: 'Invoice',
      resourceId: invoiceId,
      changes: {
        before,
        after: invoice.toPrimitives(),
        diff: { status: { from: 'issued', to: 'paid' } }
      },
      reason: reason || 'Invoice payment',
      status: 'success',
      tenantId: tenant.tenantId,
    })
  }
}
```

#### Step 4: Add Event Handlers

```typescript
// modules/invoices/infrastructure/InvoiceEventHandler.ts
export function registerInvoiceEventHandlers() {
  eventBus.subscribe('InvoiceIssued', async (event) => {
    // Send email to customer
    // Create notification
    // Update analytics
    analyticsEngine.recordEvent({
      name: 'invoice_issued',
      tenantId: event.aggregateId,
      properties: { invoiceId: event.aggregateId, amount: event.getPayload().amount }
    })
  })

  eventBus.subscribe('InvoicePaid', async (event) => {
    // Record payment
    // Update accounting system
    // Send receipt email
    analyticsEngine.recordMetric({
      name: 'revenue',
      value: event.getPayload().amount,
      tags: { tenantId: event.aggregateId }
    })
  })
}
```

#### Step 5: Create API Controller

```typescript
// modules/invoices/api/InvoiceController.ts
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  async POST(request: NextRequest) {
    const { number, amount, items, reason } = await request.json()
    const correlationId = request.headers.get('x-correlation-id')

    try {
      const invoice = await this.invoiceService.issueInvoice(
        number,
        amount,
        items,
        reason,
        correlationId
      )
      return NextResponse.json({ success: true, data: invoice.toPrimitives() })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async PUT(request: NextRequest) {
    const { invoiceId, action, reason } = await request.json()

    if (action === 'pay') {
      const { amount } = await request.json()
      await this.invoiceService.payInvoice(invoiceId, amount, reason)
      return NextResponse.json({ success: true })
    }
  }
}
```

---

## INTEGRATION PATTERNS

### Pattern 1: Entity with Value Objects

```typescript
// Domain
class Order extends Aggregate<string> {
  private customerId: CustomerId  // Value object
  private amount: Money  // Value object
  private shippingAddress: Address  // Value object
  private items: OrderItem[]  // Entities

  addItem(item: OrderItem): void {
    this.items.push(item)
    this.markAsUpdated()
  }
}

class OrderItem extends Entity<string> {
  private productId: ProductId  // Value object
  private quantity: Quantity  // Value object
  private price: Money  // Value object
}
```

### Pattern 2: Domain Events & Event Bus

```typescript
// In aggregate
order.ship()
// Internally:
this.addDomainEvent(new OrderShippedEvent(this.id, this.customerId, this.items))

// Unit of Work commits
await unitOfWork.commit()
// Automatically publishes events

// Handler reacts
eventBus.subscribe('OrderShipped', async (event) => {
  const notification = new ShippingNotification(...)
  await notificationService.send(notification)
  // This is asynchronous and won't block order creation
})
```

### Pattern 3: Repository for Data Access

```typescript
// Define repository interface in domain
interface OrderRepository extends Repository<Order, string> {
  findByCustomer(customerId: CustomerId): Promise<Order[]>
  findByStatus(status: OrderStatus): Promise<Order[]>
}

// Implement in infrastructure
class InMemoryOrderRepository extends BaseRepository<Order, string> implements OrderRepository {
  async findByCustomer(customerId: CustomerId): Promise<Order[]> {
    const all = await this.findAll()
    return all.filter(o => o.getCustomerId().equals(customerId))
  }
}

// Use in service
class OrderService {
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    const customerId = new CustomerId(customerId)
    return this.orderRepository.findByCustomer(customerId)
  }
}
```

### Pattern 4: RBAC Permission Check

```typescript
// Register roles and permissions
permissionEngine.registerRole({
  id: 'admin',
  name: 'Administrator',
  permissions: [
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'delete' },
    { resource: 'orders', action: 'refund' },
  ]
})

// Check in service
if (!permissionEngine.hasPermission(user.role, 'orders', 'refund')) {
  throw new UnauthorizedError('Cannot refund orders')
}

// Check in controller with decorator
@Authorize('orders', 'refund')
async POST(request: Request) {
  // Only reaches here if permission is granted
}
```

### Pattern 5: ABAC Policy Check

```typescript
// Define policy
policyEngine.addRule({
  id: 'refund-max-amount',
  resource: 'payments',
  action: 'refund',
  effect: 'allow',
  conditions: {
    amount: { lte: 1000 }  // Can only refund up to $1000
  },
  priority: 100
})

// Evaluate
const decision = policyEngine.evaluate('payments', 'refund', {
  amount: 500,
  tenantId: 'tenant-1'
}, userRole)

if (!decision.allowed) {
  throw new ForbiddenError(decision.reason)
}
```

### Pattern 6: Audit Trail Integration

```typescript
// Automatically captured for all sensitive operations
auditTrail.record({
  actor: tenantContext.requireUser(),  // Who
  action: 'refund_payment',  // What
  resourceType: 'Payment',
  resourceId: paymentId,
  changes: {
    before: { status: 'completed', amount: 100 },
    after: { status: 'refunded', amount: 100 },
    diff: { status: { from: 'completed', to: 'refunded' } }
  },
  reason: 'Customer requested refund',  // Why
  status: 'success',
  tenantId: tenant.tenantId,
  metadata: { ipAddress, deviceId, sessionId }
})

// Query audit trail
const entries = auditTrail.search({
  resourceType: 'Payment',
  action: 'refund_payment',
  tenantId: 'tenant-1',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  limit: 50
})
```

### Pattern 7: Feature Flags

```typescript
// Create flag with targeting
featureFlagEngine.createFlag({
  id: 'new-checkout',
  name: 'New Checkout Flow',
  enabled: true,
  rolloutPercentage: 20,  // 20% of users
  targeting: {
    regions: ['us-east', 'us-west'],  // Only US
    roles: ['premium'],  // Only premium users
  }
})

// Evaluate for user
const result = featureFlagEngine.evaluate('new-checkout', {
  userId: 'user-123',
  tenantId: 'tenant-1',
  region: 'us-east',
  role: 'premium'
})

if (result.enabled) {
  // Use new checkout flow
} else {
  // Use legacy checkout flow
}
```

### Pattern 8: Workflow Automation

```typescript
// Define workflow
workflowEngine.registerWorkflow({
  id: 'order-processing',
  name: 'Order Processing',
  enabled: true,
  triggers: ['event'],
  startStepId: 'validate-order',
  steps: [
    {
      id: 'validate-order',
      name: 'Validate Order',
      type: 'action',
      action: 'validateOrder',
      onSuccess: 'charge-payment',
      onFailure: 'notify-error'
    },
    {
      id: 'charge-payment',
      name: 'Charge Payment',
      type: 'action',
      action: 'chargePayment',
      retryPolicy: { maxAttempts: 3, backoffMs: 1000 },
      onSuccess: 'create-shipment'
    },
    {
      id: 'create-shipment',
      name: 'Create Shipment',
      type: 'action',
      action: 'createShipment',
      onSuccess: 'notify-customer'
    },
    {
      id: 'notify-customer',
      name: 'Send Confirmation',
      type: 'action',
      action: 'sendConfirmationEmail'
    },
    {
      id: 'notify-error',
      name: 'Handle Error',
      type: 'action',
      action: 'notifyAdmin'
    }
  ]
})

// Register handlers
workflowEngine.registerHandler('validateOrder', async (context) => {
  // Validate order data
  if (!context.order.items.length) {
    throw new Error('Order must have items')
  }
})

workflowEngine.registerHandler('chargePayment', async (context) => {
  // Charge customer
  const result = await paymentService.charge(context.order.amount)
  context.chargeResult = result
})

// Execute workflow
const execution = await workflowEngine.execute('order-processing', {
  order: { id: 'ord-123', items: [...], amount: 100 },
  customerId: 'cust-123'
})

console.log(execution.status)  // 'success' or 'failure'
```

---

## SECURITY & COMPLIANCE

### Authentication Flow

```typescript
// Login
const user = await authService.authenticate(email, password, mfaToken)
const tokens = authService.generateTokens(user)
sessionManager.createSession(user.id, tokens.refreshToken)

// Middleware validates JWT
const payload = jwt.verify(request.headers.authorization.split(' ')[1])
tenantContext.setUser({
  userId: payload.userId,
  email: payload.email,
  role: payload.role,
  tenantId: payload.tenantId,
  // ...
})

// All subsequent operations scoped to user & tenant
```

### Multi-Tenant Isolation

```typescript
// Every operation must include tenant context
tenantContext.setTenant({
  tenantId: 'tenant-1',
  features: ['invoices', 'payments'],
  region: 'us-east',
  locale: 'en-US'
})

// Repository automatically filters by tenant
const users = await userRepository.findByTenant(tenant.tenantId)
// SELECT * FROM users WHERE tenant_id = 'tenant-1'

// Permission scoped to tenant
const allowed = permissionEngine.hasPermission(
  userRole,
  'users',
  'create',
  { tenantId: 'tenant-1' }
)
```

### Audit Compliance

```typescript
// Every mutation is audited
- Create: { action: 'user_created', before: {}, after: {...} }
- Update: { action: 'user_updated', before: {...}, after: {...}, diff: {...} }
- Delete: { action: 'user_deleted', before: {...}, after: {} }
- Sensitive: { action: 'payment_refunded', reason: '...' }

// Audit trail is immutable (append-only)
auditTrail.record(entry)  // Can only add, never modify
auditTrail.getAll()  // Read-only access
```

---

## DEPLOYMENT & SCALING

### From In-Memory to Production

**Step 1**: Replace InMemoryStore with PostgreSQL
```typescript
// config/database.ts
export class PostgresRepository<T extends Aggregate<ID>, ID> extends BaseRepository<T, ID> {
  constructor(private pool: Pool, collectionName: string) {
    super(collectionName, new InMemoryStore())  // Still use abstraction
  }

  async save(aggregate: T): Promise<void> {
    const data = aggregate.toPrimitives()
    await this.pool.query(
      `INSERT INTO ${this.collectionName} VALUES ($1)`,
      [JSON.stringify(data)]
    )
    super.save(aggregate)
  }
}
```

**Step 2**: Replace EventBus with RabbitMQ/Kafka
```typescript
// Use adapter pattern
interface EventPublisher {
  publish(event: DomainEvent): Promise<void>
}

class RabbitMQEventPublisher implements EventPublisher {
  async publish(event: DomainEvent): Promise<void> {
    const channel = await this.connection.createChannel()
    await channel.assertExchange(event.getEventName(), 'fanout')
    await channel.publish(
      event.getEventName(),
      '',
      Buffer.from(JSON.stringify(event.toPrimitives()))
    )
  }
}
```

**Step 3**: Add API Gateway with Rate Limiting
```typescript
// Middleware
async function rateLimitMiddleware(req, res, next) {
  const key = `${req.user.id}:${req.path}`
  const limit = await redis.incr(key)
  
  if (limit > 100) {
    throw new RateLimitError('Too many requests')
  }
  
  await redis.expire(key, 60)  // 1 minute window
  next()
}
```

---

## SUMMARY

This architecture provides:

✅ **Scalability**: Handle 1M+ users with horizontal scaling  
✅ **Maintainability**: Clear separation of concerns  
✅ **Testability**: Every component independently testable  
✅ **Security**: Secure-by-default with audit trails  
✅ **Extensibility**: Add new features without touching existing code  
✅ **Compliance**: Complete audit trail for regulatory requirements  
✅ **Observability**: Logs, metrics, and tracing at every layer  

**Next Steps**:
1. Implement remaining modules (Payments, Orders, etc.)
2. Add API layer for each module
3. Integrate real databases and message queues
4. Build UI using module services
5. Set up deployment pipeline
