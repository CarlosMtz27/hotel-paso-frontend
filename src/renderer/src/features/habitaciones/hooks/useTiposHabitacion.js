import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tiposHabitacionAPI } from '@/api/endpoints'

/**
 * Hook para manejar Tipos de Habitación con React Query
 */
export function useTiposHabitacion() {
  const queryClient = useQueryClient()

  // GET: Obtener todos los tipos
  const {
    data: tipos,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tipos-habitacion'],
    queryFn: tiposHabitacionAPI.getAll,
  })

  // POST: Crear tipo
  const createMutation = useMutation({
    mutationFn: tiposHabitacionAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-habitacion'] })
    },
  })

  // PUT/PATCH: Actualizar tipo
  const updateMutation = useMutation({
    mutationFn: tiposHabitacionAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-habitacion'] })
    },
  })

  // PATCH: Actualización parcial (para activar/desactivar)
  const partialUpdateMutation = useMutation({
    mutationFn: tiposHabitacionAPI.partialUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-habitacion'] })
    },
  })

  // DELETE: Eliminar tipo
  const deleteMutation = useMutation({
    mutationFn: tiposHabitacionAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-habitacion'] })
    },
  })

  return {
    // Datos
   tipos: Array.isArray(tipos) ? tipos : (tipos?.results || []),
    isLoading,
    error,
    refetch,

    // Funciones
    createTipo: createMutation.mutate,
    updateTipo: updateMutation.mutate,
    toggleActivo: partialUpdateMutation.mutate,
    deleteTipo: deleteMutation.mutate,

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

// Hook para un tipo específico
export function useTipoHabitacion(id) {
  return useQuery({
    queryKey: ['tipos-habitacion', id],
    queryFn: () => tiposHabitacionAPI.getById(id),
    enabled: !!id,
  })
}