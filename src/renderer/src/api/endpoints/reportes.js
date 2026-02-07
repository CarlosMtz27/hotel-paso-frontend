import apiClient from '../cliente'

/**
 * Endpoints para Reportes
 */

export const reportesAPI = {
  // REPORTES DE TURNOS
  
  // GET /turnos/ (JSON)
  getTurnos: async (params = {}) => {
    const response = await apiClient.get('/api/reportes/turnos/', { params })
    return response.data
  },

  // GET /turnos/excel/ (Archivo Excel)
  getTurnosExcel: async (params = {}) => {
    const response = await apiClient.get('/api/reportes/turnos/excel/', {
      params,
      responseType: 'blob', // Importante para archivos binarios
    })
    return response.data
  },

  // GET /turnos/pdf/ (Archivo PDF)
  getTurnosPDF: async (params = {}) => {
    const response = await apiClient.get('/api/reportes/turnos/pdf/', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  // RESUMEN DIARIO  
  // GET /resumen/diario/
  getResumenDiario: async (params = {}) => {
    const response = await apiClient.get('/api/reportes/resumen/diario/', { params })
    return response.data
  },

  // REPORTES POR EMPLEADO  
  // GET /empleados/ (Totales por empleado)
  getEmpleados: async () => {
    const response = await apiClient.get('/api/reportes/empleados/')
    return response.data
  },

  // GET /empleados/{id}/ (Detalle de un empleado)
  getDetalleEmpleado: async (empleadoId) => {
    const response = await apiClient.get(`/api/reportes/empleados/${empleadoId}/`)
    return response.data
  },

  // GET /empleados/ranking/
  getRankingEmpleados: async () => {
    const response = await apiClient.get('/api/reportes/empleados/ranking/')
    return response.data
  },

  // GET /empleados/grafica-ingresos/
  getGraficaIngresos: async () => {
    const response = await apiClient.get('/api/reportes/empleados/grafica-ingresos/')
    return response.data
  },
}