# Sharoobi Console - Testing Guide

## Test Coverage Plan

This guide outlines testing strategies for Sharoobi Console at different phases.

---

## Phase 1: Manual Testing (Current)

### Navigation Testing
- [ ] Verify all sidebar links navigate correctly
- [ ] Test topbar search functionality
- [ ] Check mobile menu toggle
- [ ] Verify Inspector Panel opens/closes
- [ ] Test theme toggle (Light/Dark)

### Component Testing (Visual)
- [ ] StatCard renders correctly with trends
- [ ] AlertBox displays all severity types
- [ ] QueueItem shows all priority levels
- [ ] DataTable pagination works
- [ ] Forms validate input correctly

### Responsive Testing
- [ ] Desktop (1920px) layout intact
- [ ] Tablet (768px) layout responsive
- [ ] Mobile (375px) layout functional
- [ ] All text readable
- [ ] Buttons clickable on touch

---

## Phase 2: Unit Testing (Recommended)

### Set Up Testing Framework
```bash
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
```

### Create Test Files Structure
```
tests/
├── unit/
│   ├── components/
│   │   ├── stats/StatCard.test.ts
│   │   ├── alerts/AlertBox.test.ts
│   │   ├── queues/QueueItem.test.ts
│   │   └── layout/Sidebar.test.ts
│   ├── stores/
│   │   ├── auth.test.ts
│   │   └── ui.test.ts
│   └── lib/
│       ├── api-client.test.ts
│       └── schemas.test.ts
├── integration/
│   ├── pages/
│   │   ├── command-center.test.ts
│   │   ├── workspaces.test.ts
│   │   └── studios.test.ts
│   └── workflows/
│       ├── authentication.test.ts
│       └── bulk-actions.test.ts
└── e2e/ (with Playwright)
    ├── login.spec.ts
    ├── dashboard.spec.ts
    └── workspaces.spec.ts
```

### Example Unit Tests

#### Component Test
```typescript
// tests/unit/components/stats/StatCard.test.ts
import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/stats/StatCard'

describe('StatCard', () => {
  it('renders title and value', () => {
    render(
      <StatCard
        title="Active Users"
        value="12,543"
        color="primary"
      />
    )
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('12,543')).toBeInTheDocument()
  })

  it('displays trend indicator when change provided', () => {
    render(
      <StatCard
        title="Users"
        value="1000"
        change={15}
        color="success"
      />
    )
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('applies correct color class', () => {
    const { container } = render(
      <StatCard title="Test" value="100" color="destructive" />
    )
    expect(container.querySelector('[class*="destructive"]')).toBeInTheDocument()
  })
})
```

#### Store Test
```typescript
// tests/unit/stores/ui.test.ts
import { renderHook, act } from '@testing-library/react'
import { useUIStore } from '@/stores/ui'

describe('UIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: false })
  })

  it('toggles sidebar', () => {
    const { result } = renderHook(() => useUIStore())
    
    expect(result.current.sidebarOpen).toBe(false)
    
    act(() => {
      result.current.setSidebarOpen(true)
    })
    
    expect(result.current.sidebarOpen).toBe(true)
  })

  it('sets and clears selected entity', () => {
    const { result } = renderHook(() => useUIStore())
    
    act(() => {
      result.current.setSelectedEntity({
        type: 'user',
        id: '123',
        label: 'User 123'
      })
    })
    
    expect(result.current.selectedEntity?.id).toBe('123')
    
    act(() => {
      result.current.setSelectedEntity(null)
    })
    
    expect(result.current.selectedEntity).toBeNull()
  })
})
```

#### API Client Test
```typescript
// tests/unit/lib/api-client.test.ts
import { apiClient } from '@/lib/api-client'
import * as schemas from '@/lib/schemas'

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it('validates response with schema', async () => {
    const mockResponse = { id: '1', name: 'Test' }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
      status: 200
    })

    const result = await apiClient.get('/users/1')
    expect(result).toEqual(mockResponse)
  })

  it('throws on invalid schema', async () => {
    const invalidResponse = { invalid: 'data' }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => invalidResponse,
      status: 200
    })

    await expect(apiClient.get('/users/1')).rejects.toThrow()
  })
})
```

### Run Unit Tests
```bash
pnpm test:unit
pnpm test:unit --ui  # Visual dashboard
pnpm test:unit --coverage  # Coverage report
```

---

## Phase 3: Integration Testing

### Page Integration Tests
```typescript
// tests/integration/pages/command-center.test.ts
import { render, screen, waitFor } from '@testing-library/react'
import CommandCenterPage from '@/app/dashboard/command-center/page'
import { useUIStore } from '@/stores/ui'

describe('Command Center Page', () => {
  it('renders KPI cards', async () => {
    render(<CommandCenterPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Active Users')).toBeInTheDocument()
      expect(screen.getByText('Total Orders')).toBeInTheDocument()
    })
  })

  it('opens inspector when queue item clicked', async () => {
    const { user } = render(<CommandCenterPage />)
    
    const queueItem = screen.getByText(/Order #12451/)
    await user.click(queueItem)
    
    expect(useUIStore.getState().selectedEntity?.id).toBe('1')
  })

  it('renders alerts section', async () => {
    render(<CommandCenterPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Critical Alerts')).toBeInTheDocument()
    })
  })
})
```

