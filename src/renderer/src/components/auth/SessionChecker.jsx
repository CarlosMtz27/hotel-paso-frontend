import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * Componente que verifica si hay una sesión activa
 * y redirige automáticamente
 */
export function SessionChecker({ children }) {
  const navigate = useNavigate()
  const { isAuthenticated, isLoadingUser } = useAuth()

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated && !isLoadingUser) {
      // Cambiar a modo dashboard
      if (window.api?.setWindowMode) {
        window.api.setWindowMode('dashboard')
      }
      navigate('/dashboard', { replace: true })
    } else if (!isAuthenticated && !isLoadingUser) {
      // Si no está autenticado, asegurar modo login
      if (window.api?.setWindowMode) {
        window.api.setWindowMode('login')
      }
    }
  }, [isAuthenticated, isLoadingUser, navigate])

  // Mientras verifica, mostrar loading
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, mostrar el contenido (login)
  return children
}