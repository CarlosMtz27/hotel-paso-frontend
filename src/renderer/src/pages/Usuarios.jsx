import { useState } from 'react'
import { useUsuarios } from '@/features/usuarios/hooks/useUsuarios'
import UsuarioModal from '@/features/usuarios/components/UsuarioModal'
import CambiarPasswordModal from '@/features/usuarios/components/CambiarPasswordModal'

export default function Usuarios() {
  const {
    usuarios,
    isLoading,
    error,
    createUsuario,
    updateUsuario,
    toggleActivo,
    deleteUsuario,
    changePassword,
    isCreating,
    isUpdating,
    isDeleting,
    isChangingPassword,
  } = useUsuarios()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  const [usuarioToDelete, setUsuarioToDelete] = useState(null)

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedUsuario(null)
    setIsModalOpen(true)
  }

  // Abrir modal para editar
  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario)
    setIsModalOpen(true)
  }

  // Abrir modal para cambiar contraseña
  const handleChangePassword = (usuario) => {
    setSelectedUsuario(usuario)
    setIsPasswordModalOpen(true)
  }

  // Guardar (crear o actualizar)
  const handleSave = (data) => {
    if (selectedUsuario) {
      updateUsuario(
        { id: selectedUsuario.id, data },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      )
    } else {
      createUsuario(data, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  // Guardar nueva contraseña
  const handleSavePassword = (data) => {
    if (selectedUsuario) {
      changePassword(
        { id: selectedUsuario.id, data },
        {
          onSuccess: () => setIsPasswordModalOpen(false),
        }
      )
    }
  }

  // Activar/Desactivar
  const handleToggleActivo = (usuario) => {
    toggleActivo({
      id: usuario.id,
      data: { is_active: !usuario.is_active },
    })
  }

  // Confirmar eliminación
  const handleDeleteConfirm = () => {
    if (usuarioToDelete) {
      deleteUsuario(usuarioToDelete.id, {
        onSuccess: () => setUsuarioToDelete(null),
      })
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-2">Gestión de usuarios y permisos del sistema</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Usuario
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar usuarios</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{usuario.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {usuario.first_name} {usuario.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          usuario.rol === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {usuario.rol === 'ADMIN' ? 'Administrador' : 'Empleado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          usuario.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {usuario.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Cambiar Password */}
                        <button
                          onClick={() => handleChangePassword(usuario)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Cambiar Contraseña"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>

                        {/* Editar */}
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Activar/Desactivar */}
                        <button
                          onClick={() => handleToggleActivo(usuario)}
                          className={`${
                            usuario.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={usuario.is_active ? 'Desactivar' : 'Activar'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {usuario.is_active ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => setUsuarioToDelete(usuario)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Crear/Editar */}
      <UsuarioModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUsuario(null)
        }}
        onSave={handleSave}
        usuario={selectedUsuario}
        isLoading={isCreating || isUpdating}
      />

      {/* Modal para Cambiar Contraseña */}
      <CambiarPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false)
          setSelectedUsuario(null)
        }}
        onSave={handleSavePassword}
        usuario={selectedUsuario}
        isLoading={isChangingPassword}
      />

      {/* Modal de Confirmación de Eliminación */}
      {usuarioToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar al usuario{' '}
              <span className="font-semibold">"{usuarioToDelete.username}"</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setUsuarioToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}