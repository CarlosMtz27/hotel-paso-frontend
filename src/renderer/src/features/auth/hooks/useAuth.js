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
    queryFn: authAPI.getCurrentUser,
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
  })

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // Guardar tokens
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      
      // Iniciar sistema de refresh automático
      startTokenRefresh()
      
      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      
      // Redirigir
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Login error:', error)
    },
  })

  // Mutation para login como invitado
  const loginGuestMutation = useMutation({
    mutationFn: authAPI.loginGuest,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      
      startTokenRefresh()
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      navigate('/dashboard')
    },
  })

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      // Si devuelve tokens directamente
      if (data.access && data.refresh) {
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        
        startTokenRefresh()
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        navigate('/dashboard')
      } else {
        // Si no, redirigir a login
        navigate('/login')
      }
    },
  })

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      // Detener refresh automático
      stopTokenRefresh()
      
      // Limpiar tokens
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      
      // Limpiar caché
      queryClient.clear()
      
      // Redirigir
      navigate('/login')
    },
    onError: () => {
      // Incluso si falla el logout en el backend, limpiar localmente
      stopTokenRefresh()
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      queryClient.clear()
      navigate('/login')
    },
  })

  // Funciones helper
  const login = (credentials) => {
    return loginMutation.mutate(credentials)
  }

  const loginAsGuest = () => {
    return loginGuestMutation.mutate()
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