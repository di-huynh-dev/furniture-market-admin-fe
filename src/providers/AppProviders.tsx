import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryCLient } from '@/lib/query-client'

const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryCLient}>
      {children} <Toaster />
    </QueryClientProvider>
  )
}

export default AppProviders
