import { useState } from 'react'
import { useEmpleados, useDetalleEmpleado } from '../hooks/useReportes'

export default function ReporteEmpleados() {
  const { data: empleados, isLoading, error } = useEmpleados()
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null)
  
  const { data: detalle, isLoading: isLoadingDetalle } = useDetalleEmpleado(selectedEmpleadoId)

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio)
  }

  const handleVerDetalle = (empleadoId) => {
    setSelectedEmpleadoId(empleadoId)
  }

  const handleCerrarDetalle = () => {
    setSelectedEmpleadoId(null)
  }

  return (
    <div className="space-y-6">
      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando empleados...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar empleados</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Totales por Empleado
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Resumen histórico de todos los empleados
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turnos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sin Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efectivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transferencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sueldos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diferencias
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {empleados && empleados.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No hay datos de empleados
                    </td>
                  </tr>
                ) : (
                  empleados?.map((empleado) => (
                    <tr key={empleado.empleado_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {empleado.empleado}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {empleado.empleado_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empleado.turnos}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {empleado.turnos_sin_ingresos}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrecio(empleado.total_efectivo)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrecio(empleado.total_transferencia)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatPrecio(empleado.total_ingresos)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrecio(empleado.total_sueldos)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          parseFloat(empleado.total_diferencias) === 0 ? 'text-green-600' :
                          parseFloat(empleado.total_diferencias) > 0 ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {formatPrecio(empleado.total_diferencias)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleVerDetalle(empleado.empleado_id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Detalle */}
      {selectedEmpleadoId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Detalle de Turnos
                </h2>
                {detalle && (
                  <p className="text-sm text-gray-600 mt-1">
                    Empleado: {detalle.empleado}
                  </p>
                )}
              </div>
              <button
                onClick={handleCerrarDetalle}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoadingDetalle && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">Cargando detalle...</p>
                </div>
              )}

              {!isLoadingDetalle && detalle && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Caja Inicial</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diferencia</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detalle.turnos?.map((turno) => (
                        <tr key={turno.turno_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">#{turno.turno_id}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              turno.tipo_turno === 'DIA' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {turno.tipo_turno}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(turno.fecha_inicio).toLocaleString('es-MX', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {turno.fecha_fin ? new Date(turno.fecha_fin).toLocaleString('es-MX', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm">{formatPrecio(turno.caja_inicial)}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-semibold text-green-600">
                              {formatPrecio(turno.total_ingresos)}
                            </div>
                            <div className="text-xs text-gray-500">
                              E: {formatPrecio(turno.total_efectivo)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${
                              parseFloat(turno.diferencia) === 0 ? 'text-green-600' :
                              parseFloat(turno.diferencia) > 0 ? 'text-blue-600' :
                              'text-red-600'
                            }`}>
                              {formatPrecio(turno.diferencia)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}