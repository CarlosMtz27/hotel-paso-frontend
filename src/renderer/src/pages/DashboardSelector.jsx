import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/routes'

export default function DashboardSelector() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (user.rol === 'ADMIN') {
    return <Navigate to={ROUTES.PANEL_ADMIN} replace />
  }

  return <Navigate to={ROUTES.PANEL_EMPLEADO} replace />
}