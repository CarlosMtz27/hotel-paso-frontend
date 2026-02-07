import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usuariosAPI } from '@/api/endpoints'

/**
 * Hook para manejar Usuarios con React Query
 */
export function useUsuarios() {
  const queryClient = useQueryClient()

  // GET: Obtener todos los usuarios
  const {
    data: usuarios,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosAPI.getAll,
  })

  // POST: Crear usuario
  const createMutation = useMutation({
    mutationFn: usuariosAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })

  // PUT: Actualizar usuario
  const updateMutation = useMutation({
    mutationFn: usuariosAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })

  // PATCH: Actualización parcial (activar/desactivar)
  const partialUpdateMutation = useMutation({
    mutationFn: usuariosAPI.partialUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })

  // DELETE: Eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: usuariosAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })

  // POST: Cambiar contraseña
  const changePasswordMutation = useMutation({
    mutationFn: usuariosAPI.changePassword,
  })

  return {
    // Datos
    usuarios: Array.isArray(usuarios) ? usuarios : (usuarios?.results || []),
    isLoading,
    error,
    refetch,

    // Funciones
    createUsuario: createMutation.mutate,
    updateUsuario: updateMutation.mutate,
    toggleActivo: partialUpdateMutation.mutate,
    deleteUsuario: deleteMutation.mutate,
    changePassword: changePasswordMutation.mutate,

    // Estados de las mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,

    // Errores de mutations
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    changePasswordError: changePasswordMutation.error,
  }
}

// Hook para un usuario específico
export function useUsuario(id) {
  return useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => usuariosAPI.getById(id),
    enabled: !!id,
  })
}