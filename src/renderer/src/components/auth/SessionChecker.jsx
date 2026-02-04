import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

import LoadingScreen from '@/components/common/LoadingScreen'
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
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, isLoadingUser, navigate])

  // Mientras verifica, mostrar loading
  if (isLoadingUser) return <LoadingScreen message="Verificando sesión..." />

  // Si no está autenticado, mostrar el contenido (login)
  return children
}