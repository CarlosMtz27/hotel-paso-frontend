import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productosAPI } from '@/api/endpoints'

/**
 * Hook para manejar Productos con React Query
 */
export function useProductos() {
  const queryClient = useQueryClient()

  // GET: Obtener todos los productos
  const {
    data: productos,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['productos'],
    queryFn: productosAPI.getAll,
  })

  // POST: Crear producto
  const createMutation = useMutation({
    mutationFn: productosAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })

  // PUT: Actualizar producto
  const updateMutation = useMutation({
    mutationFn: productosAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })

  // PATCH: Actualización parcial
  const partialUpdateMutation = useMutation({
    mutationFn: productosAPI.partialUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })

  // DELETE: Eliminar producto
  const deleteMutation = useMutation({
    mutationFn: productosAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })

  return {
    // Datos
    productos: Array.isArray(productos) ? productos : (productos?.results || []),
    isLoading,
    error,
    refetch,

    // Funciones
    createProducto: createMutation.mutate,
    updateProducto: updateMutation.mutate,
    toggleActivo: partialUpdateMutation.mutate,
    deleteProducto: deleteMutation.mutate,

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

// Hook para un producto específico
export function useProducto(id) {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => productosAPI.getById(id),
    enabled: !!id,
  })
}