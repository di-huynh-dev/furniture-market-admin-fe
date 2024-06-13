import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryCLient } from '@/lib/query-client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryCLient}>
      {children} <Toaster />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export default AppProviders
