import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * Componente que redirige al dashboard correcto según el rol del usuario
 */
export default function DashboardSelector() {
  const navigate = useNavigate()
  const { userRole, isLoadingUser } = useAuth()

  useEffect(() => {
    if (!isLoadingUser && userRole) {
      if (userRole === 'ADMIN') {
        navigate('/dashboard-admin', { replace: true })
      } else {
        navigate('/dashboard-empleado', { replace: true })
      }
    }
  }, [userRole, isLoadingUser, navigate])

  // Mostrar loading mientras se determina el rol
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Cargando panel de control...</p>
      </div>
    </div>
  )
}