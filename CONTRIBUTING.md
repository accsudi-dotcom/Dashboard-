# Contributing Guide

## Getting Started

### Prerequisites
- Node.js 18+ (LTS)
- pnpm 8+
- Git
- Basic understanding of React, TypeScript, Next.js

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/accsudi-dotcom/Dashboard-.git
cd Dashboard-

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Start development server
pnpm run dev
```

Visit `http://localhost:3000` in browser.

---

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

Branch naming convention:
- `feature/user-management` - New features
- `fix/auth-bug` - Bug fixes
- `refactor/api-layer` - Code improvements
- `docs/deployment-guide` - Documentation

### 2. Make Changes

**Code Style**
- Follow existing patterns in codebase
- Use TypeScript strict mode
- Add JSDoc comments for complex functions
- Keep functions small and focused

**Example: Adding a New API Endpoint**

```typescript
// app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSuccessResponse, createErrorResponse, getCorrelationId } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const correlationId = getCorrelationId(request.headers)
    
    // Your logic here
    const data = { /* ... */ }
    
    return NextResponse.json(
      createSuccessResponse(data, { requestId: correlationId })
    )
  } catch (error) {
    const correlationId = getCorrelationId(request.headers)
    return NextResponse.json(
      createErrorResponse('INTERNAL_ERROR', 'Something went wrong', correlationId),
      { status: 500 }
    )
  }
}
```

**Example: Adding a New UI Component**

```typescript
// components/features/MyFeature.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MyFeatureProps {
  title: string
  description?: string
}

export function MyFeature({ title, description }: MyFeatureProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      // Your logic
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Click Me'}
        </Button>
      </CardContent>
    </Card>
  )
}
```

### 3. Test Your Changes

```bash
# Type checking
npx tsc --noEmit

# Linting
pnpm run lint

# Format code (optional)
npx prettier --write "**/*.{ts,tsx}"
```

### 4. Run Tests
```bash
# Unit tests (when added)
pnpm test

# E2E tests (when added)
pnpm test:e2e

# Check coverage
pnpm test:coverage
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Commit message format:
```
<type>: <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `perf`, `chore`

Example:
```
feat: add user export to CSV

- Implement CSV generation in UserService
- Add /api/users/export endpoint
- Wire ExportButton component

Closes #123
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then open PR on GitHub with:
- Clear title
- Description of changes
- Link to related issues
- Screenshots (if UI changes)

---

## Code Standards

### TypeScript
- Use `strict: true` in tsconfig.json
- Avoid `any` type (use `unknown` if needed)
- Add return type annotations to functions
- Use interfaces over type for objects

```typescript
// ✅ Good
function getUserById(id: string): Promise<User> {
  // ...
}

// ❌ Avoid
function getUserById(id: any): any {
  // ...
}
```

### React Components
- Prefer functional components with hooks
- Use TypeScript interfaces for props
- Add JSDoc comments for complex components

```typescript
// ✅ Good
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function MyButton({ label, onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>
}

// ❌ Avoid
export function MyButton(props: any) {
  return <button {...props} />
}
```

### API Routes
- Use consistent response format (see `createSuccessResponse`)
- Log sensitive operations to audit trail
- Validate input with Zod schemas
- Check authorization before operations

```typescript
// ✅ Good
import { z } from 'zod'
import { enforceAuthz } from '@/lib/api-authz-middleware'

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  const user = extractUserFromRequest(request)
  if (!enforceAuthz(user, 'users', 'create').allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  const body = await request.json()
  const validated = CreateUserSchema.parse(body)
  // ...
}
```

### Styling
- Use Tailwind CSS utilities
- Leverage component library (Radix UI)
- Dark mode support via `dark:` prefix
- Mobile-first responsive design

```tsx
// ✅ Good
<div className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-900 md:p-6">
  <h2 className="text-lg font-semibold md:text-xl">Title</h2>
</div>

// ❌ Avoid custom CSS when Tailwind can do it
<div style={{ display: 'flex', padding: '16px' }}>
```

---

## File Structure

### Adding Features
```
features/your-feature/
├── components/
│   ├── FeatureHeader.tsx
│   ├── FeatureList.tsx
│   └── FeatureDetail.tsx
├── hooks/
│   └── useFeature.ts
├── types.ts
└── index.ts
```

### API Routes
```
app/api/your-endpoint/
├── route.ts           # GET, POST, etc.
├── [id]/
│   └── route.ts       # Parameterized routes
└── utils.ts           # Shared logic
```

---

## Common Tasks

### Adding a New Page
1. Create `app/dashboard/your-page/page.tsx`
2. Add navigation link in `components/sidebar.tsx`
3. Use existing pages as template
4. Add TypeScript types to `types/domain.ts` if needed

### Adding an Environment Variable
1. Add to `.env.example`
2. Add to deployment guide `DEPLOYMENT.md`
3. Use via `process.env.YOUR_VAR`
4. Optional: export from `lib/config.ts`

### Adding a Database Model (Future)
1. Define in `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name add_model`
3. Implement repository class in `modules/*/infrastructure`
4. Add service class in `modules/*/application`

---

## Debugging

### Enable Debug Logging
```bash
DEBUG=* pnpm run dev
```

### Browser DevTools
- Open Chrome/Firefox DevTools (F12)
- Check Network tab for API calls
- Check Console for errors
- Use React DevTools extension

### VS Code Debugging
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

---

## Performance Tips

### Optimize Builds
```bash
# Analyze bundle size
ANALYZE=true pnpm run build

# Check page dependencies
next/image for optimized images
next/link for prefetching
```

### Database Queries (Future)
- Use Prisma `select` to fetch only needed fields
- Add indexes to frequently queried columns
- Use connection pooling for serverless

### React Performance
- Use `React.memo` for expensive components
- Lazy load routes with `dynamic()`
- Optimize with Next.js Image component

---

## Security Checklist Before Submitting PR

- [ ] No hardcoded credentials in code
- [ ] No sensitive logs exposed
- [ ] Input validation on all endpoints
- [ ] Authorization checks on protected routes
- [ ] SQL injection prevention (use Prisma)
- [ ] XSS prevention (React auto-escapes, sanitize if needed)
- [ ] CSRF protection (Next.js built-in)
- [ ] Rate limiting on auth endpoints
- [ ] Audit logging for sensitive operations

---

## Review Process

### What Reviewers Look For
- Code quality and readability
- TypeScript types are correct
- No security vulnerabilities
- Tests added/updated
- Documentation updated
- Follows project standards

### Getting Your PR Approved
1. Respond to review comments
2. Make requested changes
3. Request re-review
4. Wait for approval
5. Squash and merge

---

## Deployment

After PR is merged:

```bash
# For Vercel: Automatic deployment on main
# For manual: Follow DEPLOYMENT.md
git log --oneline -n 5  # Verify commits
```

---

## Questions?

- Check existing issues/PRs for similar problems
- Ask in discussions
- Email: dev@sharoobi.local
- Slack: #engineering channel

---

## License

By contributing, you agree that your contributions will be licensed under the same MIT license.

Happy coding! 🚀
