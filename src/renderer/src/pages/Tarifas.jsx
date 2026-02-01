import { useState } from 'react'
import { useTarifas } from '@/features/tarifas/hooks/useTarifas'
import { useTiposHabitacion } from '@/features/habitaciones/hooks/useTiposHabitacion'
import TarifaModal from '@/features/tarifas/components/TarifaModal'

export default function Tarifas() {
  const {
    tarifas,
    isLoading,
    error,
    createTarifa,
    updateTarifa,
    toggleActiva,
    deleteTarifa,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTarifas()

  const { tipos } = useTiposHabitacion()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTarifa, setSelectedTarifa] = useState(null)
  const [tarifaToDelete, setTarifaToDelete] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroNocturna, setFiltroNocturna] = useState('')

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedTarifa(null)
    setIsModalOpen(true)
  }

  // Abrir modal para editar
  const handleEdit = (tarifa) => {
    setSelectedTarifa(tarifa)
    setIsModalOpen(true)
  }

  // Guardar (crear o actualizar)
  const handleSave = (formData) => {
    if (selectedTarifa) {
      // Actualizar
      updateTarifa(
        { id: selectedTarifa.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedTarifa(null)
          },
        }
      )
    } else {
      // Crear
      createTarifa(formData, {
        onSuccess: () => {
          setIsModalOpen(false)
        },
      })
    }
  }

  // Activar/Desactivar
  const handleToggleActiva = (tarifa) => {
    toggleActiva({
      id: tarifa.id,
      data: { activa: !tarifa.activa },
    })
  }

  // Confirmar eliminación
  const handleDeleteConfirm = () => {
    if (tarifaToDelete) {
      deleteTarifa(tarifaToDelete.id, {
        onSuccess: () => {
          setTarifaToDelete(null)
        },
      })
    }
  }

  // Filtrar tarifas
  const tarifasFiltradas = tarifas.filter((tarifa) => {
    const cumpleTipo = !filtroTipo || tarifa.tipo_habitacion === parseInt(filtroTipo)
    const cumpleEstado = !filtroEstado || (filtroEstado === 'activa' ? tarifa.activa : !tarifa.activa)
    const cumpleNocturna = !filtroNocturna || (filtroNocturna === 'si' ? tarifa.es_nocturna : !tarifa.es_nocturna)
    return cumpleTipo && cumpleEstado && cumpleNocturna
  })

  // Formatear precio
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tarifas</h1>
            <p className="text-gray-600 mt-2">Gestiona los precios por tipo de habitación y duración</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Tarifa
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Habitación
            </label>
            <select
              id="filtroTipo"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Todos</option>
              {tipos.filter(t => t.activo).map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtroEstado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="filtroEstado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Todas</option>
              <option value="activa">Activas</option>
              <option value="inactiva">Inactivas</option>
            </select>
          </div>

          <div>
            <label htmlFor="filtroNocturna" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              id="filtroNocturna"
              value={filtroNocturna}
              onChange={(e) => setFiltroNocturna(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Todas</option>
              <option value="si">Nocturnas</option>
              <option value="no">Diurnas</option>
            </select>
          </div>

          {(filtroTipo || filtroEstado || filtroNocturna) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroTipo('')
                  setFiltroEstado('')
                  setFiltroNocturna('')
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Tarifas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{tarifas.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Activas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {tarifas.filter(t => t.activa).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Nocturnas</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {tarifas.filter(t => t.es_nocturna).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Precio Promedio</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {tarifas.length > 0 
              ? formatPrecio(tarifas.reduce((sum, t) => sum + parseFloat(t.precio), 0) / tarifas.length)
              : '$0.00'}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando tarifas...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar tarifas</p>
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
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Habitación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
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
              {tarifasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No hay tarifas registradas
                  </td>
                </tr>
              ) : (
                tarifasFiltradas.map((tarifa) => (
                  <tr key={tarifa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{tarifa.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{tarifa.tipo_habitacion_nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tarifa.horas} hrs</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">{formatPrecio(tarifa.precio)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tarifa.es_nocturna ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          🌙 Nocturna
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          ☀️ Diurna
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tarifa.activa
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tarifa.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Ver detalles */}
                        {tarifa.es_nocturna && (
                          <button
                            title={`Horario: ${tarifa.hora_inicio_nocturna?.substring(0, 5)} - ${tarifa.hora_fin_nocturna?.substring(0, 5)}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}

                        {/* Editar */}
                        <button
                          onClick={() => handleEdit(tarifa)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Activar/Desactivar */}
                        <button
                          onClick={() => handleToggleActiva(tarifa)}
                          className={`${
                            tarifa.activa ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={tarifa.activa ? 'Desactivar' : 'Activar'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {tarifa.activa ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => setTarifaToDelete(tarifa)}
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
      <TarifaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTarifa(null)
        }}
        onSave={handleSave}
        tarifa={selectedTarifa}
        isLoading={isCreating || isUpdating}
      />

      {/* Modal de Confirmación de Eliminación */}
      {tarifaToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar la tarifa{' '}
              <span className="font-semibold">"{tarifaToDelete.nombre}"</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTarifaToDelete(null)}
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