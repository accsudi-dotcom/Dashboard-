# Sharoobi Console - Code Walkthrough

Learn how the code is organized and follow the flow from user login to dashboard view.

---

## Understanding the Project Structure

### Root Level
```
sharoobi-console/
├── app/                    # Next.js app router pages
├── components/             # React components
├── lib/                    # Utilities and helpers
├── stores/                 # Zustand state stores
├── types/                  # TypeScript definitions
├── hooks/                  # React hooks
├── config/                 # Configuration files
├── styles/                 # Global CSS and theme
├── public/                 # Static assets
└── docs/                   # Documentation
```

### Key Directories Explained

#### `app/` - Routes and Pages
```
app/
├── layout.tsx              # Root layout (wraps everything)
├── page.tsx                # Root page (redirects)
├── auth/login/page.tsx     # Login page
└── dashboard/
    ├── layout.tsx          # Dashboard wrapper
    ├── command-center/     # Command center page
    ├── support/            # Support workspace
    └── ... other pages
```

#### `components/` - React Components
```
components/
├── layout/                 # Layout components
│   ├── Sidebar.tsx         # Left sidebar
│   ├── Topbar.tsx          # Top header
│   ├── InspectorPanel.tsx  # Right drawer
│   └── DashboardLayout.tsx # Main wrapper
├── patterns/               # Reusable patterns
│   ├── DataTable.tsx       # Table (Phase 2)
│   ├── FormBuilder.tsx     # Form (Phase 2)
│   └── Card.tsx
├── ui/                     # shadcn/ui components
└── workspaces/             # Workspace components (Phase 2)
```

#### `lib/` - Utilities
```
lib/
├── api-client.ts           # HTTP client
├── schemas.ts              # Zod validation
├── utils.ts                # Helpers
└── constants.ts            # Constants
```

#### `stores/` - State Management
```
stores/
├── auth.ts                 # Auth state (Zustand)
└── ui.ts                   # UI state (Zustand)
```

#### `types/` - Type Definitions
```
types/
├── domain.ts               # Business entity types
└── api.ts                  # API response types
```

---

## The User Journey: From Login to Dashboard

### 1. User Visits Application

**File**: `app/page.tsx`
```typescript
// Root page redirects to dashboard
useRouter().push('/dashboard/command-center')
```

**What happens**:
- User lands on `/`
- Gets redirected to `/dashboard/command-center`

---

### 2. Check Authentication

**File**: `app/dashboard/layout.tsx`
```typescript
// Dashboard layout checks auth
if (!isAuthenticated) {
  router.push('/auth/login')
}
```

**What happens**:
- If not logged in, redirected to login page
- If logged in, dashboard loads

---

### 3. Login Process

**File**: `app/auth/login/page.tsx`

Flow:
```
User enters credentials
         ↓
Form validates (Zod)
         ↓
Check against demo account:
  admin@sharoobi.local / Admin@sharoobi
         ↓
Create mock user object with:
  - id, email, displayName
  - role: 'super_admin'
  - permissions array
         ↓
Auth store saves:
  - User object
  - JWT token
  - isAuthenticated = true
         ↓
Toast notification: "Welcome!"
         ↓
Redirect to /dashboard/command-center
```

**Key Code**:
```typescript
const mockUser: AdminUser = {
  id: 'admin-001',
  email: 'admin@sharoobi.local',
  displayName: 'Super Admin',
  role: 'super_admin',
  permissions: [...] // Full permissions
}

setUser(mockUser, token)  // Save to auth store
router.push('/dashboard/command-center')
```

---

### 4. Dashboard Layout Renders

**File**: `app/dashboard/layout.tsx`

Structure:
```
<html>
  <body>
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Topbar />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}  {/* Route-specific page */}
        </main>
      </div>
      
      {/* Right Inspector Panel */}
      <InspectorPanel />
    </div>
  </body>
</html>
```

---

### 5. Sidebar Renders

**File**: `components/layout/Sidebar.tsx`

**Responsibilities**:
- Display logo
- Show menu sections (Operations, Workspaces, Studios, etc.)
- Handle section collapse/expand
- Highlight current page
- Show badge counts
- Toggle mobile visibility

