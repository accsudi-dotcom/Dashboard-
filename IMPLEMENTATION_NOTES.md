# Implementation Notes - Sharoobi Console

## Architecture Overview

### Directory Structure
```
/app                          # Next.js app directory
  /dashboard                  # Main admin dashboard
    /command-center          # KPI dashboard
    /support                 # Support workspace
    /ops                     # Operations workspace
    /finance                 # Finance workspace
    /moderation              # Moderation workspace
    /security                # Security workspace
    /studios                 # Management studios
      /feature-flags
      /rules
      /pricing
      /permissions
    /governance              # Compliance areas
      /audit
      /security
      /sessions
      /devices
    /entities                # Entity management
      /users
      /providers
      /orders
      /payments
      /wallet
    layout.tsx               # Dashboard layout
    page.tsx                 # Dashboard entry

  /provider-portal           # External provider portal
    page.tsx

  /auth                      # Authentication
    login/page.tsx
    register/page.tsx

  layout.tsx                 # Root layout
  page.tsx                   # Landing page

/components
  /ui                        # shadcn/ui components (40+)
  /charts                    # Chart components
  /navigation               # Nav components
  /modals                   # Modal dialogs
  /status                   # Status indicators
  /forms                    # Form components

/hooks                       # Custom React hooks
  /usePermissions
  /useDebounce
  /useToastNotification
  /useTheme

/lib                         # Utility functions
  /utils.ts                 # General utilities
  /cn.ts                    # Class name merger
  /format.ts                # Formatting functions
  /validation.ts            # Form validation

/config                      # Configuration
  /navigation.ts             # Navigation config
  /roles.ts                 # Role definitions
  /permissions.ts           # Permission matrix

/styles                      # Global styles
  /globals.css              # Global styles
  /variables.css            # CSS variables

/public                      # Static assets
  /images
  /icons
  /fonts
```

### Key Design Patterns

#### 1. Component Organization
```typescript
// Modular, single-responsibility components
export function ComponentName() {
  return (
    <div>
      {/* Component content */}
    </div>
  )
}
```

#### 2. Type Safety
```typescript
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({ variant = 'primary', ...props }: Props) {
  // Implementation
}
```

#### 3. State Management (Zustand)
```typescript
import { create } from 'zustand'

export const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

#### 4. Custom Hooks
```typescript
export function usePermissions() {
  // Check user permissions
  return { canCreate, canEdit, canDelete }
}
```

#### 5. Form Validation (Zod)
```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>
```

---

## Component Inventory

### UI Components (shadcn/ui)
All components are from shadcn/ui with customizations:

**Form Components**
- Button, Input, Select, Textarea, Checkbox, Radio, Switch
- Form, Label, Dropdown Menu, Command

**Layout Components**
- Card, Tabs, Accordion, Separator, Scroll Area
- Navigation Menu, Breadcrumb, Pagination

**Dialog Components**
- Dialog, AlertDialog, Sheet, Popover, Tooltip

**Display Components**
- Badge, Avatar, Progress, Skeleton, Alert
- Table, Calendar, Date Picker

**Custom Extensions**
- Status indicators with icons
- Queue components with priority
- Stats cards with trend indicators
- Data tables with sorting/filtering
- Charts with Recharts

### Custom Components (Built for this project)
```typescript
// Example custom component structure
components/
  ├── QueueCard.tsx         # Queue item display
  ├── StatCard.tsx          # KPI card
  ├── StatusIndicator.tsx   # Status with icon/badge
  ├── OrderCard.tsx         # Order summary card
  ├── ModalWindow.tsx       # Reusable modal
  └── DataTable.tsx         # Enhanced table
```

---

## Styling System

### CSS Variables (Tokens)
```css
:root {
  /* Colors */
  --primary: #0066FF
  --secondary: #F0F0F0
  --success: #10B981
  --warning: #F59E0B
  --destructive: #EF4444
  
  /* Spacing */
  --spacing-1: 4px
  --spacing-2: 8px
  --spacing-3: 12px
  --spacing-4: 16px
  --spacing-6: 24px
  
  /* Typography */
  --font-sans: 'Inter', system-ui
  --font-mono: 'JetBrains Mono', monospace
  
  /* Radii */
  --radius: 8px
}
```

### Tailwind Configuration
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        // More colors...
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
}
```

---

## Navigation Structure

