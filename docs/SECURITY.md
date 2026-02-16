# Sharoobi Console - Security Guide

## 🔒 Security Commitment

نحن نأخذ الأمان على محمل الجد. هذا الدليل يوضح ممارساتنا الأمنية.

---

## 🛡️ معايير الأمان

### OWASP Top 10 Prevention
- ✅ SQL Injection Protection (Parameterized Queries)
- ✅ Broken Authentication Prevention
- ✅ Sensitive Data Exposure Prevention
- ✅ XML External Entities (XXE) Prevention
- ✅ Broken Access Control Prevention
- ✅ Security Misconfiguration Prevention
- ✅ Cross-Site Scripting (XSS) Prevention
- ✅ Insecure Deserialization Prevention
- ✅ Using Components with Known Vulnerabilities Prevention
- ✅ Insufficient Logging & Monitoring Prevention

### Standards Compliance
- ✅ PCI DSS 3.2.1 (Payment Card Industry)
- ✅ GDPR (General Data Protection Regulation)
- ✅ SOC 2 Type II Ready
- ✅ ISO 27001 Ready
- ✅ HIPAA (Health Insurance Portability)

---

## 🔐 Authentication & Authorization

### Password Security
```typescript
// استخدم bcrypt مع salt rounds عالية
import bcrypt from 'bcrypt'

const hashedPassword = await bcrypt.hash(password, 12)
const isPasswordValid = await bcrypt.compare(password, hashedPassword)
```

### JWT Tokens
```typescript
// استخدم short-lived access tokens
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' })
const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' })
```

### Two-Factor Authentication
```typescript
// استخدم TOTP (Time-based One-Time Password)
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

const secret = speakeasy.generateSecret({ name: 'Sharoobi' })
const qrCode = await QRCode.toDataURL(secret.otpauth_url)
```

### Session Management
```typescript
// استخدم secure cookies
const cookieOptions = {
  httpOnly: true,      // لا يمكن الوصول عبر JavaScript
  secure: true,        // HTTPS فقط
  sameSite: 'strict',  // منع CSRF
  maxAge: 7 * 24 * 3600000 // 7 أيام
}
```

---

## 🚫 Input Validation

### Zod Schema Validation
```typescript
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/),
  age: z.number().min(0).max(150)
})

// آمن من XSS و Injection
const validated = userSchema.parse(userInput)
```

### Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify'

// تنظيف HTML input
const clean = DOMPurify.sanitize(userInput)
```

---

## 🔒 Data Encryption

### At Rest
```typescript
// استخدم encryption للبيانات الحساسة في قاعدة البيانات
import crypto from 'crypto'

const key = crypto.scryptSync(password, 'salt', 32)
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
```

### In Transit
```typescript
// استخدم HTTPS/TLS دائماً
// in next.config.js
const withSecureHeaders = require('next-secure-headers')

module.exports = withSecureHeaders({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
})
```

---

## 🛡️ Security Headers

### Required Headers
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  return response
}
```

---

## 🔄 CSRF Protection

### CSRF Token
```typescript
import { generateToken } from '@/lib/csrf'

export async function GET(request: Request) {
  const csrfToken = await generateToken(request)
  return NextResponse.json({ csrfToken })
}

export async function POST(request: Request) {
  const token = request.headers.get('X-CSRF-Token')
  if (!await verifyToken(token, request)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }
  // Process request
}
```

---

## 🚫 XSS Prevention

### Never Trust User Input
```tsx
// ❌ خطر - XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ آمن
<div>{userInput}</div>

// ✅ إذا كنت بحاجة إلى HTML
import DOMPurify from 'isomorphic-dompurify'
<div>{DOMPurify.sanitize(userInput)}</div>
```

### Content Security Policy
```typescript
// في next.config.js
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' https: data:;
  connect-src 'self' https:;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
```

---

## 🔐 Rate Limiting

### API Rate Limiting
```typescript
import Ratelimit from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'),
})

export async function middleware(request: NextRequest) {
  const ip = request.ip
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  return NextResponse.next()
}
```

---

## 🔍 Logging & Monitoring

