import { useState } from 'react'
import { useResumenDiario } from '../hooks/useReportes'

export default function ResumenDiario() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])

  const { data: resumen, isLoading, error } = useResumenDiario(fecha)

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio)
  }

  return (
    <div className="space-y-6">
      {/* Selector de Fecha */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-md">
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Fecha
          </label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando resumen...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar resumen</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Resumen */}
      {!isLoading && !error && resumen && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Turnos</p>
                  <p className="text-2xl font-semibold text-gray-900">{resumen.turnos}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sin ingresos: {resumen.turnos_sin_ingresos}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Ingresos</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {formatPrecio(resumen.total_ingresos)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Sueldos</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {formatPrecio(resumen.total_sueldos)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${
                  parseFloat(resumen.total_diferencias) === 0 ? 'bg-green-500' :
                  parseFloat(resumen.total_diferencias) > 0 ? 'bg-blue-500' :
                  'bg-red-500'
                } rounded-md p-3`}>
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Diferencias</p>
                  <p className={`text-2xl font-semibold ${
                    parseFloat(resumen.total_diferencias) === 0 ? 'text-green-600' :
                    parseFloat(resumen.total_diferencias) > 0 ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {formatPrecio(resumen.total_diferencias)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desglose por Método de Pago */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Desglose por Método de Pago
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-600">Efectivo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrecio(resumen.total_efectivo)}
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">Transferencia</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrecio(resumen.total_transferencia)}
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-600">Tarjeta</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrecio(resumen.total_tarjeta)}
                </p>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3 text-sm text-blue-700">
                <p className="font-medium">Resumen del día: {new Date(resumen.fecha).toLocaleDateString('es-MX', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p className="mt-1">
                  Este resumen incluye todos los turnos y movimientos de caja registrados en la fecha seleccionada.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}