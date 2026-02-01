import apiClient from '../cliente'

/**
 * Endpoints para Productos
 */

export const productosAPI = {
  // GET /api/productos/
  getAll: async () => {
    const response = await apiClient.get('/api/productos/')
    return response.data
  },

  // GET /api/productos/{id}/
  getById: async (id) => {
    const response = await apiClient.get(`/api/productos/${id}/`)
    return response.data
  },

  // POST /api/productos/
  create: async (data) => {
    const response = await apiClient.post('/api/productos/', data)
    return response.data
  },

  // PUT /api/productos/{id}/
  update: async ({ id, data }) => {
    const response = await apiClient.put(`/api/productos/${id}/`, data)
    return response.data
  },

  // PATCH /api/productos/{id}/
  partialUpdate: async ({ id, data }) => {
    const response = await apiClient.patch(`/api/productos/${id}/`, data)
    return response.data
  },

  // DELETE /api/productos/{id}/
  delete: async (id) => {
    const response = await apiClient.delete(`/api/productos/${id}/`)
    return response.data
  },
}