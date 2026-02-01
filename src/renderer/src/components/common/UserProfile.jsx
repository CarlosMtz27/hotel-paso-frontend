import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * Componente de perfil de usuario (se usará en el dashboard empleado)
 */
export default function UserProfile() {
  const { user, userRole, logout, isLoggingOut } = useAuth()

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {user?.username || 'Usuario'}
          </h3>
          <p className="text-sm text-gray-600">
            {userRole === 'ADMIN' ? 'Administrador' : 'Empleado'}
          </p>
          {user?.email && (
            <p className="text-sm text-gray-500">{user.email}</p>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        disabled={isLoggingOut}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
      </button>
    </div>
  )
}