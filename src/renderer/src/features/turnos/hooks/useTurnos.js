import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { turnosAPI } from '@/api/endpoints'

/**
 * Hook para manejar la gestión de Turnos con React Query.
 * Puede obtener la lista de turnos y/o el estado del turno activo.
 *
 * @param {object} [options] - Opciones para el hook.
 * @param {number} [options.page=1] - El número de página para la lista de turnos.
 * @param {boolean} [options.fetchList=true] - Si se debe obtener la lista de turnos.
 * @param {boolean} [options.fetchActive=false] - Si se debe obtener el turno activo.
 */
export function useTurnos({ page = 1, fetchList = true, fetchActive = false } = {}) {
  const queryClient = useQueryClient()

  // =========================
  // GET: Lista de turnos (paginado)
  // =========================
  const {
    data: turnosData,
    isLoading: isLoadingList,
    error: listError,
    refetch: refetchList
  } = useQuery({
    queryKey: ['turnos', page],
    queryFn: () => turnosAPI.getAll({ page }),
    enabled: fetchList,
    keepPreviousData: true,
  })

  // =========================
  // GET: Turno activo
  // =========================
  const {
    data: activeTurno,
    isLoading: isLoadingActive,
    error: activeError,
    refetch: refetchActive
  } = useQuery({
    queryKey: ['activeTurno'],
    queryFn: () => turnosAPI.getActive(),
    enabled: fetchActive,
    retry: (failureCount, error) => {
      // Si el error es 404, significa que no hay turno activo. No es un error real,
      // por lo que no debemos reintentar la consulta.
      if (error?.response?.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })

  // =========================
  // POST: Iniciar turno
  // =========================
  const iniciarTurnoMutation = useMutation({
    mutationFn: turnosAPI.iniciar,
    onSuccess: () => {
      // refrescar lista y turno activo
      queryClient.invalidateQueries({ queryKey: ['turnos'] })
      queryClient.invalidateQueries({ queryKey: ['activeTurno'] })
    }
  })

  // =========================
  // POST: Cerrar turno
  // =========================
  const cerrarTurnoMutation = useMutation({
    mutationFn: turnosAPI.cerrar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] })
      queryClient.invalidateQueries({ queryKey: ['activeTurno'] })
    }
  })

  return {
    // =========================
    // Datos: lista
    // =========================
    turnos: turnosData?.results || [],
    pagination: {
      count: turnosData?.count,
      next: turnosData?.next ?? null,
      previous: turnosData?.previous ?? null
    },

    // Estados lista
    isLoadingList,
    listError,
    refetchList,

    // =========================
    // Datos: turno activo
    // =========================
    activeTurno,
    isLoadingActive,
    activeError,
    refetchActive,
    hasActiveTurno: !!activeTurno && !activeError,

    // =========================
    // Mutaciones
    // =========================
    iniciarTurno: iniciarTurnoMutation.mutate,
    cerrarTurno: cerrarTurnoMutation.mutate,

    // Estados mutaciones
    isIniciando: iniciarTurnoMutation.isPending,
    isCerrando: cerrarTurnoMutation.isPending,

    // Errores mutaciones
    iniciarError: iniciarTurnoMutation.error,
    cerrarError: cerrarTurnoMutation.error
  }
}
