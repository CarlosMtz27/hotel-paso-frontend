import apiClient from '../cliente'

/**
 * Endpoints para Gestión de Usuarios
 */

export const usuariosAPI = {
  // GET /api/auth/users/ (obtener todos 
  getAll: async () => {
    const response = await apiClient.get('/api/auth/users/')
    return response.data
  },

  // GET /api/auth/user/ (usuario actual)
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/user/')
    return response.data
  },

  // POST /api/auth/register/ (crear usuario)
  create: async (data) => {
    const response = await apiClient.post('/api/auth/register/', data)
    return response.data
  },

  // PATCH /api/auth/users/{id}/
  update: async ({ id, data }) => {
    const response = await apiClient.patch(`/api/auth/users/${id}/`, data)
    return response.data
  },

  // PATCH /api/auth/users/{id}/
  partialUpdate: async ({ id, data }) => {
    const response = await apiClient.patch(`/api/auth/users/${id}/`, data)
    return response.data
  },

  // DELETE /api/auth/users/{id}/
  delete: async (id) => {
    const response = await apiClient.delete(`/api/auth/users/${id}/`)
    return response.data
  },

  // PATCH /api/auth/users/{id}/ (cambiar contraseña)
  changePassword: async ({ id, data }) => {
    const response = await apiClient.patch(`/api/auth/users/${id}/`, data)
    return response.data
  },
}