**Key Logic**:
```typescript
const menuSections = [
  {
    title: 'Operations',
    items: [
      { label: 'Command Center', href: '/dashboard/command-center', icon: LayoutGrid }
    ]
  },
  // ... more sections
]

// Sidebar maps these to navigation links
menuSections.map(section =>
  section.items.map(item =>
    <Link href={item.href}>
      {item.label}
    </Link>
  )
)
```

---

### 6. Topbar Renders

**File**: `components/layout/Topbar.tsx`

**Features**:
- Global search input
- Keyboard shortcuts (Cmd+K)
- Notifications bell
- Theme toggle (Sun/Moon)
- User dropdown menu

**Key Logic**:
```typescript
// Keyboard shortcuts
if ((metaKey || ctrlKey) && key === 'k') {
  openCommandPalette()
}

// Theme toggle
onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}

// User dropdown
<DropdownMenu>
  <UserInfo />
  <MenuItem>Profile Settings</MenuItem>
  <MenuItem>Logout</MenuItem>
</DropdownMenu>
```

---

### 7. Command Center Page Renders

**File**: `app/dashboard/command-center/page.tsx`

**Components**:
```
Command Center Page
├── Header (title + description)
├── KPI Cards Grid
│   ├── GMV Card
│   ├── Active Users Card
│   ├── Pending Refunds Card
│   └── High-Risk Events Card
├── Main Content (2-column layout)
│   ├── Alerts Section
│   └── Live Queues Section
└── System Health & Quick Actions
    ├── System Health Cards
    └── Quick Action Buttons
```

**Key Code**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <KPICard title="GMV" value="$2.4M" trend="up" icon={DollarSign} />
  {/* More KPI cards */}
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Alerts and queues */}
</div>
```

---

### 8. State Management at Work

**When user loads page**:

**Auth Store** (`stores/auth.ts`)
```typescript
const { user, isAuthenticated, canPerform } = useAuthStore()
// user = { id, email, role, permissions }
// isAuthenticated = true
// canPerform = function to check permissions
```

**UI Store** (`stores/ui.ts`)
```typescript
const { theme, sidebarOpen, inspector } = useUIStore()
// theme = 'dark' or 'light'
// sidebarOpen = true/false (mobile)
// inspector = { entityType, entityId, activeTab } or null
```

---

### 9. User Clicks Entity in UI

**Example**: Click on an alert or queue item

**Code Flow**:
```typescript
// In a component
const { openInspector } = useUIStore()

<div onClick={() => openInspector('order', '12345')}>
  Click me to see details
</div>
```

**What Happens**:
1. `openInspector('order', '12345')` called
2. UI store updates: `inspector = { entityType: 'order', entityId: '12345', activeTab: 'details' }`
3. InspectorPanel component renders
4. Right drawer slides in from right
5. Shows entity details, actions, timeline, etc.

---

### 10. Inspector Panel Renders

**File**: `components/layout/InspectorPanel.tsx`

**Structure**:
```
Inspector Panel
├── Header (entity type + id + close button)
├── Tabs
│   ├── Details Tab (entity info)
│   ├── Actions Tab (available actions)
│   ├── Timeline Tab (event history)
│   ├── Relationships Tab (related entities)
│   └── Audit Tab (admin actions on entity)
└── Content Area (changes based on active tab)
```

**Key Code**:
```typescript
const { inspector, closeInspector, setInspectorTab } = useUIStore()

if (!inspector) return null  // Don't render if closed

<Tabs value={inspector.activeTab}>
  <TabsTrigger onClick={(tab) => setInspectorTab(tab)}>
    Details
  </TabsTrigger>
  {/* More tabs */}
</Tabs>
```

---

## Data Flow Diagrams

### Authentication Flow
```
Login Form
    ↓
Validate with Zod schema
    ↓
Check credentials (demo: admin@sharoobi.local)
    ↓
Create AdminUser object with permissions
    ↓
useAuthStore.setUser(user, token)
    ↓
localStorage persists auth
    ↓
Redirect to dashboard
    ↓
All pages can now use useAuthStore()
```

### Component Rendering Flow
```
app/layout.tsx (Root)
    ↓
app/dashboard/layout.tsx (Check auth, render layout)
    ↓
Sidebar + Topbar + Inspector (Layout components)
    ↓
Route page (e.g., command-center/page.tsx)
    ↓
