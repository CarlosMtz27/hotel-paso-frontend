import apiClient from '../cliente'

/**
 * Endpoints para Tipos de Habitación y Habitaciones
 */

export const tiposHabitacionAPI = {
  // GET /api/habitaciones/tipos/
  getAll: async () => {
    const response = await apiClient.get('/api/habitaciones/tipos/')
    return response.data
  },

  // GET /api/habitaciones/tipos/{id}/
  getById: async (id) => {
    const response = await apiClient.get(`/api/habitaciones/tipos/${id}/`)
    return response.data
  },

  // POST /api/habitaciones/tipos/
  create: async (data) => {
    const response = await apiClient.post('/api/habitaciones/tipos/', data)
    return response.data
  },

  // PUT /api/habitaciones/tipos/{id}/
  update: async ({ id, data }) => {
    const response = await apiClient.put(`/api/habitaciones/tipos/${id}/`, data)
    return response.data
  },

  // PATCH /api/habitaciones/tipos/{id}/
  partialUpdate: async ({ id, data }) => {
    const response = await apiClient.patch(`/api/habitaciones/tipos/${id}/`, data)
    return response.data
  },

  // DELETE /api/habitaciones/tipos/{id}/
  delete: async (id) => {
    const response = await apiClient.delete(`/api/habitaciones/tipos/${id}/`)
    return response.data
  },
}

export const habitacionesAPI = {
  // GET /api/habitaciones/
  getAll: async () => {
    const response = await apiClient.get('/api/habitaciones/')
    return response.data
  },

  // GET /api/habitaciones/{id}/
  getById: async (id) => {
    const response = await apiClient.get(`/api/habitaciones/${id}/`)
    return response.data
  },

  // POST /api/habitaciones/
  create: async (data) => {
    const response = await apiClient.post('/api/habitaciones/', data)
    return response.data
  },

  // PUT /api/habitaciones/{id}/
  update: async ({ id, data }) => {
    const response = await apiClient.put(`/api/habitaciones/${id}/`, data)
    return response.data
  },

  // PATCH /api/habitaciones/{id}/
  partialUpdate: async ({ id, data }) => {
    const response = await apiClient.patch(`/api/habitaciones/${id}/`, data)
    return response.data
  },

  // DELETE /api/habitaciones/{id}/
  delete: async (id) => {
    const response = await apiClient.delete(`/api/habitaciones/${id}/`)
    return response.data
  },
}