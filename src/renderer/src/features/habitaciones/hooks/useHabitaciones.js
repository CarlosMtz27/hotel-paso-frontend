import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { habitacionesAPI } from '@/api/endpoints'

/**
 * Hook para manejar Habitaciones con React Query
 */
export function useHabitaciones() {
  const queryClient = useQueryClient()

  // GET: Obtener todas las habitaciones
  const {
    data: habitaciones,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['habitaciones'],
    queryFn: habitacionesAPI.getAll,
  })

  // POST: Crear habitación
  const createMutation = useMutation({
    mutationFn: habitacionesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitaciones'] })
    },
  })

  // PUT/PATCH: Actualizar habitación
  const updateMutation = useMutation({
    mutationFn: habitacionesAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitaciones'] })
    },
  })

  // PATCH: Actualización parcial
  const partialUpdateMutation = useMutation({
    mutationFn: habitacionesAPI.partialUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitaciones'] })
    },
  })

  // DELETE: Eliminar habitación
  const deleteMutation = useMutation({
    mutationFn: habitacionesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitaciones'] })
    },
  })

  return {
    // Datos
    habitaciones: Array.isArray(habitaciones) ? habitaciones : (habitaciones?.results || []),
    //habitaciones: habitaciones || [],
    isLoading,
    error,
    refetch,

    // Funciones
    createHabitacion: createMutation.mutate,
    updateHabitacion: updateMutation.mutate,
    toggleActiva: partialUpdateMutation.mutate,
    deleteHabitacion: deleteMutation.mutate,

    // Estados de las mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: partialUpdateMutation.isPending,

    // Errores de mutations
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  }
}

// Hook para una habitación específica
export function useHabitacion(id) {
  return useQuery({
    queryKey: ['habitaciones', id],
    queryFn: () => habitacionesAPI.getById(id),
    enabled: !!id,
  })
}