### Audit Logging
```typescript
async function auditLog(action: string, userId: string, details: any) {
  await db.auditLog.create({
    data: {
      action,
      userId,
      details,
      timestamp: new Date(),
      ipAddress: request.ip,
      userAgent: request.headers.get('user-agent'),
    },
  })
}
```

### Error Monitoring
```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

---

## 🔒 API Security

### API Key Validation
```typescript
export function validateApiKey(key: string): boolean {
  const validKey = process.env.API_KEY
  return crypto.timingSafeEqual(
    Buffer.from(key),
    Buffer.from(validKey)
  )
}
```

### Request Validation
```typescript
// في API route
export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type')
  if (contentType !== 'application/json') {
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 400 }
    )
  }

  const data = await request.json()
  const validated = userSchema.parse(data)
  // Process
}
```

---

## 🛡️ Database Security

### Prepared Statements
```typescript
// ✅ آمن - استخدم parameterized queries
const user = await db.user.findUnique({
  where: { id: userId }
})

// ❌ خطر - SQL injection vulnerable
const user = await db.$queryRaw(`SELECT * FROM users WHERE id = ${userId}`)
```

### Row Level Security (RLS)
```sql
-- في Supabase
CREATE POLICY "Users can see their own data"
ON profiles FOR SELECT
USING (auth.uid() = user_id)
```

---

## 📋 Security Checklist

### Development
- [ ] استخدم environment variables للأسرار
- [ ] لا تضع passwords في الكود
- [ ] استخدم HTTPS في كل مكان
- [ ] اختبر input validation
- [ ] طبّق rate limiting
- [ ] اختبر XSS prevention
- [ ] اختبر CSRF protection

### Before Deployment
- [ ] قم بـ Security Audit
- [ ] اختبر Penetration Testing
- [ ] تحقق من Dependencies للثغرات
- [ ] راجع Secrets Management
- [ ] تحقق من Access Controls
- [ ] اختبر Data Encryption
- [ ] راجع Logging & Monitoring

### In Production
- [ ] فعّل Monitoring
- [ ] فعّل Alerts
- [ ] فعّل Backups
- [ ] فعّل Disaster Recovery
- [ ] فعّل Incident Response
- [ ] قم بـ Regular Security Updates
- [ ] قم بـ Penetration Testing (Quarterly)

---

## 🚨 Reporting Security Issues

### إذا وجدت ثغرة أمنية

**لا تفتح issue علني!**

بدلاً من ذلك:
1. أرسل بريد إلى: security@sharoobi.com
2. قدّم التفاصيل الكاملة
3. اترك وقتاً معقولاً للإصلاح (90 يوم)
4. سيتم التعامل مع القضية بسرية

### Bug Bounty Program
- Pending تفعيل برنامج مكافآت الأخطاء
- Rewards حسب شدة الثغرة

---

## 📚 مراجع الأمان

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

### Tools
- [OWASP ZAP](https://www.zaproxy.org/)
- [Burp Suite](https://portswigger.net/burp)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)

---

## 🔄 Security Updates

### Dependency Updates
```bash
# تحقق من الثغرات
npm audit

# أصلح الثغرات
npm audit fix

# تحديث الحزم
npm update
```

### Staying Updated
- اتبع [Node.js Security](https://nodejs.org/en/security/)
- اتبع [OWASP News](https://owasp.org/www-community/)
- اتبع مستودعات المشاريع للتنبيهات

---

## ✅ Security Best Practices Summary

1. **Never Trust User Input** - اختبر وتحقق من كل شيء
2. **Use HTTPS Always** - لا تستخدم HTTP في الإنتاج
3. **Keep Secrets Secret** - استخدم environment variables
4. **Log Everything** - للتدقيق والمراقبة
5. **Update Regularly** - تحديث Dependencies والنظام
6. **Least Privilege** - امنح الأقل من الأذونات اللازمة
7. **Defense in Depth** - استخدم طبقات أمان متعددة
8. **Encrypt Sensitive Data** - في الانتقال والتخزين

---

**الأمان ليس ميزة - إنه ضرورة أساسية!** 🛡️

