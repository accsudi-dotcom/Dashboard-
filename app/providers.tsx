'use client'

import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useAuthStore } from '@/stores/auth'

let queryClient: QueryClient | null = null

function getQueryClient() {
  if (!queryClient)
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 10, // 10 minutes
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })
  return queryClient
}

/**
 * Hydration handler component
 * Sets isHydrated flag in auth store after rehydration from localStorage
 */
function HydrationHandler() {
  useEffect(() => {
    // Mark as hydrated after component mounts (localStorage has been read)
    const authStore = useAuthStore.getState()
    authStore.setHydrated(true)
  }, [])

  return null
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <HydrationHandler />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}

