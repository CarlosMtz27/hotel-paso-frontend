import apiClient from '../cliente'

/**
 * Endpoints relacionados con autenticación
 */

export const authAPI = {
  // Login normal
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login/', credentials)
    return response.data
  },

  // Login como invitado (con nombre y clave admin)
  loginGuest: async (data) => {
    const response = await apiClient.post('/api/auth/login-invitado/', data)
    return response.data
  },

  // Registro
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/register/', userData)
    return response.data
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/api/auth/refresh/', {
      refresh: refreshToken,
    })
    return response.data
  },

  // Logout (envía token a blacklist)
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    const response = await apiClient.post('/api/auth/logout/', {
      refresh: refreshToken,
    })
    return response.data
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/user/')
    return response.data
  },
}