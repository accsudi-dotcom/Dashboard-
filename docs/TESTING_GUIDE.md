# Sharoobi Console - Testing Guide

## استراتيجية الاختبار

### أنواع الاختبارات
1. **Unit Tests** - اختبار الـ functions و utilities بشكل منفرد
2. **Integration Tests** - اختبار التفاعل بين المكونات
3. **E2E Tests** - اختبار سير العمل الكامل
4. **Performance Tests** - اختبار الأداء
5. **Security Tests** - اختبار الأمان

### تغطية الاختبار
- **Target**: 80% coverage
- **Critical**: 100% (Auth, Payments, Security)

---

## 🧪 Unit Testing (Jest)

### الإعداد
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest
```

### `jest.config.js`
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
};
```

### مثال: اختبار Utility Function
```typescript
// lib/utils-extended.ts
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
```

```typescript
// lib/__tests__/utils-extended.test.ts
import { formatCurrency } from '../utils-extended'

describe('formatCurrency', () => {
  it('should format US currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00')
  })

  it('should handle decimal values', () => {
    expect(formatCurrency(999.99)).toBe('$999.99')
  })

  it('should support different currencies', () => {
    expect(formatCurrency(1000, 'SAR')).toContain('1,000')
  })

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
})
```

### مثال: اختبار Hook
```typescript
// hooks/__tests__/use-debounce.test.ts
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../use-debounce'

describe('useDebounce', () => {
  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('updated')
  })
})
```

### مثال: اختبار Component
```typescript
// components/status/__tests__/StatusBadge.test.tsx
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../StatusBadge'

describe('StatusBadge', () => {
  it('should render with correct status', () => {
    render(<StatusBadge status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should apply correct color classes', () => {
    const { container } = render(<StatusBadge status="active" />)
    expect(container.querySelector('.bg-green-600')).toBeInTheDocument()
  })

  it('should render custom label', () => {
    render(<StatusBadge status="active" label="Online" />)
    expect(screen.getByText('Online')).toBeInTheDocument()
  })
})
```

### تشغيل الاختبارات
```bash
# جميع الاختبارات
npm run test

# مع التغطية
npm run test:coverage

# مراقب الملفات
npm run test:watch
```

---

## 🔗 Integration Testing (Vitest)

### الإعداد
```bash
npm install -D vitest @vitest/ui
```

### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### مثال: اختبار Integration
```typescript
// components/__tests__/DataTable.integration.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from '../DataTable'

describe('DataTable Integration', () => {
  const mockData = [
    { id: '1', name: 'Ahmed', email: 'ahmed@test.com' },
    { id: '2', name: 'Fatima', email: 'fatima@test.com' },
  ]

  it('should filter data when searching', async () => {
    const user = userEvent.setup()
    render(<DataTable data={mockData} />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.type(searchInput, 'Ahmed')

    expect(screen.getByText('Ahmed')).toBeInTheDocument()
    expect(screen.queryByText('Fatima')).not.toBeInTheDocument()
  })

  it('should sort data by column', async () => {
    const user = userEvent.setup()
    render(<DataTable data={mockData} sortable />)

    const nameHeader = screen.getByText('Name')
    await user.click(nameHeader)

    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('Ahmed')
    expect(rows[2]).toHaveTextContent('Fatima')
  })
})
```

---

## 🎭 E2E Testing (Playwright)

### الإعداد
```bash
npm install -D @playwright/test
npx playwright install
```

### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### مثال: E2E Test
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.fill('input[name="email"]', 'admin@sharoobi.local')
    await page.fill('input[name="password"]', 'Admin@sharoobi')
    await page.click('button:has-text("Sign In")')

    await expect(page).toHaveURL('/dashboard/command-center')
    await expect(page.locator('text=Command Center')).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.fill('input[name="email"]', 'wrong@email.com')
    await page.fill('input[name="password"]', 'wrong-password')
    await page.click('button:has-text("Sign In")')

    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('should navigate through workspaces', async ({ page }) => {
    await page.goto('/dashboard/command-center')
    
    // Support workspace
    await page.click('text=Support')
    await expect(page).toHaveURL('/dashboard/support')
    
    // Ops workspace
    await page.click('text=Operations')
    await expect(page).toHaveURL('/dashboard/ops')
  })

  test('should search in users page', async ({ page }) => {
    await page.goto('/dashboard/entities/users')
    
    await page.fill('input[placeholder*="Search"]', 'Ahmed')
    await page.waitForSelector('text=Ahmed Hassan')
    
    expect(await page.locator('text=Ahmed Hassan').count()).toBeGreaterThan(0)
  })
})
```

### تشغيل E2E Tests
```bash
# جميع الاختبارات
npx playwright test

# مع واجهة رسومية
npx playwright test --ui

# تشغيل اختبار معين
npx playwright test auth

# في المتصفح المرئي
npx playwright test --headed
```

---

## 📊 Performance Testing

### Lighthouse
```bash
# التثبيت
npm install -g lighthouse

# الاختبار
lighthouse https://localhost:3000 --view
```

### Web Vitals Monitoring
```typescript
// lib/metrics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export function reportMetrics() {
  getCLS(console.log)
  getFID(console.log)
  getFCP(console.log)
  getLCP(console.log)
  getTTFB(console.log)
}
```

### Load Testing (K6)
```bash
npm install -g k6
```

```javascript
// load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 100 },
    { duration: '20s', target: 0 },
  ],
}

export default function() {
  let res = http.get('http://localhost:3000')
  check(res, { 'status was 200': (r) => r.status == 200 })
  sleep(1)
}
```

```bash
k6 run load-test.js
```

---

## 🔒 Security Testing

### OWASP Testing
```bash
npm install -D @owasp/dependency-check
```

### Dependency Scanning
```bash
npm audit
npm audit fix
```

### SQL Injection Testing
```typescript
// Zod validation protects against this
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// Safe from injection
const validated = userSchema.parse(userInput)
```

---

## 📈 Coverage Reports

### إنشاء Report
```bash
npm run test:coverage
```

### Viewing Report
```bash
open coverage/lcov-report/index.html
```

### المتطلبات الأدنى
```json
{
  "statements": 80,
  "branches": 75,
  "functions": 80,
  "lines": 80
}
```

---

## ✅ Pre-commit Hooks

### Husky Setup
```bash
npm install -D husky lint-staged
npx husky install
```

### `.husky/pre-commit`
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```

### `.lintstagedrc.json`
```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{ts,tsx}": "vitest --run --bail",
  "*.md": "prettier --write"
}
```

---

## 🎯 Testing Checklist

- [ ] Unit tests coverage > 80%
- [ ] Integration tests للـ critical flows
- [ ] E2E tests للـ user workflows
- [ ] Performance tests passing
- [ ] Security tests passing
- [ ] Accessibility tests passing
- [ ] Cross-browser testing done
- [ ] Mobile responsive testing done
- [ ] Load testing completed
- [ ] Documentation updated

---

**اختبر بجودة عالية لضمان منتج موثوق وآمن!**
