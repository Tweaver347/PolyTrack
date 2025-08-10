'use client'

import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Global providers for the app. This includes the TanStack Query client
 * provider. Additional providers (e.g. theme providers, auth) can be
 * added here later.
 */
export default function Providers({ children }: ProvidersProps) {
  // Lazily instantiate the query client once. This ensures a new
  // client isn't created on every render, which would break caching.
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}