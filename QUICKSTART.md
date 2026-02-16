# Sharoobi Console - Quick Start Guide

Get Sharoobi Console running in 2 minutes!

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Run Development Server

```bash
pnpm dev
```

## 3. Open in Browser

```
http://localhost:3000
```

## 4. Login

**Email**: `admin@sharoobi.local`  
**Password**: `Admin@sharoobi`

That's it! You're now in Sharoobi Console.

---

## What You Can Do

### Explore the Interface
- Click menu items in the left sidebar
- Toggle theme with sun/moon icon in topbar
- Use search bar (Cmd+K on desktop)
- Click user avatar for profile menu

### View Command Center
- See KPI cards with metrics
- View active alerts
- Check live queue status
- Access quick actions

### Open Inspector Panel
- Click any entity reference in UI
- View details, actions, timeline, relationships, and audit history
- Currently shows mock data (Phase 2 will add real data)

### Navigate Workspaces
- **Support**: Ticket management interface (placeholder)
- **Operations**: Order queue interface (placeholder)
- **Finance**: Payment management (placeholder)
- **Moderation**: Content moderation (placeholder)
- **Security**: Security events (placeholder)

### Configure the System
- **App Experience**: Feature flags and layouts (Phase 3)
- **Rules Engine**: Business rules (Phase 3)
- **Pricing**: Price management (Phase 3)
- **Permissions**: RBAC/ABAC config (Phase 3)

### Manage Governance
- **Audit Log**: Admin action history (Phase 3)
- **Security Events**: Security incidents (Phase 3)
- **Sessions**: Active user sessions (Phase 3)
- **Devices**: Device registry (Phase 3)

### Browse Entities
- **Users**: Customer/guest accounts (Phase 4)
- **Providers**: Digital and physical providers (Phase 4)
- **Orders**: Order management (Phase 4)
- **Payments**: Payment tracking (Phase 4)
- **Wallet**: Wallet balances and ledger (Phase 4)

---

## Code Examples

### Check If User Has Permission

```typescript
import { useAuthStore } from '@/stores/auth'

export default function MyComponent() {
  const { canPerform } = useAuthStore()
  
  if (!canPerform('order', 'refund')) {
    return <div>Access Denied</div>
  }
  
  return <button>Refund Order</button>
}
```

### Use Theme Toggle

```typescript
import { useUIStore } from '@/stores/ui'

export default function ThemeToggle() {
  const { theme, setTheme } = useUIStore()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current theme: {theme}
    </button>
  )
}
```

### Open Inspector Panel

```typescript
import { useUIStore } from '@/stores/ui'

export default function UserCard({ user }) {
  const { openInspector } = useUIStore()
  
  return (
    <div 
      onClick={() => openInspector('user', user.id)}
      className="cursor-pointer"
    >
      {user.name}
    </div>
  )
}
```

### Use API Client

```typescript
import { apiClient } from '@/lib/api-client'
import { UserSchema, UserListResponseSchema } from '@/lib/schemas'

// Get list of users
const users = await apiClient.get('/users', UserListResponseSchema)

// Get single user
const user = await apiClient.get(`/users/${id}`, UserSchema)

// Create user
const newUser = await apiClient.post('/users', UserSchema, {
  email: 'user@example.com',
  name: 'John Doe'
})

// Update user
const updated = await apiClient.patch(`/users/${id}`, UserSchema, {
  name: 'Jane Doe'
})
```

---

## Common Tasks

### Add a New Page

1. Create file: `app/dashboard/section/page.tsx`
2. Add this code:

```typescript
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SectionPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Section Name</h1>
          <p className="text-muted-foreground mt-2">Description</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Content</CardTitle>
          </CardHeader>
          <CardContent>
            Content here
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

3. Add to sidebar menu in `components/layout/Sidebar.tsx`

### Add Navigation Link

Edit `components/layout/Sidebar.tsx`, add to `menuSections`:

```typescript
{
  title: 'My Section',
  items: [
    { 
      label: 'My Page', 
      href: '/dashboard/section', 
      icon: SomeIcon 
    },
  ]
}
```

### Create a Form

Use React Hook Form + Zod:

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1)
})

type FormData = z.infer<typeof schema>

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register('email')} placeholder="Email" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Add a Component to Inspector

Edit `components/layout/InspectorPanel.tsx` → Find the tab content sections and update:

```typescript
<TabsContent value="details" className="p-4">
  {/* Add your component here */}
  <YourComponent entityId={inspector.entityId} />
</TabsContent>
```

---

## Project Files Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with theme + auth provider |
| `app/auth/login/page.tsx` | Login page |
| `app/dashboard/layout.tsx` | Main dashboard wrapper |
| `app/dashboard/command-center/page.tsx` | Command center page |
| `components/layout/Sidebar.tsx` | Sidebar navigation |
| `components/layout/Topbar.tsx` | Top header bar |
| `components/layout/InspectorPanel.tsx` | Right side inspector drawer |
| `stores/auth.ts` | Authentication state (Zustand) |
| `stores/ui.ts` | UI state (theme, modals, etc) |
| `lib/api-client.ts` | API wrapper with correlation tracking |
| `lib/schemas.ts` | Zod validation schemas (15+) |
| `types/domain.ts` | TypeScript type definitions (80+) |
| `README.md` | Full documentation |
| `PHASE_1_SUMMARY.md` | What was built |
| `PHASE_2_ROADMAP.md` | What's next |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open command palette |
| `Cmd+/` / `Ctrl+/` | Focus search bar |
| `Esc` | Close dialogs/panels |
| `Click row` | Open inspector |

---

## Troubleshooting

### "Port 3000 already in use"
```bash
# Kill the process or use different port
PORT=3001 pnpm dev
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### "Theme not switching"
```bash
# Check localStorage in browser DevTools
localStorage.getItem('theme')  # Should be 'light' or 'dark'
```

### "Login not working"
```bash
# Check exact credentials:
Email: admin@sharoobi.local
Password: Admin@sharoobi
# Both are case-sensitive
```

### "Build fails"
```bash
# Check for TypeScript errors
pnpm tsc --noEmit

# Check for linting issues
pnpm lint
```

---

## Development Tips

1. **Use Zustand stores instead of props**: `useAuthStore()`, `useUIStore()`
2. **All API calls should use `apiClient`**: Ensures validation and correlation tracking
3. **Use Zod schemas**: Catches bugs at runtime
4. **Import from shadcn/ui**: Consistent component styling
5. **Use Tailwind utilities**: No arbitrary values (`px-4` not `px-[16px]`)
6. **Check permissions**: Use `canPerform()` before showing sensitive actions
7. **Add correlation IDs**: All API calls automatically tracked
8. **Test mobile**: Use Chrome DevTools responsive mode

---

## Next: Phase 2

Ready to add real data? See `PHASE_2_ROADMAP.md` for:
- TanStack Query setup
- Server-side pagination
- Real data fetching
- Bulk actions
- Saved views

---

## Need Help?

1. **Code examples**: Check `/PHASE_2_ROADMAP.md` for code templates
2. **Architecture questions**: See `/README.md` for full documentation
3. **Specific page questions**: Check `/PHASE_1_SUMMARY.md` for what was built
4. **Type definitions**: Browse `/types/domain.ts` for all business types

---

**Status**: ✅ Ready to use  
**Version**: 1.0.0  
**Questions**: Check the relevant documentation file

Good luck! 🚀
