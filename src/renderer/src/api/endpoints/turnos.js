import apiClient from '../cliente'

/**
 * Endpoints para la gestión de Turnos
 */
export const turnosAPI = {
  /**
   * Obtiene una lista de todos los turnos.
   * GET /api/turnos/
   */
  getAll: async ({ page = 1 } = {}) => {
    const response = await apiClient.get('/api/turnos/', {
      params: { page }
    })
    return response.data
  },

  /**
   * Inicia un nuevo turno.
   * POST /api/turnos/iniciar/
   */
  iniciar: async (data) => {
    const response = await apiClient.post('/api/turnos/iniciar/', data)
    return response.data
  },

  /**
   * Cierra el turno activo.
   * POST /api/turnos/cerrar/
   */
  cerrar: async (data) => {
    const response = await apiClient.post('/api/turnos/cerrar/', data)
    return response.data
  },

  /**
   * Obtiene el turno activo para el usuario actual.
   * GET /api/turnos/activo/
   */
  getActive: async () => {
    const response = await apiClient.get('/api/turnos/activo/')
    return response.data
  }
}
