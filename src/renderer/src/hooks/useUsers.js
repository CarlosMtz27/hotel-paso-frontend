import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

/**
 * Hook de ejemplo para manejar usuarios
 * Muestra cómo hacer CRUD con React Query
 */

// Funciones API
const usersAPI = {
  getAll: async () => {
    const response = await apiClient.get('/api/users/')
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/users/${id}/`)
    return response.data
  },

  create: async (userData) => {
    const response = await apiClient.post('/api/users/', userData)
    return response.data
  },

  update: async ({ id, data }) => {
    const response = await apiClient.patch(`/api/users/${id}/`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/users/${id}/`)
    return response.data
  },
}

export function useUsers() {
  const queryClient = useQueryClient()

  // GET: Obtener todos los usuarios
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersAPI.getAll,
  })

  // POST: Crear usuario
  const createMutation = useMutation({
    mutationFn: usersAPI.create,
    onSuccess: () => {
      // Invalidar lista de usuarios para refetch automático
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  // PATCH: Actualizar usuario
  const updateMutation = useMutation({
    mutationFn: usersAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  // DELETE: Eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: usersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    // Datos
    users,
    isLoading,
    error,
    refetch,

    // Mutations
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,

    // Estados de mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

// Hook para un usuario específico
export function useUser(userId) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersAPI.getById(userId),
    enabled: !!userId, // Solo ejecutar si hay userId
  })
}