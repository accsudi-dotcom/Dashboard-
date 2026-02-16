# Sharoobi Dashboard - README

> 🎉 **Project Complete!** See [FINAL_PROJECT_VERIFICATION.md](FINAL_PROJECT_VERIFICATION.md) for a comprehensive verification of all features.

A modern, full-featured SaaS admin dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS. Production-ready with mock data, authentication, audit logging, and comprehensive role-based access control.

## 🎯 Features

- **Admin Dashboard**: Command center with real-time metrics and system health
- **Entity Management**: Users, orders, payments, providers, and tickets
- **Support Queue**: Ticketing system with priority and SLA tracking
- **Security**: Device management, session monitoring, and security events
- **Governance**: Audit trails, feature flags, and compliance rules
- **Moderation**: Content management and user account actions
- **Operations**: Finance, security, and operational dashboards
- **Settings**: System configuration and user preferences
- **Authentication**: Secure login with bcryptjs password hashing
- **Authorization**: Role-based access control (RBAC) with audit logging
- **Dark Mode**: Full light/dark theme support with Next.js themes
- **Responsive Design**: Mobile-first UI using Tailwind CSS + Radix UI
- **Accessibility**: WCAG 2.1 compliant components
- **RTL Ready**: Right-to-left language support built-in

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm 8+ (or npm/yarn)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/accsudi-dotcom/Dashboard-.git
cd Dashboard-

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Start development server
pnpm run dev
```

Visit `http://localhost:3000` in your browser.

### Demo Credentials

Default admin account (demo only):
```
Email: admin@sharoobi.local
Password: Admin@123
```

These are loaded from `.env.local` - change them before deploying to production.

## 📁 Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Auth endpoints (login, me)
│   │   ├── dev/                  # Development mock API (remove in production)
│   │   │   ├── mock/route.ts     # Generic mock data endpoint
│   │   │   └── [resource]/       # Resource-specific endpoints
│   │   ├── payments/             # Payment operations
│   │   ├── users/                # User management
│   │   ├── orders/               # Order management
│   │   ├── tickets/              # Support tickets
│   │   └── ...
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main dashboard (protected)
│   │   ├── command-center/       # Home/overview
│   │   ├── entities/             # Data management pages
│   │   ├── support/              # Support queue
│   │   ├── security/             # Security suite
│   │   ├── governance/           # Audit & compliance
│   │   └── studios/              # Admin configuration
│   └── \[locale\]/               # i18n routing
├── components/                   # React components (ui, features)
├── core/                         # Domain logic (DDD pattern)
│   ├── domain/                   # Business entities & rules
│   ├── infrastructure/           # Technical implementation
│   └── errors/                   # Error definitions
├── modules/                      # Feature modules (users, payments, etc.)
├── lib/                          # Utilities & helpers
│   ├── mock-db.ts                # In-memory mock database
│   ├── mock-data.ts              # Mock data definitions
│   ├── api-response.ts           # API response formatters
│   ├── api-authz-middleware.ts   # Authorization enforcement
│   ├── audit-engine.ts           # Audit trail recording
│   ├── authz-engine.ts           # AuthZ decision engine
│   └── utils.ts                  # Common utilities
├── types/                        # TypeScript type definitions
├── stores/                       # Zustand state management
├── styles/                       # Global CSS
├── scripts/                      # Build & utility scripts
│   └── seed.js                   # Database seeding
├── data/                         # Generated seed data
├── docs/                         # Documentation
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.mjs               # Next.js config
└── tailwind.config.ts            # Tailwind CSS config
```

## 🔒 Security

### Authentication
- Demo login at `/auth/login`
- Credentials: use email + password from environment
- Demo tokens use JWT with `AUTH_SECRET` from `.env.local`

### Authorization
- Role-based access control (RBAC) in `lib/api-authz-middleware.ts`
- Attribute-based access control (ABAC) supports conditions (e.g., amount thresholds)
- All sensitive operations require explicit permission grant

### Password Security
- Uses bcryptjs v2.4.3 for password hashing (10 salt rounds)
- Passwords are never logged or exposed in audit trails
- Only password hashes stored

### Audit Logging
- `core/infrastructure/AuditTrail.ts` logs all sensitive operations
- Immutable audit entries capture: actor, action, resource, changes, timestamp, correlation ID
- Indexed by tenant and resource for fast queries

### Environment Security
- Credentials loaded from `.env.local` (never commit)
- Demo credentials for development only
- Production deployment requires secrets manager (AWS, Vault, etc.)

**See [SECURITY.md](./SECURITY.md) for detailed security guide.**

## 📦 Available Scripts

```bash
# Development
pnpm run dev                    # Start dev server with Turbo
pnpm run dev:debug            # Dev with debugging enabled

