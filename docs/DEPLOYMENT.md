# Sharoobi Console - Deployment Guide

## نشر التطبيق على الإنتاج

### المتطلبات
- Node.js 20+
- PostgreSQL 14+
- Redis (اختياري)
- Vercel Account (موصى به)
- AWS/Google Cloud Account (للملفات)

---

## 🚀 النشر على Vercel (الموصى به)

### الخطوة 1: إعداد Repository
```bash
git init
git add .
git commit -m "Initial commit: Sharoobi Console"
git branch -M main
git remote add origin https://github.com/yourusername/sharoobi-console.git
git push -u origin main
```

### الخطوة 2: نشر على Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### الخطوة 3: متغيرات البيئة
أضف في Vercel Dashboard:
```env
DATABASE_URL=postgresql://user:password@host/dbname
REDIS_URL=redis://host:port
JWT_SECRET=your-secret-key-here
API_BASE_URL=https://api.sharoobi.com
STRIPE_KEY=sk_live_xxxx
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://console.sharoobi.com
```

### الخطوة 4: Build
```bash
vercel build
vercel deploy --prod
```

---

## 🐳 Docker Deployment

### إنشاء Dockerfile
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### بناء والنشر
```bash
docker build -t sharoobi-console:latest .
docker run -p 3000:3000 -e DATABASE_URL=... sharoobi-console:latest
```

---

## ☁️ AWS ECS Deployment

### الخطوة 1: إنشاء ECR Repository
```bash
aws ecr create-repository --repository-name sharoobi-console
```

### الخطوة 2: دفع الصورة
```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker tag sharoobi-console:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/sharoobi-console:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/sharoobi-console:latest
```

### الخطوة 3: إنشاء ECS Task
استخدم AWS Console أو CLI لإنشاء:
- ECS Cluster
- Task Definition
- Service مع Load Balancer

---

## 🔄 CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`)
```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🛡️ قائمة التحقق قبل الإنتاج

### الأمان
- [ ] HTTPS مفعّل
- [ ] CORS مكوّن بشكل صحيح
- [ ] متغيرات البيئة الحساسة آمنة
- [ ] SQL Injection محمي
- [ ] XSS محمي
- [ ] CSRF Token موجود
- [ ] Rate limiting فعّال

### الأداء
- [ ] Database indices محسّنة
- [ ] Caching strategy فعّالة
- [ ] CDN متصل
- [ ] Images محسّنة
- [ ] Code splitting فعّال
- [ ] Lighthouse Score > 90

### الموثوقية
- [ ] Error logging (Sentry)
- [ ] Health checks
- [ ] Database backups
- [ ] Disaster recovery plan
- [ ] Load testing نجح

---

## 📊 Monitoring

### Sentry Setup
```bash
npm install @sentry/nextjs
```

في `next.config.js`:
```js
const withSentry = require("@sentry/nextjs").withSentry;

module.exports = withSentry({
  org: "your-org",
  project: "sharoobi-console",
});
```

### DataDog Monitoring
```bash
npm install @datadog/browser-rum @datadog/browser-logs
```

### Prometheus Metrics
```bash
npm install next-prometheus prom-client
```

---

## 📈 Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image'

<Image 
  src="/logo.png" 
  alt="Logo"
  width={100}
  height={100}
  priority
  quality={85}
/>
```

### Dynamic Imports
```tsx
const HeavyComponent = dynamic(
  () => import('@/components/Heavy'),
  { loading: () => <Skeleton /> }
)
```

### Database Query Optimization
```tsx
// ❌ Bad
const users = await db.query('SELECT * FROM users')

// ✅ Good
const users = await db.query(
  'SELECT id, name, email FROM users LIMIT 100'
)
```

---

## 🔄 Zero-Downtime Deployment

### Blue-Green Deployment
```bash
# نشر النسخة الجديدة (Blue)
vercel deploy --prod --alias=blue

# اختبار
curl https://blue.sharoobi.com/health

# التبديل (Green)
vercel alias set https://blue.sharoobi.com sharoobi.com
```

### Canary Deployment
```bash
# 10% من المستخدمين على النسخة الجديدة
# ثم 50%
# ثم 100%
```

---

## 🛠️ Rollback

### Vercel Rollback
```bash
vercel rollback
```

### Manual Rollback
```bash
git revert <commit-hash>
git push origin main
vercel deploy --prod
```

---

## 📝 Database Migrations

### Using Prisma
```bash
# إنشاء migration
npx prisma migrate dev --name add_users_table

# تطبيق على الإنتاج
npx prisma migrate deploy

# Rollback
npx prisma migrate resolve --rolled-back migration_name
```

### Using Drizzle
```bash
# إنشاء migration
npm run db:generate

# تطبيق
npm run db:push

# Rollback
npm run db:drop
```

---

## 🔒 SSL/TLS Certificate

### Let's Encrypt (مجاني)
```bash
# Vercel يتعامل معه تلقائياً
# Google Cloud / AWS يتطلب:

certbot certonly --dns-google -d sharoobi.com
# أو
aws acm request-certificate --domain-name sharoobi.com
```

---

## 📊 Scaling

### Horizontal Scaling
- استخدم Load Balancer
- استخدم Docker/Kubernetes
- استخدم Vercel (يتعامل معه تلقائياً)

### Database Scaling
```sql
-- Read Replicas
-- Sharding by tenant_id
-- Partitioning by date
-- Caching layer (Redis)
```

### Cache Strategy
```tsx
// Redis Cache
import { redis } from '@/lib/redis'

async function getUser(id: string) {
  const cached = await redis.get(`user:${id}`)
  if (cached) return JSON.parse(cached)
  
  const user = await db.user.findUnique({ where: { id } })
  await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 3600)
  return user
}
```

---

## ✅ Checklist نهائي

- [ ] جميع الاختبارات تمر
- [ ] Code review تم
- [ ] Documentation محدثة
- [ ] Security scan نجح
- [ ] Performance optimization تم
- [ ] Database backed up
- [ ] Monitoring configured
- [ ] Alert system ready
- [ ] Incident response plan ready
- [ ] Team trained على العملية

---

**للمساعدة والاستفسارات، راجع الدعم الفني أو التوثيق الكاملة.**
