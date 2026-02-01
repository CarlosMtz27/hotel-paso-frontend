import apiClient from '../cliente'

/**
 * Endpoints para Tarifas
 */

export const tarifasAPI = {
  // GET /api/tarifas/
  getAll: async () => {
    const response = await apiClient.get('/api/tarifas/')
    return response.data
  },

  // GET /api/tarifas/{id}/
  getById: async (id) => {
    const response = await apiClient.get(`/api/tarifas/${id}/`)
    return response.data
  },

  // POST /api/tarifas/
  create: async (data) => {
    const response = await apiClient.post('/api/tarifas/', data)
    return response.data
  },

  // PUT /api/tarifas/{id}/
  update: async ({ id, data }) => {
    const response = await apiClient.put(`/api/tarifas/${id}/`, data)
    return response.data
  },

  // PATCH /api/tarifas/{id}/
  partialUpdate: async ({ id, data }) => {
    const response = await apiClient.patch(`/api/tarifas/${id}/`, data)
    return response.data
  },

  // DELETE /api/tarifas/{id}/
  delete: async (id) => {
    const response = await apiClient.delete(`/api/tarifas/${id}/`)
    return response.data
  },
}