KPI cards, alerts, queues (Content components)
```

### State Management Flow
```
User clicks inspector → openInspector('user', id)
                    ↓
useUIStore updates → inspector = { entityType, entityId, activeTab }
                    ↓
InspectorPanel reads inspector state
                    ↓
Renders entity details based on entityType
                    ↓
User clicks close → closeInspector()
                    ↓
inspector = null → Panel disappears
```

---

## Key Patterns in Code

### 1. API Calls (Ready for Phase 2)

**Pattern**:
```typescript
// In a hook
const { data } = useQuery({
  queryKey: ['orders'],
  queryFn: () => apiClient.get('/orders', OrderListResponseSchema)
})
```

### 2. Permission Checking

**Pattern**:
```typescript
const { canPerform } = useAuthStore()

if (!canPerform('order', 'refund')) {
  return <div>Access Denied</div>
}

<button onClick={handleRefund}>Refund</button>
```

### 3. Component with State

**Pattern**:
```typescript
import { useUIStore } from '@/stores/ui'

export function MyComponent() {
  const { theme, setTheme } = useUIStore()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

### 4. Form with Validation

**Pattern** (ready for Phase 2):
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(MySchema)
})

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email')} />
  {errors.email && <span>{errors.email.message}</span>}
</form>
```

---

## Files to Study for Learning

### To Understand Authentication
1. `app/auth/login/page.tsx` - Login flow
2. `stores/auth.ts` - Auth store
3. `app/dashboard/layout.tsx` - Auth check

### To Understand Layout
1. `app/dashboard/layout.tsx` - Main layout
2. `components/layout/Sidebar.tsx` - Sidebar
3. `components/layout/Topbar.tsx` - Topbar
4. `components/layout/InspectorPanel.tsx` - Inspector

### To Understand State Management
1. `stores/auth.ts` - Auth state
2. `stores/ui.ts` - UI state

### To Understand Types
1. `types/domain.ts` - Business types
2. `lib/schemas.ts` - Validation schemas

### To Understand API Integration
1. `lib/api-client.ts` - HTTP client
2. `lib/schemas.ts` - Request/response validation

---

## Common Tasks & Where to Code

| Task | File to Edit |
|------|--------------|
| Add new page | `app/dashboard/section/page.tsx` |
| Add sidebar menu item | `components/layout/Sidebar.tsx` |
| Change theme colors | `app/globals.css` (CSS variables) |
| Add permission check | `stores/auth.ts` (add to permissions array) |
| Add new Zod schema | `lib/schemas.ts` |
| Add new type | `types/domain.ts` |
| Update API client | `lib/api-client.ts` |
| Change UI state | `stores/ui.ts` |

---

## Debug Tips

### Check Login Status
```typescript
const { isAuthenticated, user } = useAuthStore()
console.log('Logged in:', isAuthenticated)
console.log('User:', user)
```

### Check Theme
```typescript
const { theme } = useUIStore()
console.log('Current theme:', theme)
```

### Check Inspector State
```typescript
const { inspector } = useUIStore()
console.log('Inspector:', inspector)
// Should show { entityType, entityId, activeTab } or null
```

### Check Permissions
```typescript
const { canPerform } = useAuthStore()
console.log('Can refund:', canPerform('payment', 'refund'))
```

---

## Next Steps

### To Understand Phase 2
Read `PHASE_2_ROADMAP.md` for:
- TanStack Query patterns
- Table implementation
- Data fetching patterns

### To Understand the Whole Project
Read `README.md` for:
- Complete architecture
- All entities and types
- API contracts

### To Start Coding
Check `QUICKSTART.md` for:
- How to add a page
- How to create a form
- How to use the inspector

---

## Summary

**The code flow is**:
1. User visits `/`
2. Redirects to `/dashboard/command-center`
3. Dashboard layout checks `isAuthenticated`
4. If not logged in, redirects to `/auth/login`
5. On login, user object saved to auth store
6. Dashboard renders with Sidebar, Topbar, and page content
7. Clicking entities opens InspectorPanel
8. All state managed by Zustand stores
9. All API calls validated with Zod

**It's clean, type-safe, and ready for expansion.**

---

**Ready to explore the code? Start with `app/dashboard/command-center/page.tsx`.**
