import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider'
import { router } from './routes'
import { useEffect } from 'react'
import { startTokenRefresh } from './utils/tokenRefresh'

function App() {
  // Iniciar el sistema de refresh de tokens cuando la app carga
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      console.log('🚀 App loaded with token, starting refresh system')
      startTokenRefresh()
    }
  }, [])

  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
}

export default App