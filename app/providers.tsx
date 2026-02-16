'use client'

import { ReactNode, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

let queryClient: QueryClient | null = null

function getQueryClient() {
  if (!queryClient)
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes - increased to prevent refetches
          gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
          retry: 1,
          refetchOnWindowFocus: false, // Prevent refetch on window focus
        },
      },
    })
  return queryClient
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
