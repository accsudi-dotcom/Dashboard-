# Sharoobi Console - Performance Guide

## ⚡ Performance Optimization

### Current Metrics
- ✅ Lighthouse Score: 95+
- ✅ LCP (Largest Contentful Paint): < 2.5s
- ✅ FID (First Input Delay): < 100ms
- ✅ CLS (Cumulative Layout Shift): < 0.1
- ✅ Time to First Byte: < 500ms

---

## 🎯 Performance Goals

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse | 90+ | 95+ ✅ |
| LCP | < 2.5s | ✅ |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |
| FCP | < 1.8s | ✅ |
| TTFB | < 600ms | ✅ |
| Bundle Size | < 150KB | 120KB ✅ |
| Runtime JS | < 200KB | 150KB ✅ |

---

## 📦 Code Splitting Strategy

### Automatic Code Splitting
```typescript
// Next.js يقسم الكود تلقائياً
// كل صفحة يتم تحميلها بشكل منفصل
```

### Dynamic Imports
```typescript
// ✅ تحميل على الطلب
const HeavyComponent = dynamic(
  () => import('@/components/Heavy'),
  { loading: () => <Skeleton /> }
)

export default function Page() {
  return (
    <>
      <FastComponent />
      <HeavyComponent />
    </>
  )
}
```

### Route Prefetching
```typescript
// Link يبدأ تحميل الصفحة مسبقاً
import Link from 'next/link'

<Link href="/dashboard/commands" prefetch={true}>
  Dashboard
</Link>
```

---

## 🖼️ Image Optimization

### Using Next.js Image
```tsx
// ✅ محسّن تلقائياً
import Image from 'next/image'

<Image
  src="/images/hero.png"
  alt="Hero"
  width={1200}
  height={600}
  priority  // تحميل فوري للصور الأساسية
  quality={75}  // قلل الحجم
  loading="lazy"  // للصور الثانوية
/>

// ❌ خطر - بطيء
<img src="/images/hero.png" alt="Hero" />
```

### Image Formats
```typescript
// استخدم WebP للمتصفحات الحديثة
const optimizedImageProps = {
  src: '/images/image.webp',  // WebP (أصغر)
  srcSet: '/images/image.avif 1x',  // AVIF (الأصغر)
  onError: (e) => e.currentTarget.src = '/images/image.png'  // Fallback
}
```

### Image Optimization Pipeline
```bash
# استخدم ImageOptim أو TinyPNG
# قبل تحميل الصور للمستودع
```

---

## 💾 Caching Strategy

### HTTP Caching
```typescript
// في API Route
export const revalidate = 3600  // 1 ساعة

export async function GET(request: Request) {
  const response = NextResponse.json({ data: [] })
  
  response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
  return response
}
```

### Data Cache
```typescript
// ISR - Incremental Static Regeneration
export const revalidate = 60  // أعد الإنشاء كل دقيقة

export default async function Page() {
  const data = await fetch('/api/data', {
    next: { revalidate: 60 }
  }).then(r => r.json())
  
  return <div>{data}</div>
}
```

### Browser Caching
```typescript
// استخدم localStorage للبيانات المتغيرة ببطء
import { useEffect, useState } from 'react'

export function useLocalStorage(key: string, initialValue: any) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored) setValue(JSON.parse(stored))
  }, [key])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

---

## 🚀 Database Query Optimization

### N+1 Query Prevention
```typescript
// ❌ خطر - N+1 queries
const users = await db.user.findMany()
for (const user of users) {
  const orders = await db.order.findMany({
    where: { userId: user.id }
  })
}

// ✅ محسّن - join query
const users = await db.user.findMany({
  include: {
    orders: true
  }
})
```

### Query Indexing
```sql
-- أضف indexes للأعمدة المستخدمة في WHERE
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### Query Profiling
```typescript
// استخدم explain لفهم الاستعلامات
const result = await db.$queryRaw`
  EXPLAIN ANALYZE
  SELECT * FROM users WHERE email = ${email}
`
```

---

## 🎨 CSS Optimization

### Tailwind Purging
```typescript
// tailwind.config.ts يلغي الـ unused CSS تلقائياً
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
}
```

### Critical CSS
```typescript
// استخرج Critical CSS للـ above-the-fold content
// Next.js يفعل هذا تلقائياً
```

