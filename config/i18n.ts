export const defaultLocale = 'en'
export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

export const isValidLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale)
}

export const localeConfig: Record<Locale, { name: string; dir: 'ltr' | 'rtl'; native: string }> = {
  en: {
    name: 'English',
    dir: 'ltr',
    native: 'English',
  },
  ar: {
    name: 'العربية',
    dir: 'rtl',
    native: 'العربية',
  },
}

// Translation namespace structure
export const translations: Record<Locale, Record<string, any>> = {
  en: {
    common: {
      home: 'Home',
      logout: 'Logout',
      settings: 'Settings',
      dashboard: 'Dashboard',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    auth: {
      login: 'Login',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      signIn: 'Sign In',
      invalidCredentials: 'Invalid email or password',
    },
    menu: {
      commandCenter: 'Command Center',
      entities: 'Entities',
      support: 'Support',
      security: 'Security',
      governance: 'Governance',
      studios: 'Studios',
      finance: 'Finance',
    },
  },
  ar: {
    common: {
      home: 'الرئيسية',
      logout: 'تسجيل الخروج',
      settings: 'الإعدادات',
      dashboard: 'لوحة التحكم',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
    },
    auth: {
      login: 'دخول',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      rememberMe: 'تذكرني',
      signIn: 'تسجيل الدخول',
      invalidCredentials: 'بريد إلكتروني أو كلمة مرور غير صحيحة',
    },
    menu: {
      commandCenter: 'مركز القيادة',
      entities: 'الكيانات',
      support: 'الدعم',
      security: 'الأمان',
      governance: 'الحوكمة',
      studios: 'الاستوديوهات',
      finance: 'المالية',
    },
  },
}

export function getTranslation(locale: Locale, namespace: string, key: string): string {
  return translations[locale]?.[namespace]?.[key] ?? key
}
