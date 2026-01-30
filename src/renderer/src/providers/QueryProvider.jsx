import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

/**
 * Configuración de React Query
 */
const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos"
      staleTime: 1000 * 60 * 5, // 5 minutos
      
      // Tiempo que los datos se mantienen en caché
      gcTime: 1000 * 60 * 10, // 10 minutos (antes era cacheTime)
      
      // Reintentar peticiones fallidas
      retry: 1,
      
      // Refetch cuando la ventana obtiene foco
      refetchOnWindowFocus: false,
      
      // Refetch al reconectar
      refetchOnReconnect: true,
    },
    mutations: {
      // Reintentar mutations fallidas
      retry: 0,
    },
  },
}

export function QueryProvider({ children }) {
  // Crear instancia de QueryClient (solo una vez)
  const [queryClient] = useState(() => new QueryClient(queryClientConfig))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools solo en desarrollo */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}