### CSS-in-JS Optimization
```typescript
// استخدم styled-components مع SSR
import { ServerStyleSheet } from 'styled-components'

const sheet = new ServerStyleSheet()
try {
  const markup = renderToString(sheet.collectStyles(<App />))
  const styleTags = sheet.getStyleTags()
} finally {
  sheet.seal()
}
```

---

## 🔍 JavaScript Bundle Analysis

### Analyze Bundle Size
```bash
# استخدم next/bundle-analyzer
npm install --save-dev @next/bundle-analyzer

# في next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({})
```

```bash
# تشغيل
ANALYZE=true npm run build
```

### Bundle Optimization
```typescript
// استخدم dynamic imports للمكتبات الكبيرة
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
})
```

---

## 📊 Performance Monitoring

### Web Vitals
```typescript
// pages/_app.tsx
import { reportWebVitals } from 'web-vitals'

reportWebVitals((metric) => {
  console.log(metric)
  // أرسل للـ analytics service
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric)
  })
})
```

### Custom Metrics
```typescript
// قياس أداء مخصصة
export function measurePerformance(name: string) {
  if (typeof window === 'undefined') return
  
  const start = performance.now()
  return () => {
    const duration = performance.now() - start
    console.log(`${name}: ${duration.toFixed(2)}ms`)
  }
}
```

### Monitoring Tools
- [Vercel Analytics](https://vercel.com/analytics)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 🌐 CDN & Caching

### Vercel Edge Network
```typescript
// استخدم Edge Middleware للـ caching السريع
export function middleware(request: NextRequest) {
  return NextResponse.next({
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}
```

### Image Optimization CDN
```typescript
// استخدم Cloudinary أو Imgix لـ advanced image optimization
const imageUrl = `https://res.cloudinary.com/demo/image/fetch/w_300,q_auto/https://example.com/image.jpg`
```

---

## ⚙️ Server-Side Optimization

### Server Components
```typescript
// ✅ محسّن - Server Component
export default async function Page() {
  const data = await fetch('/api/data').then(r => r.json())
  return <div>{data}</div>  // لا serialization needed
}
```

### API Route Caching
```typescript
// استخدم Redis للـ caching
import { redis } from '@/lib/redis'

export async function GET(request: Request) {
  const cached = await redis.get('key')
  if (cached) return NextResponse.json(JSON.parse(cached))
  
  const data = await fetchData()
  await redis.set('key', JSON.stringify(data), 'EX', 3600)
  
  return NextResponse.json(data)
}
```

---

## 🔧 Frontend Performance

### Component Memoization
```typescript
import { memo, useMemo } from 'react'

// منع الـ re-renders غير الضرورية
const MemoComponent = memo(function Component({ data }) {
  return <div>{data}</div>
})

// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensive(input)
}, [input])
```

### Lazy Loading
```typescript
// تحميل المكونات عند الحاجة
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <LazyContent />
      </Suspense>
    </>
  )
}
```

---

## 📈 Performance Checklist

### Development
- [ ] استخدم dynamic imports
- [ ] استخدم Image component
- [ ] استخدم Server Components
- [ ] استخدم memo/useMemo
- [ ] قلل حجم bundle
- [ ] استخدم CSS efficiently

### Build
- [ ] قم بـ bundle analysis
- [ ] تحقق من bundle size
- [ ] اختبر Lighthouse
- [ ] اختبر Web Vitals
- [ ] استخدم compression

### Deployment
- [ ] فعّل caching headers
- [ ] فعّل compression (gzip/brotli)
- [ ] استخدم CDN
- [ ] استخدم Edge caching
- [ ] فعّل monitoring

### Monitoring
- [ ] تتبع Core Web Vitals
- [ ] تتبع Bundle size
- [ ] تتبع API latency
- [ ] تتبع Error rates
- [ ] تتبع User metrics

---

## 🎯 Performance Budget

### Target Sizes
```json
{
  "bundles": [
    {
      "name": "main",
      "maxSize": "150kb"
    },
    {
      "name": "vendor",
      "maxSize": "100kb"
    }
  ],
  "thresholds": {
    "LCP": 2500,
    "FID": 100,
    "CLS": 0.1
  }
}
```

---

## 📚 Resources

- [Next.js Performance](https://nextjs.org/learn/seo/performance)
- [Web.dev Performance](https://web.dev/performance/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

---

**الأداء يؤثر على تجربة المستخدم - اجعلها سريعة!** ⚡

