import { useQuery } from '@tanstack/react-query'
import { reportesAPI } from '@/api/endpoints'

/**
 * Hook para manejar Reportes con React Query
 */

// Hook para reportes de turnos
export function useTurnos(params = {}) {
  return useQuery({
    queryKey: ['reportes-turnos', params],
    queryFn: () => reportesAPI.getTurnos(params),
  })
}

// Hook para resumen diario
export function useResumenDiario(fecha = null) {
  return useQuery({
    queryKey: ['resumen-diario', fecha],
    queryFn: () => reportesAPI.getResumenDiario(fecha ? { fecha } : {}),
  })
}

// Hook para empleados (totales)
export function useEmpleados() {
  return useQuery({
    queryKey: ['reportes-empleados'],
    queryFn: reportesAPI.getEmpleados,
  })
}

// Hook para detalle de empleado
export function useDetalleEmpleado(empleadoId) {
  return useQuery({
    queryKey: ['detalle-empleado', empleadoId],
    queryFn: () => reportesAPI.getDetalleEmpleado(empleadoId),
    enabled: !!empleadoId,
  })
}

// Hook para ranking de empleados
export function useRankingEmpleados() {
  return useQuery({
    queryKey: ['ranking-empleados'],
    queryFn: reportesAPI.getRankingEmpleados,
  })
}

// Hook para gráfica de ingresos
export function useGraficaIngresos() {
  return useQuery({
    queryKey: ['grafica-ingresos'],
    queryFn: reportesAPI.getGraficaIngresos,
  })
}