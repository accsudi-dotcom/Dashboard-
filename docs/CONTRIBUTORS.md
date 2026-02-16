# Contributing to Sharoobi Console

شكراً لاهتمامك بالمساهمة في Sharoobi Console! 🎉

## 📋 قواعد المساهمة

### 1. الشروط الأساسية
- [ ] Node.js 20+
- [ ] Git
- [ ] pnpm (أو npm)
- [ ] معرفة ب TypeScript و React

### 2. إعداد بيئة التطوير

```bash
# Clone المشروع
git clone https://github.com/your-org/sharoobi-console.git
cd sharoobi-console

# تثبيت الـ Dependencies
pnpm install

# إنشاء فرع جديد
git checkout -b feature/your-feature-name

# تشغيل التطبيق
pnpm dev
```

### 3. قواعس الكود

#### TypeScript
```typescript
// ✅ Good
const formatPrice = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`
}

// ❌ Bad
const formatPrice = (amount) => {
  return `$${(amount / 100).toFixed(2)}`
}
```

#### React Components
```tsx
// ✅ Good
interface UserProfileProps {
  userId: string
  onUpdate?: (user: User) => void
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  return <div>User: {userId}</div>
}

// ❌ Bad
export function UserProfile(props) {
  return <div>User: {props.userId}</div>
}
```

#### Naming Conventions
- `components/` - PascalCase (UserProfile.tsx)
- `hooks/` - camelCase with 'use' prefix (useUserData.ts)
- `utils/` - camelCase (formatDate.ts)
- `types/` - PascalCase (User.ts)

### 4. Commit Messages

استخدم Conventional Commits:

```
feat: add user profile page
fix: resolve theme color issue
docs: update README
style: format code with prettier
refactor: reorganize components
test: add unit tests for auth
chore: update dependencies
```

### 5. Code Review Process

1. اعمل على الميزة في فرعك
2. اختبر كل شيء محلياً
3. اعمل Push للفرع
4. افتح Pull Request
5. اطلب Review من 2+ أشخاص
6. معالجة التعليقات
7. Merge عندما يتم الموافقة

### 6. Testing Requirements

```bash
# أنت يجب:
- اكتب اختبارات للكود الجديد
- تشغيل الاختبارات المحلية
- تحقق من Coverage

pnpm test
pnpm test:coverage
```

### 7. Documentation Requirements

لكل ميزة جديدة:
- [ ] Update README.md
- [ ] Add JSDoc comments
- [ ] Update FEATURES.md
- [ ] Add usage examples
- [ ] Document API changes

---

## 🐛 الإبلاغ عن الأخطاء

### Issue Template

```markdown
## الوصف
وصف واضح للمشكلة.

## الخطوات لتكراره
1. اذهب إلى...
2. انقر على...
3. شاهد الخطأ

## السلوك المتوقع
ماذا كان يجب أن يحدث؟

## السلوك الفعلي
ماذا حدث بدلاً من ذلك؟

## الملفات المرفقة
- screenshot.png
- error-log.txt

## البيئة
- OS: Windows 10
- Node: 20.5.0
- npm: 10.2.0
```

---

## 💡 اقتراح ميزات

### Feature Request Template

```markdown
## الملخص
وصف قصير للميزة.

## السبب
لماذا هذه الميزة مهمة؟

## الحل المقترح
كيف يجب تنفيذها؟

## البدائل
هل هناك حلول بديلة؟

## السياق الإضافي
أي معلومات إضافية؟
```

---

## 📚 أنواع المساهمات

### 1. Code Contributions
- إضافة ميزات جديدة
- إصلاح الأخطاء
- تحسين الأداء
- إعادة البناء

### 2. Documentation
- تحديث المستندات
- إضافة أمثلة
- تحسين التوضيح
- ترجمة

### 3. Testing
- إضافة اختبارات
- اختبار يدوي
- تقارير الأخطاء
- testing automation

### 4. Design
- تحسين الواجهة
- accessibility improvements
- responsive design
- dark mode

### 5. Community
- مساعدة المستخدمين
- الرد على الأسئلة
- الترويج
- الشراكات

---

## ✅ Checklist قبل الـ PR

- [ ] اختبرت المشروع محلياً
- [ ] ركضت `pnpm test`
- [ ] ركضت `pnpm lint`
- [ ] ركضت `pnpm type-check`
- [ ] حدّثت التوثيق
- [ ] أضفت اختبارات
- [ ] التزمت باسلوب الكود
- [ ] لا توجد أخطاء في Console

---

## 🎨 Community Standards

### الاحترام المتبادل
- نحترم جميع الآراء
- نرحب بالتنوع
- لا نسيء لأحد
- نتعامل مع الاختلافات بإيجابية

### المشاركة الإيجابية
- نساعد بعضنا البعض
- نحتفل بالإنجازات
- نتعلم من الأخطاء
- ننقل المعرفة

### الشفافية
- نتحدث بصراحة
- نستمع لبعضنا
- نتخذ قرارات معاً
- نتقاسم المسؤولية

---

## 🏆 Recognition

المساهمون المنتظمون يحصلون على:
- شارات المساهم
- إشارة في README
- دعوة للاجتماعات الشهرية
- أولوية في المشاكل
- الإشراف على المشاريع

---

## 📞 الاتصال

### Channels
- 📧 Email: dev@sharoobi.com
- 💬 Discord: [Join Server](https://discord.gg/sharoobi)
- 🐙 GitHub: [Discussions](https://github.com/sharoobi/console/discussions)
- 🐦 Twitter: [@ShaaroobiCo](https://twitter.com/sharoobi)

### Maintainers
- [@ahmedhassan](https://github.com/ahmedhassan) - Core Lead
- [@fatimaali](https://github.com/fatimaali) - Features
- [@mohammed](https://github.com/mohammed) - Infrastructure

---

## 📜 Code of Conduct

### المبادئ
1. كن محترماً
2. كن مفيداً
3. كن صادقاً
4. كن آمناً
5. كن شاملاً

### التنفيذ
انتهاكات قواعد السلوك قد تؤدي إلى:
- تحذير
- تعليق الحساب
- حظر دائم

---

## 🚀 Getting Started

1. اختر مشكلة من [Issues](https://github.com/sharoobi/console/issues)
2. اترك تعليق: "I'd like to work on this"
3. انتظر الموافقة
4. اعمل على الحل
5. افتح Pull Request

---

شكراً لمساهمتك! أنت تساعد في بناء شيء عظيم! 🌟

