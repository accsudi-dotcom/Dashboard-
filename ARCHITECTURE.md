# Sharoobi Console - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Sharoobi Console                      │
│              (React 19 + Next.js 16 Frontend)           │
└─────────────────────────────────────────────────────────┘
           │                                    │
           ├─── API Layer (api-client.ts)  ────┤
           │       (with Zod validation)        │
           │                                    │
  ┌────────▼────────────────────────────────────▼─────────┐
  │           Next.js App Router Backend                   │
  │        (Route Handlers for API integration)           │
  └────────┬────────────────────────────────────┬─────────┘
           │                                    │
           ├─── Zustand State Management───────┤
           │       (auth, ui, entities)         │
           │                                    │
  ┌────────▼────────────────────────────────────▼─────────┐
  │              Presentation Layer (React)                │
  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐        │
  │  │ Sidebar  │  │ Topbar   │  │ Inspector    │        │
  │  └──────────┘  └──────────┘  └──────────────┘        │
  │  ┌────────────────────────────────────────────┐       │
  │  │         Pages & Components                 │       │
  │  │  (Dashboard, Workspaces, Studios, etc.)    │       │
  │  └────────────────────────────────────────────┘       │
  └────────┬────────────────────────────────────┬─────────┘
           │                                    │
           └─── TanStack Table (Server-side) ──┘
           │                                    │
           └─── React Hook Form + Zod ─────────┘
```

## Layered Architecture

### 1. **Presentation Layer** (React Components)
   - Pages in `app/dashboard/*`
   - Reusable components in `components/`
   - Styling via Tailwind CSS + shadcn/ui

### 2. **State Management** (Zustand)
   - `stores/auth.ts` - Authentication state
   - `stores/ui.ts` - UI state (sidebar, inspector, theme)
   - No business logic in components

### 3. **API Client Layer** (`lib/api-client.ts`)
   - Centralized HTTP requests
   - Error handling & retry logic
   - Request/response validation with Zod
   - Built for both mock data and real APIs

### 4. **Type System** (TypeScript)
   - `types/domain.ts` - Domain models
   - `lib/schemas.ts` - Zod schemas for validation
   - Strict TypeScript mode enabled

### 5. **Data Access** (TanStack Query ready)
   - Server-side pagination patterns
   - Filtering & sorting ready
   - Mock data for development

---

## Component Hierarchy

```
<RootLayout>
  ├── Auth Provider (future)
  ├── Theme Provider
  └── <DashboardLayout>
      ├── <Sidebar>
      │   ├── Navigation Menu
      │   └── User Profile
      ├── <MainContent>
      │   ├── <Topbar>
      │   │   ├── Global Search
      │   │   ├── Notifications
      │   │   └── User Menu
      │   └── <Page>
      │       └── Components (various)
      └── <InspectorPanel>
          ├── Details Tab
          ├── Actions Tab
          ├── Timeline Tab
          └── Audit Tab
```

---

## Data Flow

### Command Center Example

```
User visits /dashboard/command-center
         │
         ▼
   Page Component Loaded
         │
         ▼
   Mock Data Defined (or API call in future)
         │
         ▼
   ┌─ Render KPI Cards
   ├─ Render Alerts
   ├─ Render Queue Items
   └─ Render System Health
         │
         ▼
   User Interaction (click on queue item)
         │
         ▼
   Update UI Store (setSelectedEntity)
         │
         ▼
   Inspector Panel Updates
         │
         ▼
   Show Entity Details + Timeline + Audit
```

### Workspace Example (e.g., Support)

```
User navigates to /dashboard/support
         │
         ▼
   Support Page Component
         │
         ├─ Load mock tickets (future: API)
         ├─ Render stats cards
         ├─ Render search/filter bar
         └─ Render ticket list (QueueItem components)
         │
         ▼
   User clicks a ticket
         │
         ▼
   setSelectedEntity in UI store
         │
         ▼
   Inspector Panel:
   - Shows ticket details
   - Shows timeline of events
   - Shows available actions
   - Shows audit trail
```

---

## State Management

### Zustand Stores

#### `stores/auth.ts`
```typescript
interface AuthState {
  user: AdminUser | null
  isLoggedIn: boolean
  login(email, password)
  logout()
  setUser(user)
}
```

#### `stores/ui.ts`
```typescript
interface UIState {
  sidebarOpen: boolean
  selectedEntity: SelectedEntity | null
  theme: 'light' | 'dark'
  notifications: Notification[]
  setSidebarOpen(boolean)
  setSelectedEntity(entity)
  setTheme(theme)
  addNotification(notification)
}
```

---

## API Client Architecture

### Centralized in `lib/api-client.ts`

```typescript
// Example usage
const user = await apiClient.get('/users/123')
const payment = await apiClient.post('/payments', { data })
const updated = await apiClient.put('/orders/456', { status: 'completed' })

// With request tracking
const response = await apiClient.request({
  method: 'POST',
  path: '/bulk-actions',
  body: { action: 'block_users', userIds: [...] },
  audit: { reason: 'Security threat' }
})
```

### Error Handling
```typescript
try {
  const data = await apiClient.get('/data')
} catch (error) {
  if (error instanceof ValidationError) {
    // Schema validation failed
  } else if (error instanceof AuthError) {
    // Authentication failed
  } else if (error instanceof NotFoundError) {
    // Resource not found
  } else {
    // Generic API error
  }
}
```

---

## Type System

### Domain Models (in `types/domain.ts`)

```typescript
interface AdminUser {
  id: string
  email: string
  name: string
  roles: UserRole[]
  permissions: Permission[]
  lastLogin: Date
  mfaEnabled: boolean
}

interface UserRole {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

interface Permission {
  resource: string // 'users', 'orders', 'payments'
  action: string // 'view', 'create', 'update', 'delete', 'approve'
  conditions?: AccessCondition[]
}
```

---

## Page Structure Pattern

All pages follow this structure:

```typescript
'use client'

import { ComponentType } from '@/components/ui/...'
import { apiClient } from '@/lib/api-client'
import { useUIStore } from '@/stores/ui'

// 1. Interface definitions
interface MyEntity {}

// 2. Mock data (development)
const mockData: MyEntity[] = [...]

// 3. Component
export default function PageComponent() {
  const store = useUIStore()
  
  // 4. Handlers
  const handleAction = async () => {}
  
  // 5. Render
  return (
    <div className="space-y-6">
      <PageHeader />
      <StatCards />
      <FilterBar />
      <DataList />
    </div>
  )
}
```

---

## Component Patterns

### StatCard Pattern
```typescript
<StatCard
  title="Active Users"
  value="12,543"
  change={12}
  description="vs last week"
  icon={<Users />}
  color="primary"
/>
```

### QueueItem Pattern
```typescript
<QueueItem
  id="ticket-1"
  title="Payment Failed"
  description="User unable to complete checkout"
  priority="high"
  status="pending"
  time="5 mins ago"
  assignee="Ahmed"
  onSelect={(id) => setSelectedEntity(...)}
  actions={[
    { label: 'Assign', onClick: () => {} },
    { label: 'Resolve', onClick: () => {} }
  ]}
/>
```

### AlertBox Pattern
```typescript
<AlertBox
  title="Critical Alert"
  message="Payment gateway failure detected"
  type="error"
  dismissible={true}
  actions={[
    { label: 'Investigate', onClick: () => {} },
    { label: 'Acknowledge', onClick: () => {} }
  ]}
/>
```

---

## Theme System

### CSS Variables in `app/globals.css`

```css
:root {
  --primary: 217 91% 45%;          /* Deep Blue */
  --accent: 173 80% 40%;           /* Vibrant Teal */
  --success: 142 76% 36%;          /* Emerald */
  --warning: 38 92% 50%;           /* Amber */
  --destructive: 0 84% 60%;        /* Red */
  /* ... more colors ... */
}

