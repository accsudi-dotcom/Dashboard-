'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { localeConfig, locales, type Locale, defaultLocale } from '@/config/i18n'

export function LocaleSwitcher() {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedLocale = localStorage.getItem('locale') as Locale | null
    if (storedLocale && locales.includes(storedLocale)) {
      setLocale(storedLocale)
    }
  }, [])

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.setAttribute('lang', newLocale)
    document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr')
    if (newLocale === 'ar') {
      document.documentElement.classList.add('rtl')
    } else {
      document.documentElement.classList.remove('rtl')
    }
    // Reload to apply direction changes
    window.location.reload()
  }

  if (!mounted) return null

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <Button
          key={loc}
          variant={locale === loc ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLocale(loc)}
          title={localeConfig[loc].name}
        >
          {loc.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}
