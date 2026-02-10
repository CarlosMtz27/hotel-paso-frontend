import { useState } from 'react'
import { useEstancias } from '@/features/estancias/hooks/useEstancias'
import CountdownTimer from '@/features/estancias/components/CountdownTimer'

export default function Estancias() {
  const {
    estancias,
    isLoading,
    error,
    deleteEstancia,
    isDeleting,
  } = useEstancias()

  const [estanciaToDelete, setEstanciaToDelete] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroHabitacion, setFiltroHabitacion] = useState('')

  // Confirmar eliminación
  const handleDeleteConfirm = () => {
    if (estanciaToDelete) {
      deleteEstancia(estanciaToDelete.id, {
        onSuccess: () => {
          setEstanciaToDelete(null)
        },
      })
    }
  }

  // Filtrar estancias
  const estanciasFiltradas = estancias.filter((estancia) => {
    const cumpleEstado = !filtroEstado || 
      (filtroEstado === 'activa' ? estancia.activa : !estancia.activa)
    const cumpleHabitacion = !filtroHabitacion || 
      estancia.habitacion_numero?.toString().includes(filtroHabitacion)
    return cumpleEstado && cumpleHabitacion
  })

  // Formatear precio
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio)
  }

  // Calcular estadísticas
  const estanciasActivas = estancias.filter(e => e.activa).length
  const estanciasCerradas = estancias.filter(e => !e.activa).length
  const ingresosTotales = estancias
    .filter(e => !e.activa && e.total)
    .reduce((sum, e) => sum + parseFloat(e.total || 0), 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estancias</h1>
            <p className="text-gray-600 mt-2">Historial y control de estancias</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filtroHabitacion" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Habitación
            </label>
            <input
              type="text"
              id="filtroHabitacion"
              value={filtroHabitacion}
              onChange={(e) => setFiltroHabitacion(e.target.value)}
              placeholder="Número de habitación..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
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
              <option value="cerrada">Cerradas</option>
            </select>
          </div>

          {(filtroHabitacion || filtroEstado) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroHabitacion('')
                  setFiltroEstado('')
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
          <p className="text-sm font-medium text-gray-500">Total Estancias</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{estancias.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Activas</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{estanciasActivas}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Cerradas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{estanciasCerradas}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {formatPrecio(ingresosTotales)}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando estancias...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar estancias</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Habitación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarifa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salida Programada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salida Real
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estanciasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      {filtroHabitacion || filtroEstado
                        ? 'No se encontraron estancias con los filtros aplicados'
                        : 'No hay estancias registradas'}
                    </td>
                  </tr>
                ) : (
                  estanciasFiltradas.map((estancia) => (
                    <tr key={estancia.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{estancia.habitacion_numero}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{estancia.tarifa_nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(estancia.hora_entrada).toLocaleString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(estancia.hora_salida_programada).toLocaleString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {estancia.hora_salida_real ? (
                          <div className="text-sm text-gray-900">
                            {new Date(estancia.hora_salida_real).toLocaleString('es-MX', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">-</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            estancia.activa
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {estancia.activa ? 'Activa' : 'Cerrada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatPrecio(estancia.tarifa.precio)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {/* Eliminar (solo para estancias cerradas para evitar problemas) */}
                          {!estancia.activa && (
                            <button
                              onClick={() => setEstanciaToDelete(estancia)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {estanciaToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar la estancia{' '}
              <span className="font-semibold">#{estanciaToDelete.id}</span> de la habitación{' '}
              <span className="font-semibold">"{estanciaToDelete.habitacion_numero}"</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setEstanciaToDelete(null)}
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