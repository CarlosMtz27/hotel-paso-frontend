import apiClient from '../cliente'

/**
 * Endpoints para Estancias
 */

export const estanciasAPI = {
  // GET /api/estancias/
  getAll: async () => {
    const response = await apiClient.get('/api/estancias/')
    return response.data
  },

  // GET /api/estancias/{id}/
  getById: async (id) => {
    const response = await apiClient.get(`/api/estancias/${id}/`)
    return response.data
  },

  // POST /api/estancias/abrir/
  abrir: async (data) => {
    const response = await apiClient.post('/api/estancias/abrir/', data)
    return response.data
  },

  // POST /api/estancias/agregar-horas/
  agregarHoras: async (data) => {
    const response = await apiClient.post('/api/estancias/agregar-horas/', data)
    return response.data
  },

  // POST /api/estancias/cerrar/
  cerrar: async (data) => {
    const response = await apiClient.post('/api/estancias/cerrar/', data)
    return response.data
  },

  // DELETE /api/estancias/{id}/
  delete: async (id) => {
    const response = await apiClient.delete(`/api/estancias/${id}/`)
    return response.data
  },
}