'use client'

import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { getTranslation, isValidLocale, type Locale, defaultLocale } from '@/config/i18n'

export function useI18n() {
  const params = useParams()
  const localeParam = params.locale
  const localeStr = Array.isArray(localeParam) ? localeParam[0] : (localeParam || defaultLocale)
  const locale = (isValidLocale(localeStr) ? localeStr : defaultLocale) as Locale

  const t = useCallback(
    (namespace: string, key: string): string => {
      return getTranslation(locale, namespace, key)
    },
    [locale]
  )

  return {
    locale,
    t,
    isRTL: locale === 'ar',
  }
}