.dark {
  --primary: 199 89% 48%;
  /* ... dark mode overrides ... */
}
```

### Usage in Tailwind
```html
<div class="bg-primary text-primary-foreground">
  Primary Button
</div>
```

---

## Performance Patterns

### Server-Side Pagination
```typescript
const { data, total, page, pageSize } = await apiClient.get('/users', {
  page: 1,
  pageSize: 10,
  sort: 'name',
  order: 'asc'
})
```

### Lazy Loading Components
```typescript
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <Skeleton /> }
)
```

### Image Optimization
```typescript
<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={200}
  height={200}
  quality={75}
/>
```

---

## Security Considerations

### RBAC/ABAC Ready
- All pages structure permissions
- Components check user roles
- API calls include permission headers
- Audit trail captures all changes

### Data Protection
- No sensitive data in logs
- Timestamps on all audit events
- Request tracing with correlation IDs
- Session validation on each request

---

## Testing Patterns

### Component Testing (future)
```typescript
import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/stats/StatCard'

test('renders stat card with value', () => {
  render(<StatCard title="Users" value="123" />)
  expect(screen.getByText('123')).toBeInTheDocument()
})
```

### API Client Testing
```typescript
jest.mock('@/lib/api-client')
const mockGet = apiClient.get as jest.Mock
mockGet.mockResolvedValue({ data: [...] })

const result = await getUserData()
expect(mockGet).toHaveBeenCalledWith('/users')
```

---

## Deployment Architecture

### Development
```
pnpm dev
→ http://localhost:3000
```

### Production
```
Build:   pnpm build
Deploy:  vercel deploy
→ https://sharoobi-console.vercel.app
```

### Environment-Based Configuration
```
.env.local → Development
.env.production → Production
.env.staging → Staging
```

---

## Scalability Considerations

### Current (Single Developer)
- Mock data for all pages
- Static UI patterns
- Component library established

### Next Phase (Team Integration)
- Replace mock with API calls
- Add real authentication
- Implement WebSocket for real-time
- Scale permission system

### Enterprise Phase (Full Scale)
- Microservices backend
- Event streaming (Kafka)
- Distributed caching (Redis)
- Message queues (RabbitMQ)
- Search index (Elasticsearch)

---

This architecture is designed to scale from mock prototypes to enterprise-grade production systems with minimal refactoring.
