import { useQuery } from '@tanstack/react-query'
import { cajaAPI } from '@/api/endpoints'

/**
 * Hook para obtener los movimientos de caja de un turno específico.
 * @param {object} options
 * @param {number} options.turnoId - El ID del turno para filtrar los movimientos.
 */
export function useCaja({ turnoId }) {
  const {
    data: movimientosData,
    isLoading,
    error,
    refetch
  } = useQuery({
    // La query key incluye el turnoId para que se actualice automáticamente
    // si el turno cambia y para evitar colisiones de caché.
    queryKey: ['caja-movimientos', turnoId],
    // La función que se ejecuta para obtener los datos.
    queryFn: () => cajaAPI.getMovimientos({ turno: turnoId }),
    // La query solo se ejecutará si `turnoId` tiene un valor.
    enabled: !!turnoId
  })

  return {
    movimientos: movimientosData?.results || [],
    isLoadingMovimientos: isLoading,
    movimientosError: error,
    refetchMovimientos: refetch
  }
}

