import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tarifasAPI } from '@/api/endpoints'

/**
 * Hook para manejar Tarifas con React Query
 */
export function useTarifas() {
  const queryClient = useQueryClient()

  // GET: Obtener todas las tarifas
  const {
    data: tarifas,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tarifas'],
    queryFn: tarifasAPI.getAll,
  })

  // POST: Crear tarifa
  const createMutation = useMutation({
    mutationFn: tarifasAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifas'] })
    },
  })

  // PUT: Actualizar tarifa
  const updateMutation = useMutation({
    mutationFn: tarifasAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifas'] })
    },
  })

  // PATCH: Actualización parcial
  const partialUpdateMutation = useMutation({
    mutationFn: tarifasAPI.partialUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifas'] })
    },
  })

  // DELETE: Eliminar tarifa
  const deleteMutation = useMutation({
    mutationFn: tarifasAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifas'] })
    },
  })

  return {
    // Datos
    tarifas: Array.isArray(tarifas) ? tarifas : (tarifas?.results || []),
    //tarifas: tarifas || [],
    isLoading,
    error,
    refetch,

    // Funciones
    createTarifa: createMutation.mutate,
    updateTarifa: updateMutation.mutate,
    toggleActiva: partialUpdateMutation.mutate,
    deleteTarifa: deleteMutation.mutate,

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

// Hook para una tarifa específica
export function useTarifa(id) {
  return useQuery({
    queryKey: ['tarifas', id],
    queryFn: () => tarifasAPI.getById(id),
    enabled: !!id,
  })
}