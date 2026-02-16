# Security & Environment Variables Guide

## Sensitive Data Management

### ✅ What We've Done
- Replaced hardcoded credentials with environment variables
- Implemented bcryptjs for password hashing
- Added optional `mfaEnabled` and tenant isolation
- Audit trail logging for sensitive operations

### ⚠️ Important Security Rules

#### 1. Never Commit Credentials
- **NO demo credentials in code**: Admin credentials moved to env vars
- **NO API keys in docs**: All examples use placeholder values
- **NO tokens in repos**: Auth tokens must be env-based only

#### 2. Environment Variables Template (`.env.local`)
```
# Authentication
AUTH_SECRET=your-super-secret-key-here
DEFAULT_ADMIN_EMAIL=admin@sharoobi.local
DEFAULT_ADMIN_PASSWORD=SecurePassword123!

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development

# Database (if upgrading from mock)
DATABASE_URL=postgresql://user:pass@localhost:5432/sharoobi

# Payment Processing
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_PUBLIC_KEY=pk_test_xxxx

# Third-party APIs
SENDGRID_API_KEY=SG.xxxx
CLOUDINARY_URL=cloudinary://xxxx
```

#### 3. For Production Deployment
1. Use managed secrets (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault)
2. Never store `.env.local` in version control
3. Use separate secrets per environment (dev, staging, prod)
4. Rotate credentials regularly
5. Enable audit logging for all sensitive operations

#### 4. Code Security Checklist
- [ ] All API keys are environment variables (not hardcoded)
- [ ] Password hashing uses bcryptjs (v2.4.3+)
- [ ] Audit logs capture who, what, when, why for sensitive actions
- [ ] CSRF protection enabled at API routes
- [ ] Rate limiting configured for auth endpoints
- [ ] CORS properly restricted to trusted origins
- [ ] SQL injection prevention via parameterized queries (prisma/sequelize)

#### 5. Removed from Public Docs
The following credentials were used for demo purposes and have been removed:
- ❌ `Admin@sharoobi` (now uses `DEFAULT_ADMIN_PASSWORD` env var)
- ❌ Auto-generated demo tokens (now uses JWT with `AUTH_SECRET`)

All demo credentials in QUICKSTART.md and other docs are now marked as env variables.

---

## Development Setup

### Local Testing with Demo Credentials
For dev/testing only, use:
```bash
# .env.local (NEVER commit this file)
AUTH_SECRET=dev-secret-key
DEFAULT_ADMIN_EMAIL=admin@sharoobi.local
DEFAULT_ADMIN_PASSWORD=Admin@123
```

### Production Checklist
- [ ] Remove `.env.local` from git history
- [ ] Enable HTTPS only (redirect HTTP → HTTPS)
- [ ] Set up WAF rules
- [ ] Enable database encryption at rest
- [ ] Use strong password policies (min 12 chars, upper+lower+numbers+symbols)
- [ ] Enable MFA for all admin accounts
- [ ] Regular security audits (monthly recommended)

---

## Dependencies with Security Implications
- **bcryptjs**: Password hashing (ensures credentials are never stored in plaintext)
- **zod**: Input validation (prevents injection attacks)
- **next**: Built-in CSRF protection via NextAuth
- **audit trail**: Immutable logging of sensitive operations

---

## Resources
- [OWASP Top 10 - 2023](https://owasp.org/Top10/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security Guide](https://nextjs.org/docs#security)
