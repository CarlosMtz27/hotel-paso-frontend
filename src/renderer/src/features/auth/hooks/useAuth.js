import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authAPI } from '@/api/endpoints'
import { useNavigate } from 'react-router-dom'
import { startTokenRefresh, stopTokenRefresh } from '@/utils/tokenRefresh'

/**
 * Hook personalizado para manejar autenticación
 */
export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Query para obtener usuario actual
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // Si es invitado, obtener de localStorage
      const userType = localStorage.getItem('user_type')
      if (userType === 'invitado') {
        return {
          username: localStorage.getItem('invitado_nombre') || 'INVITADO',
          tipo_usuario: 'invitado',
          is_staff: false,
        }
      }
      
      // Si es usuario normal, obtener del backend
      return await authAPI.getCurrentUser()
    },
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
  })

  // Determinar el rol del usuario
  const getUserRole = () => {
    const userType = localStorage.getItem('user_type')
    
    if (userType === 'invitado') {
      return 'empleado' // Los invitados tienen vista de empleado
    }
    
    // Para usuarios normales, verificar si es admin
    if (user?.is_staff || user?.is_superuser || user?.rol === 'ADMIN') {
      return 'admin'
    }
    
    return 'empleado'
  }

  const userRole = user ? getUserRole() : null

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user_type', 'normal')
      
      startTokenRefresh()
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Login error:', error)
    },
  })

  // Mutation para login como invitado
  const loginGuestMutation = useMutation({
    mutationFn: authAPI.loginGuest,
    onSuccess: (data, variables) => {
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user_type', 'invitado')
      localStorage.setItem('invitado_nombre', variables.nombre)
      
      startTokenRefresh()
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      navigate('/dashboard')
    },
  })

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      if (data.access && data.refresh) {
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        localStorage.setItem('user_type', 'normal')
        
        startTokenRefresh()
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    },
  })

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      stopTokenRefresh()
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_type')
      localStorage.removeItem('invitado_nombre')
      queryClient.clear()
      navigate('/login')
    },
    onError: () => {
      stopTokenRefresh()
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_type')
      localStorage.removeItem('invitado_nombre')
      queryClient.clear()
      navigate('/login')
    },
  })

  const login = (credentials) => {
    return loginMutation.mutate(credentials)
  }

  const loginAsGuest = (guestData) => {
    return loginGuestMutation.mutate(guestData)
  }

  const register = (userData) => {
    return registerMutation.mutate(userData)
  }

  const logout = () => {
    return logoutMutation.mutate()
  }

  const isAuthenticated = !!localStorage.getItem('access_token') && !!user

  return {
    // Estado
    user,
    userRole, // 'admin' o 'empleado'
    isLoadingUser,
    userError,
    isAuthenticated,

    // Funciones
    login,
    loginAsGuest,
    register,
    logout,

    // Estados de mutations
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    isLoggingInAsGuest: loginGuestMutation.isPending,
    loginGuestError: loginGuestMutation.error,
    
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    
    isLoggingOut: logoutMutation.isPending,
  }
}