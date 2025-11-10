import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { inferRouterOutputs } from '@trpc/server'
import Cookies from 'js-cookie'
import superjson from 'superjson'

import { env } from './env'

import type { TrpcRouter } from '@plants-project/backend/src/router'
export const trpc = createTRPCReact<TrpcRouter>()

export type RouterOutput = inferRouterOutputs<TrpcRouter>

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const trpcClient = createTRPCClient<TrpcRouter>({
  links: [
    httpBatchLink({
      transformer: superjson,
      url: env.VITE_BACKEND_TRPC_URL,
      headers: () => {
        const token = Cookies.get('token')
        return {
          ...(token && { authorization: `Bearer ${token}` }),
        }
      },
    }),
  ],
})

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
