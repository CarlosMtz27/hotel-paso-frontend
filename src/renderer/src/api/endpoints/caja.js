import apiClient from '../cliente'

/**
 * Endpoints para la gestión de Caja (movimientos, ventas, etc.)
 */
export const cajaAPI = {
  /**
   * Obtiene los movimientos de caja, con opción de filtrar.
   * @param {object} params - Parámetros de filtro (ej. { turno: 1 }).
   */
  getMovimientos: async (params) => {
    const response = await apiClient.get('/api/caja/movimientos/', { params })
    return response.data
  },

  /**
   * Crea un nuevo movimiento de caja (venta de producto).
   * @param {object} data - Datos de la venta.
   */
  venderProducto: async (data) => {
    const response = await apiClient.post('/api/caja/movimientos/', data)
    return response.data
  }
}