import { useRankingEmpleados } from '../hooks/useReportes'

export default function RankingEmpleados() {
  const { data: ranking, isLoading, error } = useRankingEmpleados()

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio)
  }

  const getMedalIcon = (position) => {
    switch (position) {
      case 0:
        return '🥇'
      case 1:
        return '🥈'
      case 2:
        return '🥉'
      default:
        return `#${position + 1}`
    }
  }

  const getMedalColor = (position) => {
    switch (position) {
      case 0:
        return 'bg-yellow-100 border-yellow-300'
      case 1:
        return 'bg-gray-100 border-gray-300'
      case 2:
        return 'bg-orange-100 border-orange-300'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">🏆 Ranking de Empleados</h2>
            <p className="text-indigo-100 mt-1">
              Ordenados por ingresos totales generados
            </p>
          </div>
          <div className="text-6xl">👑</div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando ranking...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar ranking</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Ranking */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {ranking && ranking.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              No hay datos de empleados
            </div>
          ) : (
            ranking?.map((empleado, index) => (
              <div
                key={empleado.empleado_id}
                className={`border-2 rounded-lg p-6 transition-all hover:shadow-lg ${getMedalColor(index)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Posición */}
                    <div className="text-4xl font-bold">
                      {getMedalIcon(index)}
                    </div>

                    {/* Info del Empleado */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {empleado.empleado}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {empleado.turnos} turnos
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {empleado.turnos - empleado.turnos_sin_ingresos} con ventas
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total Ingresos */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-medium">Total Ingresos</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatPrecio(empleado.total_ingresos)}
                    </p>
                  </div>
                </div>

                {/* Desglose */}
                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-300">
                  <div>
                    <p className="text-xs text-gray-500">Efectivo</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrecio(empleado.total_efectivo)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transferencia</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrecio(empleado.total_transferencia)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sueldos</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrecio(empleado.total_sueldos)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Diferencias</p>
                    <p className={`font-semibold ${
                      parseFloat(empleado.total_diferencias) === 0 ? 'text-green-600' :
                      parseFloat(empleado.total_diferencias) > 0 ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {formatPrecio(empleado.total_diferencias)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}