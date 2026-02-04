import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { estanciasAPI } from '@/api/endpoints'

/**
 * Hook para manejar Estancias con React Query
 */
export function useEstancias() {
  const queryClient = useQueryClient()

  // GET: Obtener todas las estancias
  const {
    data: responseData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['estancias'],
    queryFn: estanciasAPI.getAll,
    refetchInterval: 30000, // Refetch cada 30 segundos para actualizar temporizadores
  })

  // POST: Abrir estancia
  const abrirMutation = useMutation({
    mutationFn: estanciasAPI.abrir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estancias'] })
      queryClient.invalidateQueries({ queryKey: ['habitaciones'] })
    },
  })

  // POST: Agregar horas
  const agregarHorasMutation = useMutation({
    mutationFn: estanciasAPI.agregarHoras,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estancias'] })
    },
  })

  // POST: Cerrar estancia
  const cerrarMutation = useMutation({
    mutationFn: estanciasAPI.cerrar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estancias'] })
      queryClient.invalidateQueries({ queryKey: ['habitaciones'] })
    },
  })

  // DELETE: Eliminar estancia
  const deleteMutation = useMutation({
    mutationFn: estanciasAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estancias'] })
    },
  })

  return {
    // Datos
    // Si la respuesta es un array, úsalo. Si es un objeto (paginación), extrae `results`.
    estancias: Array.isArray(responseData)
      ? responseData
      : responseData?.results || [],
    isLoading,
    error,
    refetch,

    // Funciones
    abrirEstancia: abrirMutation.mutate,
    agregarHoras: agregarHorasMutation.mutate,
    cerrarEstancia: cerrarMutation.mutate,
    deleteEstancia: deleteMutation.mutate,

    // Estados de las mutations
    isAbriendo: abrirMutation.isPending,
    isAgregandoHoras: agregarHorasMutation.isPending,
    isCerrando: cerrarMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Errores de mutations
    abrirError: abrirMutation.error,
    agregarHorasError: agregarHorasMutation.error,
    cerrarError: cerrarMutation.error,
    deleteError: deleteMutation.error,
  }
}

// Hook para una estancia específica
export function useEstancia(id) {
  return useQuery({
    queryKey: ['estancias', id],
    queryFn: () => estanciasAPI.getById(id),
    enabled: !!id,
  })
}