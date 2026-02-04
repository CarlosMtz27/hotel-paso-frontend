import { useState } from 'react'
import { useTurnos } from '@/features/turnos/hooks/useTurnos'
import Loading from '@/components/common/Loading'

export default function Turnos() {
  const [page, setPage] = useState(1)
  const { turnos, pagination, isLoadingList, listError } = useTurnos({
    page,
    fetchList: true
  })

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00'
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Turnos</h1>
          <p className="text-gray-600 mt-2">Historial y estado de los turnos de trabajo.</p>
        </div>
      </div>

      {/* Loading and Error states */}
      {isLoadingList && <Loading message="Cargando turnos..." />}
      {listError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar los turnos</p>
          <p className="text-sm mt-1">{listError.message}</p>
        </div>
      )}

      {/* Table */}
      {!isLoadingList && !listError && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Turno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Caja Inicial</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Efectivo Reportado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {turnos.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    No hay turnos registrados.
                  </td>
                </tr>
              ) : (
                turnos.map((turno) => (
                  <tr key={turno.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{turno.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{turno.usuario_nombre || 'N/A'} ({turno.usuario_rol || 'N/A'})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{turno.tipo_turno}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(turno.fecha_inicio)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(turno.fecha_fin)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          turno.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {turno.activo ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{formatCurrency(turno.caja_inicial)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{formatCurrency(turno.efectivo_reportado)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-semibold ${turno.diferencia < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(turno.diferencia)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {pagination.count > 10 && ( // Asumiendo 10 items por página del backend
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.previous}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {page} de {Math.ceil(pagination.count / 10)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.next}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