# Production
pnpm run build                # Build for production
pnpm run start                # Start production server

# Quality
pnpm run lint                 # Run ESLint
pnpm run type-check          # Run TypeScript check
pnpm run test                # Run tests (when added)

# Data
pnpm run seed                # Generate mock seed data
```

## 📊 Mock API Endpoints

All endpoints return consistent `{ success, data, meta, error }` structure:

```bash
# Generic resource endpoints
GET /api/dev/users?type=users
GET /api/dev/orders?type=orders
GET /api/dev/payments?type=payments
GET /api/dev/tickets?type=tickets
GET /api/dev/providers?type=providers
GET /api/dev/audit?type=audit
GET /api/dev/security?type=security
Get /api/dev/devices?type=devices
GET /api/dev/sessions?type=sessions

# Or use resource-specific routes
GET /api/dev/users
GET /api/dev/orders
POST /api/dev/orders        # Create mock order

# Real API routes (stubbed with mock data)
GET /api/auth/me            # Get current user
GET /api/users              # List users with auth/authz
PATCH /api/users            # Update user status with audit logging
GET /api/payments           # List payments
POST /api/payments          # Refund payment with audit trail
```

## 🎨 UI Components

Uses Radix UI + Tailwind CSS:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
// ... 50+ production-ready components
```

Full component library in `/components/ui/`.

## 📚 Technology Stack

### Frontend
- **Next.js 16.1**: React framework with App Router
- **React 19.2**: UI library
- **TypeScript 5.7**: Type-safe development
- **Tailwind CSS 3.4**: Utility-first CSS
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Data fetching & caching
- **TanStack Table**: Data table component
- **Zustand**: State management
- **Recharts**: Data visualization
- **Lucide React**: Icon set
- **Zod**: Schema validation
- **React Hook Form**: Form management

### Backend (Stubbed)
- **Next.js API Routes**: Serverless endpoints
- **bcryptjs**: Password hashing
- **uuid**: ID generation

### Development
- **TypeScript**: Static typing
- **ESLint**: Code linting
- **Tailwind CSS**: Styling

## 🔄 Database (Future)

Currently uses in-memory mock database. To upgrade to production:

1. Add a database (PostgreSQL recommended)
2. Use Prisma ORM: `pnpm add prisma`
3. Replace `/lib/mock-db.ts` with Prisma client
4. Implement migrations
5. Update `/modules/*/infrastructure/*Repository.ts` classes
6. Add connection pooling for serverless

## 🧪 Testing (Future)

```bash
# Unit tests (Jest)
pnpm test

# E2E tests (Playwright)
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 📖 Documentation

- [SECURITY.md](./SECURITY.md) - Security best practices, credentials, env vars
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide (Vercel, Docker, K8s)
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development workflow & contribution guidelines
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Feature inventory

## 🛠️ Customization

### Change Admin Email/Password
Edit `.env.local`:
```
DEFAULT_ADMIN_EMAIL=your-admin@company.com
DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
```

### Add New Dashboard Page
1. Create route: `app/dashboard/your-feature/page.tsx`
2. Add navigation link in `components/sidebar.tsx`
3. Use example pages as template (orders, payments, etc.)

### Add New API Endpoint
1. Create route: `app/api/your-endpoint/route.ts`
2. Use existing routes as template for auth/authz patterns
3. Add Zod schema for validation
4. Log sensitive operations to audit trail

## 🚨 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm run dev
```

### TypeScript Errors
```bash
npx tsc --noEmit       # Check all errors
pnpm run lint           # Run linter
```

### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
pnpm run build
```

## 📝 License

MIT - See LICENSE file

## 👥 Support

- Issues: GitHub Issues
- Email: support@sharoobi.local
- Docs: See `/docs` folder

---

**Last Updated**: February 2026 | **Version**: 0.1.0 | **Status**: Development