### Workflow Integration Tests
```typescript
// tests/integration/workflows/bulk-actions.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SupportPage from '@/app/dashboard/support/page'

describe('Bulk Actions Workflow', () => {
  it('completes bulk action with confirmation', async () => {
    const { user } = render(<SupportPage />)
    
    // Select items
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    await user.click(checkboxes[1])
    
    // Trigger action
    const bulkButton = screen.getByText('Bulk Action')
    await user.click(bulkButton)
    
    // Confirm
    await waitFor(() => {
      const confirmButton = screen.getByText('Confirm')
      fireEvent.click(confirmButton)
    })
    
    // Verify result
    expect(screen.getByText('Action completed')).toBeInTheDocument()
  })
})
```

---

## Phase 4: E2E Testing (Playwright)

### Install Playwright
```bash
pnpm add -D @playwright/test
npx playwright install
```

### Example E2E Tests
```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('admin can login', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    await page.fill('input[name="email"]', 'admin@sharoobi.local')
    await page.fill('input[name="password"]', 'Admin@sharoobi')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard/command-center')
    await expect(page.locator('h1')).toContainText('Command Center')
  })

  test('invalid credentials fail', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    await page.fill('input[name="email"]', 'admin@sharoobi.local')
    await page.fill('input[name="password"]', 'WrongPassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.error-message')).toContainText('Invalid credentials')
  })
})
```

### Run E2E Tests
```bash
pnpm test:e2e
pnpm test:e2e --ui      # Interactive mode
pnpm test:e2e --headed  # See browser
```

---

## Testing Checklist

### Before Deployment

#### Authentication
- [ ] Login with valid credentials works
- [ ] Logout clears session
- [ ] Invalid credentials rejected
- [ ] MFA flow (when implemented)

#### Navigation
- [ ] All sidebar links work
- [ ] Breadcrumbs display correctly
- [ ] Back button works
- [ ] Direct URL access works

#### Data Display
- [ ] Tables paginate correctly
- [ ] Filters work as expected
- [ ] Sorting works
- [ ] Search finds results
- [ ] Empty states display

#### Forms
- [ ] Validation works
- [ ] Submission succeeds
- [ ] Error messages display
- [ ] Cleanup on cancel

#### Permissions
- [ ] Role-based access enforced
- [ ] Unauthorized users redirected
- [ ] Actions hidden for insufficient permissions
- [ ] Audit logs capture all changes

#### Performance
- [ ] Page loads under 3s
- [ ] Interactions respond under 200ms
- [ ] No memory leaks
- [ ] Console has no errors

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

---

## Continuous Integration

### GitHub Actions Example
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:integration
      - run: pnpm build
      - run: pnpm test:e2e
```

---

## Performance Testing

### Lighthouse Audits
```bash
# Install Lighthouse
pnpm add -D @lhci/cli@^0.9.0 @lhci/config-upload-service

# Run audit
lhci autorun
```

### Bundle Analysis
```bash
# Install
pnpm add -D @next/bundle-analyzer

# Analyze in next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)

# Run
ANALYZE=true pnpm build
```

---

## Test Data Management

### Seeding Test Data
```typescript
// tests/fixtures/seed.ts
export const seedMockData = () => {
  return {
    users: mockUsers,
    orders: mockOrders,
    payments: mockPayments,
  }
}
```

### Database Reset Between Tests
```typescript
beforeEach(() => {
  // Clear all mock data
  jest.clearAllMocks()
  
  // Reset stores
  useAuthStore.setState({ user: null })
  useUIStore.setState({ sidebarOpen: false })
})
```

---

## Local Testing

### Manual Testing Steps
1. Run `pnpm dev`
2. Open http://localhost:3000
3. Login with admin@sharoobi.local / Admin@sharoobi
4. Navigate through each page
5. Test interactive elements
6. Check console for errors

### Testing Different Roles (Future)
```typescript
// Change in auth store
useAuthStore.setState({
  user: supportAgentUser  // Different role
})
```

---

## Debugging Tips

### React DevTools
```bash
# Install Chrome extension
# https://chrome.google.com/webstore/detail/react-developer-tools
```

### Next.js Debugging
```bash
# Enable verbose logging
DEBUG=* pnpm dev

# Debug specific route
DEBUG=next:* pnpm dev
```

### Network Debugging
```typescript
// In api-client.ts
console.log('[API]', method, path, params)

// In browser DevTools
// Network tab → Filter by XHR/Fetch
```

---

## Test Report

After testing, generate reports:
```bash
# Unit test coverage
pnpm test:unit --coverage

# E2E test results
pnpm test:e2e --reporter=html

# Performance report
lighthouse https://localhost:3000 --view
```

---

## Continuous Improvement

- Run tests before each commit
- Increase coverage with each feature
- Add tests for bug fixes
- Monitor performance metrics
- Regular accessibility audits

**Target Coverage:** 80%+ for production release
