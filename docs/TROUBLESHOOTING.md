# Sharoobi Console - Troubleshooting Guide

## حل المشاكل الشائعة

---

## 🔴 خطأ: "Cannot find module '@/components'"

### السبب
مشكلة في Path Alias

### الحل
تحقق من `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

و `next.config.js`:
```js
module.exports = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  }
}
```

---

## 🔴 خطأ: "Database connection failed"

### السبب
DATABASE_URL غير صحيح أو قاعدة البيانات معطلة

### الحل
```bash
# تحقق من البيئة
echo $DATABASE_URL

# اختبر الاتصال
psql $DATABASE_URL

# أعد إنشاء قاعدة البيانات
npx prisma migrate reset

# أو مع Drizzle
npm run db:push
```

---

## 🔴 خطأ: "Port 3000 already in use"

### السبب
التطبيق يعمل بالفعل أو برنامج آخر يستخدم الميناء

### الحل
```bash
# ابحث عن العملية
lsof -i :3000

# اقتل العملية
kill -9 <PID>

# أو استخدم ميناء مختلف
npm run dev -- -p 3001
```

---

## 🔴 خطأ: "ENOENT: no such file or directory"

### السبب
ملف أو مجلد مفقود

### الحل
```bash
# أعد تثبيت node_modules
rm -rf node_modules package-lock.json
npm install

# أو مع pnpm
pnpm install
```

---

## 🔴 خطأ: "SyntaxError in TypeScript"

### السبب
خطأ في كود TypeScript

### الحل
```bash
# تحقق من الأخطاء
npx tsc --noEmit

# أصلح الأخطاء
npm run type-check
```

---

## 🔴 الأداء بطيئة جداً

### التشخيص
```bash
# اختبر بـ Lighthouse
npm run build
npm run start
lighthouse http://localhost:3000

# تحقق من استخدام الذاكرة
node --inspect=9229 node_modules/.bin/next start
```

### الحلول
1. **تقليل حجم Bundle**
   ```ts
   // استخدم dynamic imports
   const Component = dynamic(() => import('@/components/Heavy'))
   ```

2. **تحسين الاستعلامات**
   ```ts
   // استخدم SELECT محدود
   const users = await db.query(
     'SELECT id, name FROM users LIMIT 100'
   )
   ```

3. **فعّل الـ Caching**
   ```ts
   const data = await fetch('/api/data', {
     next: { revalidate: 3600 }
   })
   ```

---

## 🔴 Theme لا يتغير

### السبب
مشكلة في Theme Provider أو CSS

### الحل
```tsx
// تحقق من app/layout.tsx
export const metadata: Metadata = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1420' }
  ]
}

// تحقق من client-side theme
'use client'
import { useEffect } from 'react'

export function ThemeProvider({ children }) {
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
  }, [])
  
  return children
}
```

---

## 🔴 API لا يرد بيانات

### السبب
مشكلة في Server Action أو API Route

### الحل
```bash
# تحقق من الـ Network في DevTools
# افتح Console وابحث عن الأخطاء

# جرّب الـ API مباشرة
curl http://localhost:3000/api/endpoint

# أضف logging
console.log("[v0] API response:", data)
```

---

## 🔴 الصور لا تظهر

### السبب
مسار الصورة خاطئ أو CORS issue

### الحل
```tsx
// استخدم Next Image
import Image from 'next/image'

<Image 
  src="/images/logo.png"  // من المجلد public/
  alt="Logo"
  width={100}
  height={100}
/>

// أو في CSS
background-image: url('/images/bg.jpg')
```

---

## 🔴 Build يفشل

### السبب
مشاكل Type أو Configuration

### الحل
```bash
# نظّف Cache
rm -rf .next
rm -rf node_modules/.cache

# أعد بناء
npm run build

# إذا فشل، تحقق من الأخطاء
npm run type-check
```

---

## 🔴 Login لا يعمل

### السبب
مشكلة في Auth أو Session

### الحل
```bash
# تحقق من متغيرات البيئة
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL

# تحقق من cookies
# افتح DevTools > Application > Cookies

# امسح الـ Cookies
document.cookie = "authjs.session-token=; path=/"

# أعد تحميل الصفحة
```

---

## 🔴 Tailwind لا يطبق الأنماط

### السبب
Configuration خاطئة

### الحل
```ts
// تحقق من tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
}

// أعد بناء
npm run dev

// امسح Cache
rm -rf .next
```

---

## 🔴 CORS Error

### السبب
API من domain مختلف

### الحل
```ts
// في API route
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const response = NextResponse.json({ data: [] })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}
```

---

## 🔴 TypeScript Errors

### الخطأ الشائع 1: Type 'string' is not assignable
```ts
// ❌ خطأ
const value: number = "123"

// ✅ صحيح
const value: number = parseInt("123")
const value = "123" // string
```

### الخطأ الشائع 2: Object is possibly 'undefined'
```ts
// ❌ خطأ
const user: User = data.user.name

// ✅ صحيح
const user = data?.user?.name
const user = data?.user?.name ?? 'Unknown'
```

---

## 📊 Debug Checklist

- [ ] تحقق من Browser Console للأخطاء
- [ ] تحقق من Network Tab للـ API calls
- [ ] استخدم `console.log("[v0] ...")` للـ debugging
- [ ] تحقق من متغيرات البيئة
- [ ] تحقق من Database Connection
- [ ] أعد تحميل الصفحة (Hard refresh)
- [ ] امسح Browser Cache
- [ ] جرّب في متصفح مختلف
- [ ] تحقق من Vercel Logs
- [ ] جرّب في Incognito/Private mode

---

## 🆘 طلب الدعم

إذا استمرت المشكلة:

1. **اجمع المعلومات**
   ```bash
   node --version
   npm --version
   npm list next react
   ```

2. **اشرح المشكلة**
   - الخطوات المتكررة
   - الخطأ الكامل
   - ما الذي حاولت بالفعل

3. **أرسل الملفات المرتبطة**
   - error log
   - screenshot
   - code snippet

4. **الموارد**
   - [Next.js Docs](https://nextjs.org/docs)
   - [React Docs](https://react.dev)
   - [Tailwind Docs](https://tailwindcss.com)

---

## 🎯 نصائح عامة

1. **اقرأ الخطأ بعناية** - غالباً يقول تماماً ما المشكلة
2. **استخدم عم الـ Google** - ابحث عن الخطأ مباشرة
3. **اختبر الأجزاء منفصلة** - اعزل المشكلة
4. **استعد للإصلاح** - خذ وقتك، سيتم حلها

---

**Happy Debugging! 🐛🔧**