### Dashboard Navigation
```
Dashboard
├── Command Center
├── Workspaces
│   ├── Support (Tickets)
│   ├── Ops (Orders)
│   ├── Finance (Payments)
│   ├── Moderation (Content)
│   └── Security (Threats)
├── Studios
│   ├── Feature Flags
│   ├── Rules
│   ├── Pricing
│   └── Permissions
├── Governance
│   ├── Audit Log
│   ├── Security Events
│   ├── Sessions
│   └── Devices
└── Settings
    ├── Workspace Settings
    ├── Team Management
    └── Integrations
```

---

## Data Flow

### Mock Data Strategy
```typescript
// /lib/mock-data.ts
export const mockUsers = [
  { id: '1', name: 'Ahmed', email: 'ahmed@example.com' },
  // ... more records
]

export const mockOrders = [
  { id: '1', user: 'Ahmed', total: 450 },
  // ... more records
]
```

### Component Data Usage
```typescript
export function UsersPage() {
  const users = mockUsers  // Use mock data for now
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

### API Integration Ready
```typescript
// When backend is ready, replace with:
export function UsersPage() {
  const { data: users, isLoading } = useFetch('/api/users')
  return (
    <div>
      {isLoading && <Skeleton />}
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

---

## Performance Optimization

### Code Splitting
```typescript
// Automatic in Next.js App Router
// Each route is code-split automatically
import dynamic from 'next/dynamic'
const HeavyComponent = dynamic(() => import('./heavy'))
```

### Image Optimization
```typescript
import Image from 'next/image'

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={40}
  height={40}
  className="rounded-full"
/>
```

### Memoization
```typescript
import { memo } from 'react'

const StatsCard = memo(function StatsCard({ data }) {
  return <Card>{data.value}</Card>
})
```

---

## Testing Strategy

### Unit Tests
```typescript
// __tests__/utils.test.ts
import { formatCurrency } from '@/lib/format'

describe('formatCurrency', () => {
  it('should format amount as currency', () => {
    expect(formatCurrency(1000)).toBe('SR 1,000')
  })
})
```

### Integration Tests
```typescript
// __tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import Dashboard from '@/app/dashboard/page'

describe('Dashboard', () => {
  it('should render dashboard', () => {
    render(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
```

---

## Accessibility Implementation

### Semantic HTML
```typescript
<main>
  <header>
    <nav aria-label="Primary navigation">
      {/* Navigation items */}
    </nav>
  </header>
  <aside aria-label="Sidebar">
    {/* Sidebar content */}
  </aside>
  <article>
    {/* Main content */}
  </article>
</main>
```

### ARIA Attributes
```typescript
<button
  aria-label="Open menu"
  aria-expanded={isOpen}
  aria-controls="menu"
>
  {/* Button content */}
</button>
```

### Keyboard Navigation
```typescript
<input
  type="text"
  placeholder="Search..."
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }}
/>
```

---

## Error Handling

### Error Boundaries
```typescript
export class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    return <ErrorFallback />
  }
}
```

### Form Validation
```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password too short'),
})

const { errors } = await schema.parseAsync(data)
```

---

## Configuration

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
AUTH_SECRET=your-secret
DATABASE_URL=postgresql://...
```

### Feature Flags (Ready for integration)
```typescript
// /config/features.ts
export const FEATURES = {
  ADVANCED_ANALYTICS: true,
  BETA_UI: false,
  DARK_MODE: true,
}
```

---

## Deployment Checklist

- [ ] Update environment variables
- [ ] Configure API endpoints
- [ ] Set up database
- [ ] Configure authentication
- [ ] Set up email service
- [ ] Configure error tracking
- [ ] Set up analytics
- [ ] Test all pages
- [ ] Run performance audit
- [ ] Security audit
- [ ] Deploy to staging
- [ ] Load testing
- [ ] Deploy to production

---

## Maintenance & Monitoring

### Key Metrics
- Page load time (target: < 2s)
- Time to interactive (target: < 3s)
- Error rate (target: < 0.1%)
- API response time (target: < 200ms)

### Monitoring Tools
- Sentry (error tracking)
- Google Analytics (usage)
- Vercel Analytics (performance)
- LogRocket (session replay)

---

## Extension Points

### Adding New Pages
1. Create folder in `/app/dashboard/new-feature`
2. Add `page.tsx` component
3. Update navigation config
4. Implement permission checks
5. Add to documentation

### Adding New Components
1. Create in `/components/ui` (if reusable)
2. Add TypeScript types
3. Add Storybook story
4. Add tests
5. Document usage

### Adding New Hooks
1. Create in `/hooks/useNewFeature`
2. Export in `/hooks/index.ts`
3. Add TypeScript types
4. Add tests
5. Document examples

---

**This implementation provides a solid foundation for enterprise applications with room for growth and customization.**
