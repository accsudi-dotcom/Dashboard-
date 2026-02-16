'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Root Page Redirect
 * Routes to either login or dashboard based on auth status
 */
export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard (will check auth in layout)
    router.push('/dashboard/command-center')
  }, [router])

  return null
}
