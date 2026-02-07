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
 * @param {object} [options.user] - El usuario actual para validar la propiedad del turno.
 */
export function useTurnos({ page = 1, fetchList = true, fetchActive = false, user } = {}) {
  const queryClient = useQueryClient()
  const userId = user?.id

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
    data: activeTurnoData,
    isLoading: isLoadingActive,
    error: activeError,
    refetch: refetchActive
  } = useQuery({
    queryKey: ['activeTurno', userId],
    queryFn: () => turnosAPI.getActive(),
    enabled: fetchActive && !!userId,
    retry: (failureCount, error) => {
      // Si el error es 404, significa que no hay turno activo. No es un error real,
      // por lo que no debemos reintentar la consulta.
      if (error?.response?.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })

  // Validar que el turno pertenezca al usuario actual (si se proporciona userId)
  // Esto evita que un Admin vea el turno de un Empleado si el backend lo devuelve por defecto.
  const activeTurno = (activeTurnoData && user)
    ? ((activeTurnoData.usuario == user.id || 
        activeTurnoData.user == user.id || 
        activeTurnoData.usuario_id == user.id ||
        activeTurnoData.usuario?.id == user.id ||
        activeTurnoData.user?.id == user.id) ||
        // Validación por string (si el backend devuelve representación de texto)
        (typeof activeTurnoData.usuario === 'string' && 
         ((user.username && activeTurnoData.usuario.toLowerCase().includes(user.username.toLowerCase())) ||
          (user.first_name && activeTurnoData.usuario.includes(user.first_name)) ||
          (user.last_name && activeTurnoData.usuario.includes(user.last_name))))
        ? activeTurnoData 
        : null)
    : activeTurnoData

  
  // POST: Iniciar turno
  const iniciarTurnoMutation = useMutation({
    mutationFn: turnosAPI.iniciar,
    onSuccess: () => {
      // refrescar lista y turno activo
      queryClient.invalidateQueries({ queryKey: ['turnos'] })
      queryClient.invalidateQueries({ queryKey: ['activeTurno'] })
    }
  })

  // POST: Cerrar turno
  const cerrarTurnoMutation = useMutation({
    mutationFn: turnosAPI.cerrar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] })
      queryClient.invalidateQueries({ queryKey: ['activeTurno'] })
    }
  })

  return {
    // Datos: lista
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

    // Datos: turno activo
    activeTurno,
    isLoadingActive,
    activeError,
    refetchActive,
    hasActiveTurno: !!activeTurno && !activeError,

    // Mutaciones
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
