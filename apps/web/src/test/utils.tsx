import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider, type QueryKey } from '@tanstack/react-query'
import React from 'react'

export function renderWithQuery(
  ui: React.ReactElement,
  data: ReadonlyArray<readonly [QueryKey, unknown]> = [],
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity, retry: false },
    },
  })

  for (const [key, value] of data) {
    queryClient.setQueryData(key, value)
  }

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}
